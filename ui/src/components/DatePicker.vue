<script setup>
import { ref } from "vue"

defineEmits(['done'])
const props = defineProps({
  initialDate: Object,
  isModal: Boolean
})

const today = new Date()
const dateToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
let month = ref(props.initialDate.getMonth())
let year = ref(props.initialDate.getFullYear())
let daysInMonth
let firstDay = ref()
let chosenDay = ref()

const calculateMonth = () => {
  daysInMonth = new Date(year.value, month.value + 1, 0).getDate()
  firstDay.value = new Date(year.value, month.value, 1).getDay()
  if(firstDay.value == 0) firstDay.value = 7
  chosenDay.value = -1
}
calculateMonth()

const prevMonth = () => {
  if(month.value == 0) {
    month.value = 11
    year.value--
  } else {
    month.value--
  }
  calculateMonth()
}

const nextMonth = () => {
  if(month.value == 11) {
    month.value = 0
    year.value++
  } else {
    month.value++
  }
  calculateMonth()
}

const chooseDay = (day) => {
  chosenDay.value = day
}
chooseDay(props.initialDate.getDate())
</script>

<template>
  <div id="modal">
    <header id="header">
      <h1>Set Date</h1>
      <button id="doneBtn" v-if="isModal" @click="$emit('done', chosenDay, month, year)">Done</button>
    </header>
    <section id="content">
      <div id="month">
        <button @click.prevent="prevMonth" id="prevMonth">
          <span class="material-symbols-outlined"> navigate_before </span>
        </button>
        <span id="chosenMonth">{{ new Date(year, month).toLocaleDateString('en-US', { month: "long" }) }} {{ year
        }}</span>
        <button @click.prevent="nextMonth" id="nextMonth">
          <span class="material-symbols-outlined"> navigate_next </span>
        </button>
      </div>
      <div id="calendar">
        <div class="day" v-for="day of daysInMonth" :key="day"
          :class="{ firstDay: day == 1, chosenDay: day == chosenDay, today: new Date(year, month, day) - dateToday == 0 }"
          @click="chooseDay(day); if(!isModal) { $emit('done', chosenDay, month, year) };">
          {{ day }}
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
#modal {
  background-color: #0f101a;
  width: 500px;
  height: fit-content;
  border-radius: 30px;
  border: 1px solid #171827;
  z-index: 3;
  overflow: hidden;
}

#header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 8px 5px 20px;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
}

#doneBtn {
  background-color: transparent;
  border: 1px solid #3a3b52;
  outline: none;
  border-radius: 50px;
  transition: border-radius 0.2s;
  margin: 0;
  padding: 12px 20px;
  height: initial;
  width: initial;
  font-size: 18px;
}

#doneBtn:hover {
  border-radius: 5px;
}

#content {
  padding: 20px;
}

#calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(v-bind("daysInMonth") / 7, 1fr);
  gap: 10px;
  margin: 10px 0 0 0;
}

#month {
  text-transform: capitalize;
  display: flex;
  align-items: center;
  justify-content: center;
}

#chosenMonth {
  min-width: 150px;
  text-align: center;
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

.day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.day:hover {
  border: 1px solid #3a3b52;
  cursor: pointer;
}

.firstDay {
  grid-column: v-bind("firstDay");
}

.today {
  background-color: #171827;
}

.chosenDay {
  background-color: #e4e4e4;
  color: #0f101a;
}
</style>