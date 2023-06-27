<script setup>
import { ref } from "vue"

defineProps({
  taskName: String
})

let checked = ref(false)
</script>

<template>
  <div>
    <button @click="checked = !checked" :class="{ checked: checked }" id="checkBtn"></button>
    <span>{{ taskName }}</span>
    
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
}

span {
  font-weight: 500;
  font-size: 20px;

}

#checkBtn {
  height: 20px;
  width: 20px;
  border-radius: 20px;
  outline: none;
  background-color: transparent;
  border: 2px solid #949494;
}

#checkBtn.checked {
  background-color: red;
}
</style>
