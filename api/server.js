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

const authRoutes = require("./auth")
app.use("/auth", authRoutes)

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

app.patch("/api/complete-task", authenticate, (req, res) => {
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

app.post("/api/add-task", authenticate, (req, res) => {
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

app.delete("/api/delete-task", authenticate, (req, res) => {
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

app.patch("/api/edit-task", authenticate, (req, res) => {
  const taskId = req.query.id
  const body = req.body
  if (ObjectId.isValid(taskId)) {
    tasks.updateOne(
      { _id: new ObjectId(taskId), user: req.user.username },
      { $set: { "name": body.name, "priority": body.priority } }
    )
      .then(() => res.status(200).json({ msg: "Task modified" }))
      .catch((err) => res.status(500).json({ err: "Could not edit task", errCode: err }))
  } else {
    res.status(404).json({ err: "Invalid object ID" })
  }
})

app.patch("/api/reschedule-task", authenticate, (req, res) => {
  const taskId = req.query.id
  const body = req.body
  if (ObjectId.isValid(taskId)) {
    tasks.updateOne(
      { _id: new ObjectId(taskId), user: req.user.username },
      { $set: { "dateDue": new Date(body.dateDue) } }
    )
      .then(() => res.status(200).json({ msg: "Task rescheduled" }))
      .catch((err) => res.status(500).json({ err: "Could not reschedule task", errCode: err }))
  } else {
    res.status(404).json({ err: "Invalid object ID" })
  }
})