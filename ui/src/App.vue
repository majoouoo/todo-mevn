<script setup>
import { RouterLink, RouterView } from 'vue-router'

import { store } from "./store.js"
store.isLoggedIn = localStorage.getItem("user") ? true : false
</script>

<template>
  <header>
    <h1>To-Do List</h1>
    <nav>
      <RouterLink to="/" v-if="store.isLoggedIn">
        <span class="material-symbols-outlined"> home </span>
        <h2>Home</h2>
      </RouterLink>
      <RouterLink to="/add-task" v-if="store.isLoggedIn">
        <span class="material-symbols-outlined"> add_circle </span>
        <h2>Add Task</h2>
      </RouterLink>
      <RouterLink to="/login">
        <span class="material-symbols-outlined"> account_circle </span>
        <h2 v-if="!store.isLoggedIn">Login</h2>
        <h2 v-else>Account</h2>
      </RouterLink>
    </nav>
  </header>

  <section id="view">
    <RouterView />
  </section>
</template>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  height: 6vh;
  padding: 0 0 0 20px;
  align-items: center;
  background-color: var(--dark-green);
  position: sticky;
  top: 0;
  box-shadow: 0 4px 20px rgba(56, 102, 65, 0.5);
  z-index: 3;
}

header * {
  color: var(--white);
}

nav {
  display: flex;
}

nav a {
  display: inline-block;
  margin: 0 10px;
  display: flex;
  align-items: center;
  padding: 5px 20px;
}

nav a * {
  margin: 0 5px;
  color: var(--light-green);
  font-weight: 500;
}

.material-symbols-outlined {
  font-size: 1.5em;
}

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 27;
}

.router-link-active .material-symbols-outlined {
  font-variation-settings: 'FILL' 1, 'wght' 300, 'GRAD' 0, 'opsz' 27;
}

.router-link-active * {
  color: var(--lime);
}

/* #wrapper {
  background-color: var(--dark-green);
  padding: 0 20px 20px 20px;
  box-sizing: border-box;
  z-index: 2;
  height: 94vh;
  width: 100%;
  position: sticky;
  top: 6vh;
  left: 0;
}

#view {
  background-color: var(--tan);
  border-radius: 15px;
  min-height: calc(94vh - 40px);
} */
</style>
