<script setup>
import { ref } from 'vue'
import router from '../router';
let username = ref()
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
      .then(() => router.push("/"))
  }
}

const signUp = () => {
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
          router.push("/")
        } else {
          response.json()
            .then(data => error.value = data.err)
        }
      })
  }
}
</script>

<template>
  <div id="outerDiv">
    <form>
      <h1>Login</h1>
      <div>
        <input type="text" name="username" id="username" v-model="username" required placeholder="Username" />
      </div>
      <div>
        <input type="password" name="password" id="password" v-model="password" required placeholder="Password" />
      </div>
      <div>
        <input type="submit" value="Login" @click.prevent="login" />
        <input type="submit" value="Sign Up" @click.prevent="signUp" />
      </div>
      <p id="error">{{ error }}</p>
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