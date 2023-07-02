<script setup>
defineProps({
  task: Object
})
</script>

<template>
  <div id="outerDiv">
    <button @click="$emit('completeTask')" id="checkBtn">
      <span class="material-symbols-outlined" v-if="task.complete"> task_alt </span>
      <span class="material-symbols-outlined" v-else> radio_button_unchecked </span>
    </button>
    <div id="textDiv">
      <span id="taskName" :class="{ complete: task.complete }">{{ task.name }}</span>
      <span id="dateDue" :class="{ complete: task.complete }">{{ task.dateDue }}</span>
    </div>
  </div>
</template>

<style scoped>
#outerDiv {
  background-color: transparent;
  border: 1px solid #171827;
  margin: 20px;
  padding: 10px;
  border-radius: 5px;
  display: flex;
  align-items: center;
}

#textDiv {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

span {
  font-weight: 500;
  font-size: 20px;
}

span.complete {
  text-decoration: line-through;
  color: #4f5069;
}

#checkBtn {
  background-color: transparent;
  border: none;
}

.material-symbols-outlined {
  font-size: 24px;
  font-variation-settings: 'FILL' 0, 'wght' 500, 'GRAD' 0, 'opsz' 24;
}
</style>
