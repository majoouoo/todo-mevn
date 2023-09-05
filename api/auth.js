const express = require('express')
const router = express.Router()
const cors = require("cors")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require('dotenv').config()
const { MongoClient, ObjectId } = require("mongodb")

router.use(express.json())

const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200
}

router.use(cors(corsOptions))

let database
const uri = "mongodb://127.0.0.1:27017"
const client = new MongoClient(uri)
async function connectToDb() {
  try {
    database = client.db("todo-mevn")
  } catch (err) {
    console.log(err)
  }
}

connectToDb()
const tasks = database.collection("tasks")
const users = database.collection("users")

const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]
  if(token == null) return res.status(401).json({ err: "Not logged in" })

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if(err) return res.status(403).json({ err: "Invalid token" })
    req.user = user
    next()
  })
}

router.post("/sign-up", (req, res) => {
  users.findOne({ username: req.body.username })
    .then((result) => {
      if (!result) {
        bcrypt.hash(req.body.password, 10)
          .then((hash) => {
            users.insertOne({
              username: req.body.username,
              password: hash
            })
              .then(() => {
                const accessToken = jwt.sign({
                  username: req.body.username,
                  password: hash
                }, process.env.ACCESS_TOKEN_SECRET)
                res.status(201).json({ accessToken: accessToken })
              })
              .catch((err) => res.status(500).json({ err: "Failed to write to DB", errCode: err }))
          })
          .catch((err) => res.status(500).json({ err: "Failed to hash password", errCode: err }))
      } else {
        res.status(409).json({ err: "Username is unavailable" })
      }
    })
})

router.post("/log-in", (req, res) => {
  users.findOne({ username: req.body.username })
    .then((user) => {
      if(user) {
        bcrypt.compare(req.body.password, user.password)
          .then((pwCorrect) => {
            if(pwCorrect) {
              const accessToken = jwt.sign({
                username: user.username,
                password: user.password
              }, process.env.ACCESS_TOKEN_SECRET)
              res.status(200).json({ accessToken: accessToken })
            } else {
              res.status(403).json({ err: "Wrong password" })
            }
          })
      } else {
        res.status(404).json({ err: "User does not exist" })
      }
    })
})

router.delete("/delete-account", authenticate, (req, res) => {
  users.deleteOne({ username: req.user.username })
    .then(() => {
      tasks.deleteMany({ user: req.user.username })
        .then(() => res.status(200).json({ msg: "User and tasks deleted" }))
    })
})

module.exports = router