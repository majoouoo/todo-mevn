const express = require("express")
const cors = require("cors")
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

app.get("/api/tasklist", (req, res) => {
  let tasklist = []
  tasks.find()
    .sort({ dateDue: 1 })
    .forEach(task => {
      tasklist.push(task)
    })
    .then(() => res.status(200).json(tasklist))
    .catch((err) => res.status(500).json({err: "Could not fetch all tasks", errCode: err}))
})

app.patch("/api/completetask", (req, res) => {
  const taskId = req.query.id
  if(ObjectId.isValid(taskId)) {
    let isComplete
    tasks.findOne({_id: new ObjectId(taskId)})
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
    res.status(500).json({err: "Invalid object ID"})
  }
})

app.post("/api/addtask", (req, res) => {
  const body = req.body
  tasks.insertOne({
    name: body.name,
    dateDue: new Date(body.dateDue),
    complete: false
  })
    .then(() => res.status(200).json({msg: "New task added"}))
    .catch((err) => res.status(500).json({err: "Failed to add task", errCode: err}))
})