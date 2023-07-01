<script setup>
import { ref } from 'vue'

defineProps({
  taskName: String
})

let checked = ref(false)
</script>

<template>
  <div>
    <button @click="checked = !checked" id="checkBtn">
      <span class="material-symbols-outlined" v-if="checked"> task_alt </span>
      <span class="material-symbols-outlined" v-else> radio_button_unchecked </span>
    </button>
    <span id="taskName" :class="{ checked: checked }">{{ taskName }}</span>
  </div>
</template>

<style scoped>
div {
  background-color: #dbdbdb;
  border: 3px solid #dfdfdf;
  box-shadow: 0 3px 5px 0 #cfcfcf;
  margin: 20px;
  padding: 10px;
  border-radius: 15px;
  display: flex;
  align-items: center;
}

#taskName {
  font-weight: 500;
  font-size: 20px;
}

#taskName.checked {
  text-decoration: line-through;
  color: #7c7c7c;
}

#checkBtn {
  background-color: transparent;
  border: none;
}

.material-symbols-outlined {
  font-size: 24px;
  font-variation-settings:
  'FILL' 0,
  'wght' 500,
  'GRAD' 0,
  'opsz' 24
}
</style>
