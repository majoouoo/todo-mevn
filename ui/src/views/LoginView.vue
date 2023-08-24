<script setup>
import { ref } from 'vue'

import { store } from "../store.js"
store.isLoggedIn = localStorage.getItem("user") ? true : false

let username = ref(store.isLoggedIn ? JSON.parse(localStorage.getItem("user")).username : "")
let password = ref()
let error = ref("")

const login = () => {
  if (document.querySelector('form').reportValidity()) {
    fetch('http://localhost:8080/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    })
    .then(response => {
        if(response.status === 200) {
          response.json()
            .then(data => {
              localStorage.setItem("user", JSON.stringify({
                username: username.value,
                accessToken: data.accessToken
              }))
              store.isLoggedIn = true
              error.value = ""
            })
        } else {
          response.json()
            .then(data => error.value = data.err)
        }
      })
  }
}

const signup = () => {
  if (document.querySelector('form').reportValidity()) {
    fetch('http://localhost:8080/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    })
      .then(response => {
        if(response.status === 201) {
          response.json()
            .then(data => {
              localStorage.setItem("user", JSON.stringify({
                username: username.value,
                accessToken: data.accessToken
              }))
              store.isLoggedIn = true
              error.value = ""
            })
        } else {
          response.json()
            .then(data => error.value = data.err)
        }
      })
  }
}

const logout = () => {
  localStorage.removeItem("user")
  store.isLoggedIn = false
}

const deleteAccount = () => {
  fetch('http://localhost:8080/api/deleteaccount', {
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).accessToken
    }
  })
    .then(logout())
}
</script>

<template>
  <div id="outerDiv">
    <form v-if="!store.isLoggedIn">
      <h1>Login</h1>
      <div>
        <input type="text" name="username" id="username" v-model="username" required placeholder="Username" />
      </div>
      <div>
        <input type="password" name="password" id="password" v-model="password" required placeholder="Password" />
      </div>
      <div>
        <input type="submit" value="Log in" @click.prevent="login" />
        <input type="submit" value="Sign up" @click.prevent="signup" />
      </div>
      <p id="error">{{ error }}</p>
    </form>
    <div v-else>
      <h1>Logged in as {{ username }}</h1>
      <br>
      <button @click="logout">Log out</button>
      <button @click="deleteAccount">Delete account</button>
    </div>
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

input, button {
  background-color: transparent;
  border: 1px solid #3a3b52;
  outline: none;
  padding: 12px;
  width: 400px;
  height: 23px;
  border-radius: 50px;
  transition: border-radius 0.2s;
}

input:focus, button:focus,
input:hover, button:hover {
  border-radius: 5px;
}

input[type='submit'], button {
  margin: 0 10px 0 0;
  padding: 12px 20px;
  height: initial;
  width: initial;
}

::placeholder {
  color: #4f5069;
  opacity: 1;
}

#error {
  color: #fd7777;
}
</style>