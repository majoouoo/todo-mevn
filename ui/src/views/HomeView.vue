<script setup>
import { ref, onMounted } from "vue"
import TaskBody from '../components/TaskBody.vue'

let tasklist = ref()
onMounted(() => {
  fetch('http://localhost:8080/tasklist', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(body => {
      body.forEach(task => task.dateDue = new Date(Date.parse(task.dateDue)).toDateString())
      tasklist.value = body
    })
})
</script>

<template>
  <TaskBody v-for="task of tasklist" :key="task._id" :task-name="task.name" :date-due="task.dateDue"></TaskBody>
</template>

<style></style>
