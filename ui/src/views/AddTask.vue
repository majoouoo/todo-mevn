<script setup>
import { ref } from 'vue'
import DatePicker from "../components/DatePicker.vue"

let name = ref()
let dateDue = ref(new Date())
let priority = ref(3)

import { store } from "../store.js"
store.isLoggedIn = localStorage.getItem("user") ? true : false

const submitForm = () => {
  if (document.querySelector('form').reportValidity()) {
    fetch('http://localhost:8080/api/add-task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken
      },
      body: JSON.stringify({
        name: name.value,
        dateDue: dateDue.value,
        priority: priority.value
      })
    })

    name.value = ''
    priority.value = ''
  }
}
</script>

<template>
  <section id="wrapper">
    <form v-if="store.isLoggedIn">
      <h1>Add Task</h1>
      <section id="inputs">
        <input type="text" name="name" id="name" class="default-button" v-model="name" required placeholder="Name" />
        <select
          name="priority"
          id="priority"
          class="default-button"
          v-model="priority"
          required
          placeholder="Priority"
        >
          <option value="1" style="color: var(--first-p)">Priority 1</option>
          <option value="2" style="color: var(--second-p)">Priority 2</option>
          <option value="3">Priority 3</option>
        </select>
      </section>
      <DatePicker :initialDate="new Date()" :isModal="false" @done="(day, month, year) => dateDue = new Date(year, month, day)"></DatePicker>
      <input type="submit" value="Add" class="default-button primary-button" @click.prevent="submitForm" />
    </form>

    <h1 v-else>Logged out</h1>
  </section>
</template>

<style scoped>
#wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
}

form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

#inputs {
  display: grid;
  grid-template-columns: auto 140px;
  gap: 10px;
}

input[type=submit] {
  width: 120px;
}

::placeholder {
  color: #4f5069;
  opacity: 1;
}
</style>
