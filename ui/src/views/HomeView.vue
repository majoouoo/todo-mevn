<script setup>
import { ref, onMounted } from 'vue'
import TaskBody from '../components/TaskBody.vue'

let tasklist = ref([])
let tasklistCompleted = ref([])

import { store } from "../store.js"
store.isLoggedIn = localStorage.getItem("user") ? true : false

const fetchTasklist = () => {
  if(store.isLoggedIn) {
    fetch('http://localhost:8080/api/tasklist', {
    headers: {
      "Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken
    }
  })
    .then((response) => response.json())
    .then((body) => {
      for(let i = 0; i < body.length; i++) {
        const task = body[i]
        task.dateDue = new Date(Date.parse(task.dateDue)).toDateString()
        task.index = i
        task.complete ? tasklistCompleted.value.push(task) : tasklist.value.push(task)
      }
    })
  }
}

onMounted(() => fetchTasklist())

const removeTaskFromList = (task) => {
  const taskId = task._id
  if(task.complete) {
    const index = tasklistCompleted.value.findIndex((taskFromList) => taskFromList._id == taskId)
    tasklistCompleted.value.splice(index, 1)
  } else {
    const index = tasklist.value.findIndex((taskFromList) => taskFromList._id == taskId)
    tasklist.value.splice(index, 1)
  }
}

const completeTask = (task) => {
  fetch(`http://localhost:8080/api/completetask?id=${task._id}`, {
    method: 'PATCH',
    headers: {
      "Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken
    }
  })
    .then(() => {
      removeTaskFromList(task)
      task.complete = !task.complete
      const newTasklist = task.complete ? tasklistCompleted : tasklist
      newTasklist.value.push(task)
      newTasklist.value.sort((a, b) => a.index - b.index)
    })
}

const deleteTask = (task) => {
  fetch(`http://localhost:8080/api/deletetask?id=${task._id}`, {
    method: 'DELETE',
    headers: {
      "Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken
    }
  }).then(() => {
    removeTaskFromList(task)
  })
}

const sortingAlgorithm = (a, b) => {
  if(Date.parse(a.dateDue) - Date.parse(b.dateDue) != 0) {
    return Date.parse(a.dateDue) - Date.parse(b.dateDue)
  } else {
    return a.priority - b.priority
  }
}

const sortTasks = () => {
  tasklist.value.sort((a, b) => sortingAlgorithm(a, b))
  tasklistCompleted.value.sort((a, b) => sortingAlgorithm(a, b))
}
</script>

<template>
  <div id="tasklist" v-if="store.isLoggedIn">
    <TaskBody
      v-for="task of tasklist"
      :key="task._id"
      :task="task"
      @completeTask="completeTask(task)"
      @deleteTask="deleteTask(task)"
      @sortTasks="sortTasks"
    ></TaskBody>
  </div>
  <div id="tasklistCompleted" v-if="store.isLoggedIn">
    <h3 id="tasklistCompletedTitle" v-if="tasklistCompleted.length > 0">Completed Tasks</h3>
    <TaskBody
      v-for="task of tasklistCompleted"
      :key="task._id"
      :task="task"
      @completeTask="completeTask(task)"
      @deleteTask="deleteTask(task)"
      @sortTasks="sortTasks"
    ></TaskBody>
  </div>
  <h1 v-if="store.isLoggedIn && tasklist.length + tasklistCompleted.length == 0">No tasks</h1>
  <h1 v-if="!store.isLoggedIn">Logged out</h1>

</template>

<style scoped>
#tasklist {
  overflow-y: auto;
}

#tasklistCompletedTitle {
  color: #595a75;
  margin: 20px;
}

h1 {
  text-align: center;
  margin: 20px;
}
</style>
