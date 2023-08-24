<script setup>
import { ref, computed } from 'vue'
let name = ref()
let dateDue = ref()
let priority = ref('')

let isLoggedIn = ref(localStorage.getItem("user") ? true : false)

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
    dateDue.value = ''
    priority.value = ''
    document.getElementById('dateDue').type = 'text'
  }
}

const selectClass = computed(() => ({
  nullValue: !priority.value
}))
</script>

<template>
  <div id="outerDiv">
    <form v-if="isLoggedIn">
      <h1>Add Task</h1>
      <div>
        <input type="text" name="name" id="name" v-model="name" required placeholder="Name" />
      </div>
      <div>
        <input
          type="text"
          onfocus="(this.type='date')"
          onfocusout="(this.type='text')"
          name="dateDue"
          id="dateDue"
          v-model="dateDue"
          required
          placeholder="Date due"
        />
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
}

h1 {
  font-size: 24px;
}

div {
  margin: 20px 0;
}

* {
  font-size: 18px;
}

input,
select {
  background-color: transparent;
  border: 1px solid #3a3b52;
  outline: none;
  padding: 12px;
  width: 400px;
  height: 23px;
  border-radius: 50px;
  transition: border-radius 0.2s;
}

input:focus,
input:hover,
select:focus,
select:hover {
  border-radius: 5px;
}

input#dateDue {
  width: 260px;
  margin: 0 10px 0 0;
}

select#priority {
  width: 130px;
  height: 49px;
}

input[type='submit'] {
  margin: 0;
  padding: 12px 20px;
  height: initial;
  width: initial;
}

input[type='date']::-webkit-calendar-picker-indicator {
  filter: invert();
}

::placeholder,
.nullValue {
  color: #4f5069;
  opacity: 1;
}

select option {
  background-color: #0f101a;
}
</style>
