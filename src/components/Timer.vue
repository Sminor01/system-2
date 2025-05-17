<template>
  <div class="timer">
    <div class="display">{{ formattedTime }}</div>
    <div class="controls">
      <button @click="startTimer" :disabled="isRunning">Start</button>
      <button @click="stopTimer" :disabled="!isRunning">Stop</button>
      <button @click="resetTimer">Reset</button>
    </div>
  </div>
</template>

<script setup>
import { computed, onUnmounted, ref } from 'vue'

const time = ref(0)
const isRunning = ref(false)
let timerInterval = null

const formattedTime = computed(() => {
  const hours = Math.floor(time.value / 3600)
  const minutes = Math.floor((time.value % 3600) / 60)
  const seconds = time.value % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})

const startTimer = () => {
  isRunning.value = true
  timerInterval = setInterval(() => {
    time.value++
  }, 1000)
}

const stopTimer = () => {
  isRunning.value = false
  clearInterval(timerInterval)
  saveTime()
}

const resetTimer = () => {
  time.value = 0
  isRunning.value = false
  clearInterval(timerInterval)
}

const saveTime = () => {
  try {
    const savedTimes = JSON.parse(localStorage.getItem('trackedTimes') || '[]')
    savedTimes.push({
      time: time.value,
      date: new Date().toISOString()
    })
    localStorage.setItem('trackedTimes', JSON.stringify(savedTimes))
  } catch (error) {
    console.error('Error saving time:', error)
  }
}

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
})
</script>

<style scoped>
.timer {
  text-align: center;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
  margin: 20px 0;
}

.display {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  font-family: monospace;
}

.controls {
  display: flex;
  gap: 10px;
  justify-content: center;
}

button {
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: #4CAF50;
  color: white;
  transition: background 0.3s;
}

button:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background: #45a049;
}
</style> 