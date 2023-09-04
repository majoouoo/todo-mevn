<script setup>
const props = defineProps({
  object: String
})
</script>

<template>
  <div class="modal">
    <h1>Are you sure you want to delete this {{ props.object }}?</h1>
    <button class="default-button" @click="$emit('cancel')">Cancel</button>
    <button class="default-button danger-button" @click="$emit('delete')">Delete</button>
    <p v-if="props.object == 'task'">Shift-click to delete a task immediately</p>
  </div>
</template>

<style scoped>
.modal {
  padding: 20px;
  border-radius: 20px;
  margin-top: 0;
}

* {
  margin-top: 20px;
  margin-bottom: 0;
}

h1 {
  margin-top: 0;
}

button {
  margin-right: 10px;
}

p {
  color: #3a3b52;
  font-style: italic;
}
</style>