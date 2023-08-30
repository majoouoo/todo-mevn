<script setup>
const props = defineProps({
  object: String
})
</script>

<template>
  <div id="backdrop" @click.self="$emit('cancel')">
    <div id="modal">
      <h1>Are you sure you want to delete this {{ props.object }}?</h1>
      <button id="cancelBtn" @click="$emit('cancel')">Cancel</button>
      <button id="deleteBtn" @click="$emit('delete')">Delete</button>
      <p v-if="props.object == 'task'">Shift-click to delete a task immediately</p>
    </div>
  </div>
</template>

<style scoped>
#backdrop {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  z-index: 2;
  backdrop-filter: blur(5px);
  padding: 100px;
  box-sizing: border-box;
  margin: 0;
}

#modal {
  background-color: #0f101a;
  width: fit-content;
  height: fit-content;
  border-radius: 20px;
  border: 1px solid #171827;
  z-index: 3;
  overflow: hidden;
  padding: 20px;
}

button {
  background-color: transparent;
  border: 1px solid #3a3b52;
  outline: none;
  border-radius: 50px;
  transition: border-radius 0.2s;
  margin: 20px 10px 0 0;
  padding: 12px 20px;
  height: initial;
  width: initial;
  font-size: 18px;
}

button:hover {
  border-radius: 5px;
}

#deleteBtn {
  border: 1px solid #fd7777;
  color: #fd7777;
}

p {
  color: #3a3b52;
  font-style: italic;
  margin: 20px 0 0 0;
}
</style>