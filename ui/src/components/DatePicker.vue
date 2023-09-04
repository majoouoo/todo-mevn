<script setup>
import { ref, watch } from "vue"

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

watch(month, () => {
  calculateMonth()
})

watch(year, () => {
  calculateMonth()
})

const prevMonth = () => {
  if(month.value == 0) {
    month.value = 11
    year.value--
  } else {
    month.value--
  }
}

const nextMonth = () => {
  if(month.value == 11) {
    month.value = 0
    year.value++
  } else {
    month.value++
  }
}

const chooseDay = (day) => {
  chosenDay.value = day
}
chooseDay(props.initialDate.getDate())
</script>

<template>
  <div class="modal">
    <header>
      <h1>Set Date</h1>
      <button class="default-button primary-button" v-if="isModal" @click="$emit('done', chosenDay, month, year)">Done</button>
    </header>

    <section id="content">
      <section id="month">
        <button @click.prevent="prevMonth" class="icon-button">
          <span class="material-symbols-outlined"> navigate_before </span>
        </button>
        <span id="chosen-month">{{ new Date(year, month).toLocaleDateString('en-US', { month: "long" }) }} <input type="text" v-model="year" id="chosen-year"></span>
        <button @click.prevent="nextMonth" class="icon-button">
          <span class="material-symbols-outlined"> navigate_next </span>
        </button>
      </section>

      <section id="week-days">
        <h2>Mon</h2>
        <h2>Tue</h2>
        <h2>Wed</h2>
        <h2>Thu</h2>
        <h2>Fri</h2>
        <h2>Sat</h2>
        <h2>Sun</h2>
      </section>

      <section id="calendar">
        <div class="day" v-for="day of daysInMonth" :key="day"
          :class="{ 'first-day': day == 1, 'chosen-day': day == chosenDay, 'today': new Date(year, month, day) - dateToday == 0 }"
          @click="chooseDay(day); if(!isModal) { $emit('done', chosenDay, month, year) };">
          {{ day }}
        </div>
      </section>
    </section>
  </div>
</template>

<style scoped>
header {
  background-color: var(--dark-green);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}

h1 {
  color: var(--lime);
  margin-left: 10px;
}

#content {
  padding: 20px;
}

#week-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  text-align: center;
  margin: 10px 0;
}

#week-days * {
  color: var(--light-green);
  font-weight: 300;
}

#calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(v-bind("daysInMonth") / 7, 1fr);
  gap: 10px;
}

#month {
  text-transform: capitalize;
  display: flex;
  align-items: center;
  justify-content: center;
}

#chosen-month {
  min-width: 150px;
  text-align: center;
}

#chosen-year {
  border: none;
  width: 45px;
}

.icon-button {
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
  border: 1px solid rgba(0, 0, 0, 0.3);
  box-shadow: 0 4px 10px #00000015;
  cursor: pointer;
}

.first-day {
  grid-column: v-bind("firstDay");
}

.today {
  background-color: #00000015;
}

.chosen-day {
  background-color: var(--dark-green);
  color: var(--lime);
}
</style>