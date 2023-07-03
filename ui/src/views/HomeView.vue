<script setup>
import { ref, onMounted } from 'vue'
import TaskBody from '../components/TaskBody.vue'

let tasklist = ref()
const fetchTasklist = () => {
  fetch('http://localhost:8080/api/tasklist')
    .then((response) => response.json())
    .then((body) => {
      body.forEach((task) => (task.dateDue = new Date(Date.parse(task.dateDue)).toDateString()))
      tasklist.value = body
    })
}

onMounted(() => fetchTasklist())

const completeTask = (task) => {
  task.complete = !task.complete
  const taskId = task._id

  fetch(`http://localhost:8080/api/completetask?id=${taskId}`, {
    method: 'PATCH'
  })
}
</script>

<template>
  <div id="outerDiv">
    <TaskBody
      v-for="task of tasklist"
      :key="task._id"
      :task="task"
      @completeTask="completeTask(task)"
    ></TaskBody>
  </div>
</template>

<style scoped>
#outerDiv {
  overflow-y: auto;
}
</style>
