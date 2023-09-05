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
const checkOverdue = () => overdue.value = taskMutable.value.dateDue < dateToday
onMounted(checkOverdue)

const priorityClass = computed(() => ({
  'first-priority': (taskMutable.value.priority == 1) && (!taskMutable.value.complete),
  'second-priority': (taskMutable.value.priority == 2) && (!taskMutable.value.complete)
}))

let editMode = ref(false)
const editTask = () => {
  if (editMode.value && document.querySelector('#task-name-input').reportValidity()) {
    fetch(`http://localhost:8080/api/edit-task?id=${taskMutable.value._id}`, {
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
    fetch(`http://localhost:8080/api/reschedule-task?id=${taskMutable.value._id}`, {
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
  <div id="wrapper" :class="{ complete: taskMutable.complete }">
    <button @click="$emit('completeTask')" id="check-btn" title="Complete Task">
      <span class="material-symbols-outlined" @mouseenter="changeIcon" @mouseleave="changeIcon">{{ completeIcon }}</span>
    </button>
    
    <section id="content">
      <section id="text">
        <h1 id="task-name" v-if="!editMode">{{ taskMutable.name }}</h1>
        <input id="task-name-input" type="text" v-model="taskMutable.name" required v-if="editMode">

        <div id="subtitle">
          <h2 id="date-due" :class="{ overdue }">
            {{ taskMutable.dateDue.toDateString() }}
          </h2>

          <h2 id="priority" :class="priorityClass">
            <span class="material-symbols-outlined"> crisis_alert </span>
            <span id="priority-number" v-if="!editMode">{{ taskMutable.priority }}</span>
            <select name="priority" id="priority-input" v-model="taskMutable.priority" required v-if="editMode">
              <option value="1" style="color: var(--first-p)">1</option>
              <option value="2" style="color: var(--second-p)">2</option>
              <option value="3" style="color: var(--black)">3</option>
            </select>
          </h2>
        </div>
      </section>

      <section id="buttons">
        <button @click="rescheduleTask()" id="reschedule-btn" title="Reschedule Task">
          <span class="material-symbols-outlined"> calendar_month </span>
        </button>
        <button @click="editTask" id="edit-btn" v-if="!editMode" title="Edit Task">
          <span class="material-symbols-outlined"> edit </span>
        </button>
        <button @click="editTask(); $emit('sortTasks')" id="done-btn" v-if="editMode" title="Done">
          <span class="material-symbols-outlined"> done </span>
        </button>
        <button @click.exact="isDelModalVisible = true" @click.shift="$emit('deleteTask')" id="delete-btn" title="Delete Task">
          <span class="material-symbols-outlined"> delete </span>
        </button>
      </section>
    </section>
  </div>

  <div class="backdrop" v-if="isDelModalVisible" @click.self="isDelModalVisible = false">
    <DeleteModal v-if="isDelModalVisible" @cancel="isDelModalVisible = false" @delete="$emit('deleteTask')" object="task"></DeleteModal>
  </div>

  <div class="backdrop" v-if="rescheduleMode" @click.self="rescheduleMode = false">
    <DatePicker v-if="rescheduleMode" :initialDate="taskMutable.dateDue" :isModal="true" @done="(day, month, year) => { rescheduleTask(day, month, year); $emit('sortTasks') }"></DatePicker>
  </div>
</template>

<style scoped>
#wrapper {
  background: linear-gradient(45deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%);
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  margin: 20px;
  padding: 20px 10px;
  border-radius: 10px;
  display: flex;
  align-items: center;
}

#content {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

#text {
  margin: 0 10px;
}

h1, #task-name-input {
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  overflow-wrap: anywhere;
}

#task-name-input {
  background-color: transparent;
  border: none;
  padding: 0;
  background: linear-gradient(#4f50696e, #4f50696e) 0 90% / 100% 6px no-repeat;
}

#task-name-input:focus {
  outline: none;
}

#subtitle {
  display: flex;
}

h2 {
  font-weight: 300;
  font-size: 16px;
}

#buttons {
  display: flex;
  align-items: center;
}

button {
  background-color: transparent;
  border: none;
  display: flex;
  align-items: center;
  cursor: pointer;
  height: fit-content;
}

.material-symbols-outlined {
  font-size: 24px;
  font-variation-settings: 'FILL' 0, 'wght' 500, 'GRAD' 0, 'opsz' 24;
}

.material-symbols-outlined:hover {
  color: #4f5069;
}

#priority {
  margin: 0 10px;
  height: 20px;
}

#priority-number {
  font-size: 16px;
  margin: 0 4px;
  font-weight: 400;
}

#priority-input {
  background-color: transparent;
  border: none;
  font-size: 16px;
}

#priority .material-symbols-outlined {
  font-size: 16px;
  font-variation-settings: 'FILL' , 'wght' 500, 'GRAD' 0, 'opsz' 16;
  cursor: default;
  height: 20px;
  margin: 0;
  position: relative;
  top: 2px;
}

#priority.first-priority,
#priority.first-priority * {
  color: var(--first-p);
}

#priority.second-priority,
#priority.second-priority * {
  color: var(--second-p);
}

.overdue {
  color: var(--red);
  text-shadow: 0 0 10px #cf00039f;
}

.complete .overdue {
  text-shadow: none;
}

#wrapper.complete {
  background: linear-gradient(45deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.05) 100%);
}

.complete * {
  color: #4f5069;
}

.complete #task-name {
  text-decoration: line-through;
}
</style>
