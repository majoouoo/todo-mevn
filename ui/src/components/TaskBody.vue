<script setup>
import { onMounted, ref, computed } from 'vue'
import DatePicker from "./DatePicker.vue"
import DeleteModal from "./DeleteModal.vue"

defineEmits(['completeTask', 'deleteTask', 'sortTasks'])
const props = defineProps({
  task: Object
})
let taskMutable = ref(props.task)

let overdue = ref()
const today = new Date()
const dateToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
const checkOverdue = () => overdue.value = taskMutable.value.dateDue <= dateToday ? true : false
onMounted(checkOverdue)

const priorityClass = computed(() => ({
  firstPriority: (taskMutable.value.priority == 1) && (!taskMutable.value.complete),
  secondPriority: (taskMutable.value.priority == 2) && (!taskMutable.value.complete)
}))

let editMode = ref(false)
const editTask = () => {
  if (editMode.value && document.querySelector('#taskNameInput').reportValidity()) {
    fetch(`http://localhost:8080/api/edittask?id=${taskMutable.value._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken
      },
      body: JSON.stringify({
        name: taskMutable.value.name,
        priority: taskMutable.value.priority
      })
    })
  }
  editMode.value = !editMode.value
}

let rescheduleMode = ref(false)
const rescheduleTask = (day, month, year) => {
  if(rescheduleMode.value && day != -1) {
    fetch(`http://localhost:8080/api/rescheduletask?id=${taskMutable.value._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken
      },
      body: JSON.stringify({
        dateDue: new Date(year, month, day)
      })
    })
      .then(taskMutable.value.dateDue = new Date(year, month, day))
  }
  rescheduleMode.value = !rescheduleMode.value
  checkOverdue()
}

let completeBool = ref(taskMutable.value.complete)
let completeIcon = ref()
const changeIcon = () => {
  if(completeBool.value) {
    completeIcon.value = "task_alt"
  } else {
    completeIcon.value = "radio_button_unchecked"
  }
  completeBool.value = !completeBool.value
}
changeIcon()

let isDelModalVisible = ref(false)
</script>

<template>
  <div id="outerDiv">
    <button @click="$emit('completeTask')" id="checkBtn" title="Complete Task">
      <span class="material-symbols-outlined" @mouseenter="changeIcon" @mouseleave="changeIcon">{{ completeIcon }}</span>
    </button>
    
    <div id="innerDiv">
      <div id="textDiv">
        <p id="taskName" :class="{ complete: taskMutable.complete }" v-if="!editMode">{{ taskMutable.name }}</p>
        <input id="taskNameInput" type="text" v-model="taskMutable.name" required v-if="editMode">

        <p id="dateDue" :class="{ complete: taskMutable.complete, overdue }">
          {{ taskMutable.dateDue.toDateString() }}

          <span id="priority" :class="[{ complete: taskMutable.complete }, priorityClass]">
            <span class="material-symbols-outlined"> flag </span>
            <span id="priorityNumber" v-if="!editMode">{{ taskMutable.priority }}</span>
            <select name="priority" id="priorityInput" v-model="taskMutable.priority" required v-if="editMode">
              <option value="1" style="color: #fd7777">1</option>
              <option value="2" style="color: #fdb877">2</option>
              <option value="3" style="color: #e4e4e4">3</option>
            </select>
          </span>
        </p>
      </div>

      <div id="buttonDiv">
        <button @click="rescheduleTask()" id="rescheduleBtn" title="Reschedule Task">
          <span class="material-symbols-outlined"> calendar_month </span>
        </button>
        <button @click="editTask" id="editBtn" v-if="!editMode" title="Edit Task">
          <span class="material-symbols-outlined"> edit </span>
        </button>
        <button @click="editTask(); $emit('sortTasks')" id="doneBtn" v-if="editMode" title="Done">
          <span class="material-symbols-outlined"> done </span>
        </button>
        <button @click.exact="isDelModalVisible = true" @click.shift="$emit('deleteTask')" id="deleteBtn" title="Delete Task">
          <span class="material-symbols-outlined"> delete </span>
        </button>
        <DeleteModal v-if="isDelModalVisible" @cancel="isDelModalVisible = false" @delete="$emit('deleteTask')" object="task"></DeleteModal>
      </div>
    </div>
  </div>

  <div id="backdrop" v-if="rescheduleMode" @click.self="rescheduleMode = false">
    <DatePicker v-if="rescheduleMode" :initialDate="taskMutable.dateDue" :isModal="true" @done="(day, month, year) => { rescheduleTask(day, month, year); $emit('sortTasks') }"></DatePicker>
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

p, #taskNameInput {
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  overflow-wrap: anywhere;
}

#taskNameInput {
  background-color: transparent;
  border: none;
  padding: 0;
  background: linear-gradient(#4f50696e, #4f50696e) 0 90% / 100% 6px no-repeat;
}

#taskNameInput:focus {
  outline: none;
}

p#dateDue {
  font-weight: 300;
  font-size: 16px;
}

select option {
  background-color: #0f101a;
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

#textDiv > * {
  margin: 0 10px;
}

#buttonDiv {
  display: flex;
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

#priority {
  margin: 0 10px;
}

#priorityNumber {
  margin: 0 5px;
}

#priorityInput {
  background-color: transparent;
  border: none;
  font-size: 16px;
  margin: 0 1px;
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

#priority.complete * {
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
}
</style>
