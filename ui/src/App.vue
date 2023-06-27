<script setup>
import { RouterLink, RouterView } from 'vue-router'

</script>

<template>
  <header>
    <h1>To-Do List</h1>
    <nav>
      <div>
        <RouterLink to="/"><span class="material-symbols-outlined"> home </span><p>Home</p></RouterLink>
      </div>
      <div>
        <RouterLink to="/add-task"><span class="material-symbols-outlined"> add_circle </span><p>Add Task</p></RouterLink>
      </div>
      <div>
        <RouterLink to="/calendar"><span class="material-symbols-outlined"> calendar_month </span><p>Calendar</p></RouterLink>
      </div>
    </nav>
  </header>

  <RouterView />
</template>

<style>
header {
  display: flex;
  justify-content: space-between;
  height: 6vh;
  padding: 0 0 0 20px;
  align-items: center;
  background-color: #202020;
  box-shadow: 0 0 30px #5e5e5e;
}

header * {
  color: #e4e4e4;
}

h1 {
  margin: 0;
  font-weight: 700;
  font-size: 24px;
}

nav div {
  display: inline-block;
}

nav div a {
  margin: 0 10px;
  font-weight: 500;
  font-size: 18px;
  display: flex;
  align-items: center;
  border-radius: 20px;
  padding: 5px 20px;
}

nav div a * {
  margin: 0 5px;
}

nav div a p {
  color: #7c7c7c;
}

.material-symbols-outlined {
  font-size: 1.5em;
  color: #7c7c7c;
}

.material-symbols-outlined {
  font-variation-settings:
  'FILL' 0,
  'wght' 300,
  'GRAD' 0,
  'opsz' 27
}

.router-link-active .material-symbols-outlined {
  font-variation-settings:
  'FILL' 1,
  'wght' 300,
  'GRAD' 0,
  'opsz' 27
}

.router-link-active * {
  color: #e4e4e4;
}
</style>
