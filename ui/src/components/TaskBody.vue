<script setup>
import { onMounted, ref, computed } from 'vue'

const props = defineProps({
  task: Object
})

let overdue = ref()
onMounted(() => {
  overdue.value = Date.parse(props.task.dateDue) < new Date() ? true : false
})

const priorityClass = computed(() => ({
  firstPriority: (props.task.priority == 1) && (!props.task.complete),
  secondPriority: (props.task.priority == 2) && (!props.task.complete)
}))
</script>

<template>
  <div id="outerDiv">
    <button @click="$emit('completeTask')" id="checkBtn">
      <span class="material-symbols-outlined" v-if="task.complete"> task_alt </span>
      <span class="material-symbols-outlined" v-else> radio_button_unchecked </span>
    </button>
    <div id="innerDiv">
      <div id="textDiv">
        <p id="taskName" :class="{ complete: task.complete }">{{ task.name }}</p>
        <p id="dateDue" :class="{ complete: task.complete, overdue }">
          {{ task.dateDue }}
          <span id="priority" :class="[{ complete: task.complete }, priorityClass]">
            <span class="material-symbols-outlined"> flag </span>
            {{ task.priority }}
          </span>
        </p>
      </div>
      <div id="buttonDiv">
        <button @click="$emit('deleteTask')" id="deleteBtn">
          <span class="material-symbols-outlined"> delete </span>
        </button>
      </div>
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

#innerDiv {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

p {
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  overflow-wrap: anywhere;
}

p#dateDue {
  font-weight: 300;
  font-size: 16px;
}

.overdue {
  color: #fd7777;
}

.complete {
  color: #4f5069;
}

.complete#taskName {
  text-decoration: line-through;
}

#textDiv * {
  margin: 0 10px;
}

button {
  background-color: transparent;
  border: none;
  display: flex;
  align-items: center;
}

.material-symbols-outlined {
  font-size: 24px;
  font-variation-settings: 'FILL' 0, 'wght' 500, 'GRAD' 0, 'opsz' 24;
  cursor: pointer;
}

#priority .material-symbols-outlined {
  font-size: 16px;
  font-variation-settings: 'FILL' , 'wght' 500, 'GRAD' 0, 'opsz' 16;
  cursor: default;
  color: #e4e4e4;
  height: 20px;
  margin: 0;
  position: relative;
  top: 2px;
}

#priority.complete .material-symbols-outlined {
  color: #4f5069; 
}

#priority.firstPriority,
#priority.firstPriority * {
  color: #fd7777;
}

#priority.secondPriority,
#priority.secondPriority * {
  color: #fdb877;
}
</style>
