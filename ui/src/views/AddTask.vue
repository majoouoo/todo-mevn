<script setup>
import { ref } from 'vue'
let name = ref()
let dateDue = ref()

const submitForm = () => {
  if (document.querySelector('form').reportValidity()) {
    fetch('http://localhost:8080/api/addtask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name.value,
        dateDue: dateDue.value
      })
    })

    name.value = ''
    dateDue.value = ''
    document.getElementById('dateDue').type = 'text'
  }
}
</script>

<template>
  <div id="outerDiv">
    <form>
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
      </div>
      <div>
        <input type="submit" value="Add" @click.prevent="submitForm" />
      </div>
    </form>
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

input {
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
input:hover {
  border-radius: 5px;
}

input[type='submit'] {
  margin: 0;
  padding: 12px 20px;
  height: initial;
  width: initial;
}

input[type='date']::-webkit-calendar-picker-indicator {
  filter: opacity(0);
}

::placeholder {
  color: #4f5069;
  opacity: 1;
}
</style>
