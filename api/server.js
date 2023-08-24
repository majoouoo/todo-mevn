const express = require("express")
const cors = require("cors")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require('dotenv').config()
const app = express()
const { MongoClient, ObjectId } = require("mongodb")

app.use(express.json())

const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

let database
const uri = "mongodb://127.0.0.1:27017"
const client = new MongoClient(uri)
async function connectToDb() {
  try {
    database = client.db("todo-mevn")
    app.listen(8080, () => {
      console.log("Server running on port 8080")
    })
  } catch (err) {
    console.log(err)
  }
}

connectToDb()
const tasks = database.collection("tasks")
const users = database.collection("users")

app.use(express.static("../ui/dist"))
app.use(express.static("../ui/dist/assets"))
app.get("/", (req, res) =>{
  res.status(200).sendFile("../ui/dist/index.html")
})

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

app.get("/api/tasklist", authenticate, (req, res) => {
  let tasklist = []
  tasks.find({
    user: req.user.username
  })
    .sort({ dateDue: 1, priority: 1 })
    .forEach(task => {
      tasklist.push(task)
    })
    .then(() => res.status(200).json(tasklist))
    .catch((err) => res.status(500).json({err: "Could not fetch all tasks", errCode: err}))
})

app.patch("/api/completetask", authenticate, (req, res) => {
  const taskId = req.query.id
  if(ObjectId.isValid(taskId)) {
    let isComplete
    tasks.findOne({
      _id: new ObjectId(taskId),
      user: req.user.username
    })
      .then(task => isComplete = task.complete)
      .then(() => {
        tasks.updateOne(
          { _id: new ObjectId(taskId) },
          { $set: { complete: !isComplete } }
        )
        .then(() => res.status(200).json({msg: "Task modified"}))
        .catch((err) => res.status(500).json({err: "Could not modify task", errCode: err}))
      })
  } else {
    res.status(404).json({err: "Invalid object ID"})
  }
})

app.post("/api/addtask", authenticate, (req, res) => {
  const body = req.body
  tasks.insertOne({
    name: body.name,
    dateDue: new Date(body.dateDue),
    priority: body.priority,
    complete: false,
    user: req.user.username
  })
    .then(() => res.status(201).json({msg: "New task added"}))
    .catch((err) => res.status(500).json({err: "Failed to add task", errCode: err}))
})

app.delete("/api/deletetask", authenticate, (req, res) => {
  const taskId = req.query.id
  if(ObjectId.isValid(taskId)) {
    tasks.deleteOne({
      _id: new ObjectId(taskId),
      user: req.user.username
    })
      .then(() => res.status(200).json({msg: "Task deleted"}))
      .catch((err) => res.status(500).json({err: "Could not delete task", errCode: err}))
  } else {
    res.status(404).json({err: "Invalid object ID"})
  }
})

// AUTH

app.post("/api/signup", (req, res) => {
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

app.post("/api/login", (req, res) => {
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

app.delete("/api/deleteaccount", authenticate, (req, res) => {
  users.deleteOne({ username: req.user.username })
    .then(() => {
      tasks.deleteMany({ user: req.user.username })
        .then(() => res.status(200).json({ msg: "User and tasks deleted" }))
    })
})