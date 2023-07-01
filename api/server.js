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

app.get("/tasklist", (req, res) => {
  let tasklist = []
  tasks.find()
    .sort({ dateDue: 1 })
    .forEach(task => {
      tasklist.push(task)
    })
    .then(() => {
      res.status(200).json(tasklist)
    })
    .catch((err) => {
      res.status(500).json({err: "Could not fetch all tasks", errCode: err})
    })
})

app.post("/addtask", (req, res) => {
  
})