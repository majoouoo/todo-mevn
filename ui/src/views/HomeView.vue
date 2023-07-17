<script setup>
import { ref, onMounted } from 'vue'
import TaskBody from '../components/TaskBody.vue'

let tasklist = ref([])
let tasklistCompleted = ref([])
const fetchTasklist = () => {
  fetch('http://localhost:8080/api/tasklist')
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
    method: 'PATCH'
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
    method: 'DELETE'
  }).then(() => {
    removeTaskFromList(task)
  })
}
</script>

<template>
  <div id="tasklist">
    <TaskBody
      v-for="task of tasklist"
      :key="task._id"
      :task="task"
      @completeTask="completeTask(task)"
      @deleteTask="deleteTask(task)"
    ></TaskBody>
  </div>
  <div id="tasklistCompleted">
    <h3 id="tasklistCompletedTitle" v-if="tasklistCompleted.length > 0">Completed Tasks</h3>
    <TaskBody
      v-for="task of tasklistCompleted"
      :key="task._id"
      :task="task"
      @completeTask="completeTask(task)"
      @deleteTask="deleteTask(task)"
    ></TaskBody>
  </div>

</template>

<style scoped>
#tasklist {
  overflow-y: auto;
}

#tasklistCompletedTitle {
  color: #595a75;
  margin: 20px;
}
</style>
