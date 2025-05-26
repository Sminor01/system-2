<template>
  <div class="statistics">
    <h2>Статистика задач</h2>
    
    <div class="stats-grid">
      <div class="stat-card">
        <h3>Текущие задачи</h3>
        <div class="stat-value">{{ currentTasksCount }}</div>
        <div class="stat-details">
          <div v-for="(count, status) in tasksByStatus" :key="status" class="status-item">
            <span class="status-label">{{ getStatusLabel(status) }}:</span>
            <span class="status-count">{{ count }}</span>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <h3>Общее затраченное время</h3>
        <div class="stat-value">{{ totalTimeSpent }} часов</div>
        <div class="stat-details">
          <div class="time-breakdown">
            <div class="time-item">
              <span class="time-label">Среднее время на задачу:</span>
              <span class="time-value">{{ averageTimePerTask }} часов</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

const tasks = ref([])

const statusLabels = {
  'New': 'Новые',
  'Analysis': 'Анализ',
  'In Development': 'В разработке',
  'Review': 'На проверке',
  'Under Revision': 'На доработке',
  'Rollout': 'Внедрение',
  'Other Direction': 'Другое направление',
  'Completed': 'Завершённые'
}

const getStatusLabel = (status) => statusLabels[status] || status

const loadTasks = () => {
  try {
    const savedTasks = localStorage.getItem('tasks')
    if (savedTasks) {
      tasks.value = JSON.parse(savedTasks)
    }
  } catch (error) {
    console.error('Ошибка загрузки задач:', error)
  }
}

const currentTasksCount = computed(() => {
  return tasks.value.length
})

const tasksByStatus = computed(() => {
  const statusCount = {}
  tasks.value.forEach(task => {
    statusCount[task.status] = (statusCount[task.status] || 0) + 1
  })
  return statusCount
})

const totalTimeSpent = computed(() => {
  return tasks.value.reduce((total, task) => total + (task.timeSpent || 0), 0)
})

const averageTimePerTask = computed(() => {
  if (tasks.value.length === 0) return 0
  return (totalTimeSpent.value / tasks.value.length).toFixed(1)
})

onMounted(() => {
  loadTasks()
})
</script>

<style scoped>
.statistics {
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
  margin: 20px 0;
}

h2 {
  margin: 0 0 20px 0;
  color: #333;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.stat-card h3 {
  margin: 0 0 15px 0;
  color: #2c3e50;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #2196f3;
  margin-bottom: 15px;
}

.stat-details {
  border-top: 1px solid #eee;
  padding-top: 15px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  color: #666;
}

.status-label {
  font-weight: 500;
}

.status-count {
  font-weight: bold;
  color: #2196f3;
}

.time-breakdown {
  margin-top: 10px;
}

.time-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  color: #666;
}

.time-label {
  font-weight: 500;
}

.time-value {
  font-weight: bold;
  color: #2196f3;
}
</style> 