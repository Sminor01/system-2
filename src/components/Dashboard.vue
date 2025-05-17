<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <!-- <h2>Панель управления задачами</h2> -->
      <!-- <button @click="$emit('close')" class="close-btn">×</button> -->
    </div>
    
    <div class="dashboard-content">
      <div class="dashboard-card">
        <h3>Всего задач</h3>
        <div class="count">{{ tasks.length }}</div>
      </div>
      
      <div class="dashboard-card">
        <h3>По статусу</h3>
        <div class="status-stats">
          <div v-for="status in statuses" :key="status" class="status-item">
            <span class="status-label">{{ getStatusLabel(status) }}:</span>
            <span class="status-count">{{ getTasksByStatus(status) }}</span>
          </div>
        </div>
      </div>
      
      <div class="dashboard-card">
        <h3>По сложности</h3>
        <div class="complexity-stats">
          <div v-for="complexity in complexities" :key="complexity" class="complexity-item">
            <span class="complexity-label">{{ getComplexityLabel(complexity) }}:</span>
            <span class="complexity-count">{{ getTasksByComplexity(complexity) }}</span>
          </div>
        </div>
      </div>
      
      <div class="dashboard-card">
        <h3>По срочности</h3>
        <div class="urgency-stats">
          <div v-for="urgency in urgencies" :key="urgency" class="urgency-item">
            <span class="urgency-label">{{ getUrgencyLabel(urgency) }}:</span>
            <span class="urgency-count">{{ getTasksByUrgency(urgency) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  tasks: {
    type: Array,
    required: true
  }
})

const statuses = ['New', 'Analysis', 'In Development', 'Review', 'Under Revision', 'Rollout', 'Other Direction', 'Completed']
const complexities = ['Low', 'Medium', 'High']
const urgencies = ['Low', 'Medium', 'High']

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

const complexityLabels = {
  'Low': 'Низкая',
  'Medium': 'Средняя',
  'High': 'Высокая'
}

const urgencyLabels = {
  'Low': 'Низкая',
  'Medium': 'Средняя',
  'High': 'Высокая'
}

const getStatusLabel = (status) => statusLabels[status] || status
const getComplexityLabel = (complexity) => complexityLabels[complexity] || complexity
const getUrgencyLabel = (urgency) => urgencyLabels[urgency] || urgency

const getTasksByStatus = (status) => {
  return props.tasks.filter(task => task.status === status).length
}

const getTasksByComplexity = (complexity) => {
  return props.tasks.filter(task => task.complexity === complexity).length
}

const getTasksByUrgency = (urgency) => {
  return props.tasks.filter(task => task.urgency === urgency).length
}
</script>

<style scoped>
.dashboard {
  width: 100%;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* margin-bottom: 20px; */
}

.dashboard-header h2 {
  margin: 0;
  color: #2c3e50;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.close-btn:hover {
  color: #333;
}

.dashboard-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.dashboard-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.dashboard-card h3 {
  margin: 0 0 15px 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.count {
  font-size: 2.5em;
  font-weight: bold;
  color: #2196f3;
  text-align: center;
}

.status-stats,
.complexity-stats,
.urgency-stats {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.status-item,
.complexity-item,
.urgency-item {
  display: flex;
  justify-content: space-between;
  padding: 8px;
  background: white;
  border-radius: 4px;
}

.status-label,
.complexity-label,
.urgency-label {
  color: #666;
}

.status-count,
.complexity-count,
.urgency-count {
  font-weight: bold;
  color: #2196f3;
}
</style> 