<script setup>
import { ref } from "vue"

const today = new Date()
let month = ref(today.getMonth())
let year = ref(today.getFullYear())
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
</script>

<template>
  <div id="backdrop" @click.self="$emit('done', chosenDay, month, year)">
    <div id="modal">
      <div id="header">
        <h1>Set Date</h1>
        <button id="doneBtn" @click="$emit('done', chosenDay, month, year)">Done</button>
      </div>
      <div id="month">
        <button @click="prevMonth" id="prevMonth">
          <span class="material-symbols-outlined"> navigate_before </span>
        </button>
        <span id="chosenMonth">{{ new Date(year, month).toLocaleDateString('default', { month: "long" }) }} {{ year }}</span>
        <button @click="nextMonth" id="nextMonth">
          <span class="material-symbols-outlined"> navigate_next </span>
        </button>
      </div>
      <div id="calendar">
        <div class="day" v-for="day of daysInMonth" :key="day" :class="{ firstDay: day == 1, chosenDay: day == chosenDay }" @click="chooseDay(day)">
          {{ day }}
        </div>
      </div>
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
}

#modal {
  background-color: #0f101a;
  width: 500px;
  height: fit-content;
  margin: 100px;
  padding: 20px;
  border-radius: 20px;
  border: 1px solid #171827;
}

#header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.chosenDay {
  background-color: #e4e4e4;
  color: #0f101a;
}
</style>