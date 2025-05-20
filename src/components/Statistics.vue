<template>
  <div class="statistics">
    <h2>Task Statistics</h2>
    
    <div class="stats-grid">
      <div class="stat-card">
        <h3>Current Tasks</h3>
        <div class="stat-value">{{ currentTasksCount }}</div>
        <div class="stat-details">
          <div v-for="(count, status) in tasksByStatus" :key="status" class="status-item">
            <span class="status-label">{{ status }}:</span>
            <span class="status-count">{{ count }}</span>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <h3>Total Time Spent</h3>
        <div class="stat-value">{{ totalTimeSpent }} hours</div>
        <div class="stat-details">
          <div class="time-breakdown">
            <div class="time-item">
              <span class="time-label">Average per task:</span>
              <span class="time-value">{{ averageTimePerTask }} hours</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const currentTasksCount = computed(() => {
  return store.getters.getTasks.length
})

const tasksByStatus = computed(() => {
  const statusCount = {}
  store.getters.getTasks.forEach(task => {
    statusCount[task.status] = (statusCount[task.status] || 0) + 1
  })
  return statusCount
})

const totalTimeSpent = computed(() => {
  return store.getters.getTasks.reduce((total, task) => total + (task.timeSpent || 0), 0)
})

const averageTimePerTask = computed(() => {
  const tasks = store.getters.getTasks
  if (tasks.length === 0) return 0
  return (totalTimeSpent.value / tasks.length).toFixed(1)
})

onMounted(async () => {
  try {
    await store.dispatch('fetchTasks')
  } catch (error) {
    console.error('Error loading tasks:', error)
  }
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
  margin-bottom: 20px;
  color: #2c3e50;
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-card h3 {
  margin: 0 0 15px 0;
  color: #2c3e50;
  font-size: 1.2rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #3498db;
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
  color: #666;
}

.time-label {
  font-weight: 500;
}

.time-value {
  color: #3498db;
  font-weight: 500;
}
</style> 