<script setup>
import { ref, computed } from 'vue'
import DatePicker from "../components/DatePicker.vue"

let name = ref()
let dateDue = ref(new Date())
let priority = ref('')

import { store } from "../store.js"
store.isLoggedIn = localStorage.getItem("user") ? true : false

const submitForm = () => {
  if (document.querySelector('form').reportValidity()) {
    fetch('http://localhost:8080/api/addtask', {
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

const selectClass = computed(() => ({
  nullValue: !priority.value
}))
</script>

<template>
  <div id="outerDiv">
    <form v-if="store.isLoggedIn">
      <h1>Add Task</h1>
      <div id="inputDiv">
        <input type="text" name="name" id="name" v-model="name" required placeholder="Name" />
        <select
          name="priority"
          id="priority"
          v-model="priority"
          required
          placeholder="Priority"
          :class="selectClass"
        >
          <option value="" disabled hidden>Priority</option>
          <option value="1" style="color: #fd7777">Priority 1</option>
          <option value="2" style="color: #fdb877">Priority 2</option>
          <option value="3">Priority 3</option>
        </select>
      </div>
      <div id="datePicker">
        <DatePicker :initialDate="new Date()" :isModal="false" @done="(day, month, year) => dateDue = new Date(year, month, day)"></DatePicker>
      </div>
      <div>
        <input type="submit" value="Add" @click.prevent="submitForm" />
      </div>
    </form>
    <h1 v-else>Logged out</h1>
  </div>
</template>

<style scoped>
#outerDiv {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
}

h1 {
  font-size: 24px;
}

* {
  font-size: 18px;
}

form {
  display: grid;
  grid-template-rows: auto auto auto;
  gap: 20px;
}

#inputDiv {
  display: grid;
  grid-template-columns: auto 140px;
  gap: 20px;
}

input,
select {
  background-color: transparent;
  border: 1px solid #3a3b52;
  outline: none;
  padding: 12px;
  border-radius: 50px;
  transition: border-radius 0.2s;
}

input:focus,
input:hover,
select:focus,
select:hover {
  border-radius: 5px;
}

input[type='submit'] {
  margin: 0;
  padding: 12px 20px;
  height: initial;
  width: initial;
}

::placeholder,
.nullValue {
  color: #4f5069;
  opacity: 1;
}

select option {
  background-color: #0f101a;
}

#datePicker {
  border: 1px solid #3a3b52;
  border-radius: 30px;
}
</style>
