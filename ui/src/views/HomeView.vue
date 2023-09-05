<script setup>
import { ref, onMounted } from 'vue'
import TaskBody from '../components/TaskBody.vue'

let tasklist = ref([])
let tasklistCompleted = ref([])
let noTasks = ref(false)

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
      if(body.length == 0) noTasks.value = true
      for(let i = 0; i < body.length; i++) {
        const task = body[i]
        task.dateDue = new Date(Date.parse(task.dateDue))
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
  if(tasklist.value.length + tasklistCompleted.value.length == 0) noTasks.value = true
}

const completeTask = (task) => {
  fetch(`http://localhost:8080/api/complete-task?id=${task._id}`, {
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
  fetch(`http://localhost:8080/api/delete-task?id=${task._id}`, {
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
  <section id="tasklist" v-if="store.isLoggedIn">
    <TaskBody
      v-for="task of tasklist"
      :key="task._id"
      :task="task"
      @completeTask="completeTask(task)"
      @deleteTask="deleteTask(task)"
      @sortTasks="sortTasks"
    ></TaskBody>
  </section>

  <h1 id="tasklist-completed-title" v-if="tasklistCompleted.length > 0">Completed Tasks</h1>
  <section id="tasklist-completed" v-if="store.isLoggedIn">
    <TaskBody
      v-for="task of tasklistCompleted"
      :key="task._id"
      :task="task"
      @completeTask="completeTask(task)"
      @deleteTask="deleteTask(task)"
      @sortTasks="sortTasks"
    ></TaskBody>
  </section>

  <section id="messages">
    <h1 v-if="noTasks">No tasks</h1>
    <h1 v-if="!store.isLoggedIn">Logged out</h1>
  </section>
</template>

<style scoped>
#tasklist {
  overflow-y: auto;
}

#tasklist-completed-title {
  font-size: 20px;
  color: #595a75;
  margin: 20px;
}

#messages {
  padding: 40px 0;
  display: flex;
  justify-content: center;
}

#messages * {
  color: #0000009c;
}
</style>
