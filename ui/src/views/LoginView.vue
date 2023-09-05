<script setup>
import { ref } from 'vue'
import DeleteModal from "../components/DeleteModal.vue"

import { store } from "../store.js"
store.isLoggedIn = localStorage.getItem("user") ? true : false

let username = ref(store.isLoggedIn ? JSON.parse(localStorage.getItem("user")).username : "")
let password = ref()
let error = ref("")

const login = () => {
  if (document.querySelector('form').reportValidity()) {
    fetch('http://localhost:8080/auth/log-in', {
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
    fetch('http://localhost:8080/auth/sign-up', {
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

let isDelModalVisible = ref(false)
const deleteAccount = () => {
  fetch('http://localhost:8080/auth/delete-account', {
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).accessToken
    }
  })
    .then(() => {
      logout()
      isDelModalVisible.value = false
    })
}
</script>

<template>
  <section v-if="!store.isLoggedIn">
    <form>
      <h1>Login</h1>
      <div class="inputs">
        <input type="text" name="username" class="default-button" v-model="username" required placeholder="Username" />
        <input type="password" name="password" class="default-button" v-model="password" required placeholder="Password" />
      </div>
      <div class="buttons">
        <input type="submit" value="Log in" class="default-button primary-button" @click.prevent="login" />
        <input type="submit" value="Sign up" class="default-button" @click.prevent="signup" />
      </div>
      <h2 id="error" v-if="error"><span class="material-symbols-outlined"> error </span> {{ error }}</h2>
    </form>
  </section>
  <section v-else>
    <div class="flex-div">
      <h1>Logged in as {{ username }}</h1>
      <div class="buttons">
        <button @click="logout" class="default-button primary-button">Log out</button>
        <button @click="isDelModalVisible = true" class="default-button danger-button">Delete account</button>
      </div>
    </div>
  </section>

  <div class="backdrop" v-if="isDelModalVisible" @click.self="isDelModalVisible = false">
    <DeleteModal v-if="isDelModalVisible" @cancel="isDelModalVisible = false" @delete="deleteAccount" object="account"></DeleteModal>
  </div>
</template>

<style scoped>
section {
  display: flex;
  justify-content: center;
  padding: 40px;
}

form, .flex-div {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.buttons, .inputs {
  display: flex;
  gap: 10px;
}

.inputs {
  flex-direction: column;
}

form {
  width: 100%;
  max-width: 400px;
}

::placeholder {
  color: var(--dark-green);
}

#error {
  color: var(--red);
  display: flex;
  align-items: center;
  gap: 5px;
}

#error * {
  color: var(--red);
}

.material-symbols-outlined {
  font-size: 24px;
  font-variation-settings: 'FILL' 0, 'wght' 500, 'GRAD' 0, 'opsz' 24;
}
</style>