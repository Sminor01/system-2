<template>
  <div class="task-list">
    <div class="list-header">
      <h2>Задачи</h2>
      <div class="header-actions">
        <button @click="showDashboard = true" class="dashboard-btn">
          <span class="icon">📊</span> Анализ
        </button>
        <div class="filter-group">
          <label>Фильтр по статусу:</label>
          <select v-model="statusFilter" class="filter-select">
            <option value="all">Все задачи</option>
            <option value="New">Новые</option>
            <option value="Analysis">Анализ</option>
            <option value="In Development">В разработке</option>
            <option value="Review">На проверке</option>
            <option value="Under Revision">На доработке</option>
            <option value="Rollout">Внедрение</option>
            <option value="Other Direction">Другое направление</option>
            <option value="Completed">Завершённые</option>
          </select>
        </div>
        <button @click="showAddModal = true" class="add-btn">
          <span class="icon">+</span> Добавить задачу
        </button>
      </div>
    </div>

    <div class="tasks">
      <div v-for="task in filteredTasks" :key="task.id" class="task-card">
        <div class="task-header">
          <h3>{{ task.name }}</h3>
          <div class="task-status" :class="task.status.toLowerCase()">
            <select v-model="task.status" @change="updateTaskStatus(task)">
              <option value="New">Новые</option>
              <option value="Analysis">Анализ</option>
              <option value="In Development">В разработке</option>
              <option value="Review">На проверке</option>
              <option value="Under Revision">На доработке</option>
              <option value="Rollout">Внедрение</option>
              <option value="Other Direction">Другое направление</option>
              <option value="Completed">Завершённые</option>
            </select>
          </div>
        </div>
        <div class="task-details">
          <p><strong>Исполнитель:</strong> {{ task.assignedTo }}</p>
          <p><strong>Ответственный:</strong> {{ task.responsible }}</p>
          <p><strong>Сложность:</strong> {{ getComplexityLabel(task.complexity) }}</p>
          <p><strong>Срочность:</strong> {{ getUrgencyLabel(task.urgency) }}</p>
          <p><strong>Дата начала:</strong> {{ formatDate(task.startDate) }}</p>
          <p><strong>Срок выполнения:</strong> {{ formatDate(task.deadline) }}</p>
          <p><strong>Затраченное время:</strong> {{ task.timeSpent || 0 }} часов</p>
        </div>
        <div class="task-actions">
          <button @click="markAsDone(task)" class="done-btn" v-if="task.status !== 'Completed'">Завершить</button>
          <button @click="editTask(task)" class="edit-btn">Редактировать</button>
          <button @click="deleteTask(task.id)" class="delete-btn">Удалить</button>
        </div>
      </div>
    </div>

    <!-- Add Task Modal -->
    <Modal :show="showAddModal" :title="isEditing ? 'Редактировать задачу' : 'Добавить новую задачу'" @close="closeModal">
      <div class="task-form">
        <div class="form-group">
          <label>Название задачи</label>
          <input v-model="currentTask.name" type="text" placeholder="Введите название задачи">
        </div>

        <div class="form-group">
          <label>Исполнитель</label>
          <select v-model="currentTask.assignedTo">
            <option value="">Выберите исполнителя</option>
            <option v-for="worker in workers" :key="worker.id" :value="`${worker.firstName} ${worker.lastName}`">
              {{ worker.firstName }} {{ worker.lastName }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Ответственный</label>
          <select v-model="currentTask.responsible">
            <option value="">Выберите ответственного</option>
            <option v-for="worker in workers" :key="worker.id" :value="`${worker.firstName} ${worker.lastName}`">
              {{ worker.firstName }} {{ worker.lastName }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Сложность</label>
          <select v-model="currentTask.complexity">
            <option value="Low">Низкая</option>
            <option value="Medium">Средняя</option>
            <option value="High">Высокая</option>
          </select>
        </div>

        <div class="form-group">
          <label>Срочность</label>
          <select v-model="currentTask.urgency">
            <option value="Low">Низкая</option>
            <option value="Medium">Средняя</option>
            <option value="High">Высокая</option>
          </select>
        </div>

        <div class="form-group">
          <label>Дата начала</label>
          <input v-model="currentTask.startDate" type="date">
        </div>

        <div class="form-group">
          <label>Срок выполнения</label>
          <input v-model="currentTask.deadline" type="date">
        </div>

        <div class="form-group">
          <label>Затраченное время (часов)</label>
          <input v-model.number="currentTask.timeSpent" type="number" min="0" step="0.5">
        </div>

        <button @click="saveTask" class="save-btn">{{ isEditing ? 'Сохранить изменения' : 'Добавить задачу' }}</button>
      </div>
    </Modal>

    <!-- Dashboard Modal -->
    <Modal :show="showDashboard" title="Панель управления задачами" @close="showDashboard = false">
      <Dashboard :tasks="tasks" @close="showDashboard = false" />
    </Modal>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import Dashboard from './Dashboard.vue'
import Modal from './Modal.vue'

const store = useStore()
const tasks = ref([])
const workers = ref([])
const showAddModal = ref(false)
const showDashboard = ref(false)
const isEditing = ref(false)
const statusFilter = ref('all')
const currentTask = ref({
  name: '',
  assignedTo: '',
  responsible: '',
  complexity: 'Medium',
  urgency: 'Medium',
  startDate: '',
  deadline: '',
  status: 'New',
  timeSpent: 0
})

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

const getComplexityLabel = (complexity) => complexityLabels[complexity] || complexity
const getUrgencyLabel = (urgency) => urgencyLabels[urgency] || urgency

const filteredTasks = computed(() => {
  if (statusFilter.value === 'all') {
    return tasks.value
  }
  return tasks.value.filter(task => task.status === statusFilter.value)
})

const loadData = async () => {
  try {
    await store.dispatch('fetchTasks')
    tasks.value = store.getters.getTasks
    workers.value = store.getters.getWorkers
  } catch (error) {
    console.error('Error loading data:', error)
  }
}

const saveTasks = () => {
  try {
    localStorage.setItem('tasks', JSON.stringify(tasks.value))
  } catch (error) {
    console.error('Error saving tasks:', error)
  }
}

const closeModal = () => {
  showAddModal.value = false
  isEditing.value = false
  resetCurrentTask()
}

const resetCurrentTask = () => {
  currentTask.value = {
    name: '',
    assignedTo: '',
    responsible: '',
    complexity: 'Medium',
    urgency: 'Medium',
    startDate: '',
    deadline: '',
    status: 'New',
    timeSpent: 0
  }
}

const editTask = (task) => {
  isEditing.value = true
  currentTask.value = { ...task }
  showAddModal.value = true
}

const saveTask = async () => {
  if (!currentTask.value.name || !currentTask.value.assignedTo || !currentTask.value.responsible) {
    alert('Please fill in all required fields!')
    return
  }

  try {
    if (isEditing.value) {
      await store.dispatch('updateTask', {
        id: currentTask.value.id,
        taskData: currentTask.value
      })
    } else {
      await store.dispatch('createTask', currentTask.value)
    }
    closeModal()
  } catch (error) {
    console.error('Error saving task:', error)
  }
}

const updateTaskStatus = (task) => {
  const index = tasks.value.findIndex(t => t.id === task.id)
  if (index !== -1) {
    tasks.value[index].status = task.status
    saveTasks()
  }
}

const deleteTask = async (taskId) => {
  if (confirm('Are you sure you want to delete this task?')) {
    try {
      await store.dispatch('deleteTask', taskId)
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'Not set'
  return new Date(dateString).toLocaleDateString()
}

const markAsDone = async (task) => {
  try {
    await store.dispatch('updateTask', {
      id: task.id,
      taskData: { ...task, status: 'Completed' }
    })
  } catch (error) {
    console.error('Error updating task status:', error)
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.task-list {
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
  margin: 20px 0;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

h2 {
  margin: 0;
  color: #333;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-group label {
  color: #666;
  font-weight: 500;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #333;
  background-color: white;
  cursor: pointer;
  min-width: 150px;
}

.filter-select:focus {
  outline: none;
  border-color: #2196f3;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: #4CAF50;
  color: white;
  transition: background 0.3s;
}

.add-btn:hover {
  background: #45a049;
}

.icon {
  font-size: 1.2rem;
  font-weight: bold;
}

.tasks {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.task-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.task-header h3 {
  margin: 0;
  color: #2c3e50;
}

.task-status {
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: bold;
}

.task-status.new {
  background: #e3f2fd;
  color: #1976d2;
}

.task-status.in-progress {
  background: #fff3e0;
  color: #f57c00;
}

.task-status.completed {
  background: #e8f5e9;
  color: #388e3c;
}

.task-details {
  margin-bottom: 15px;
  flex-grow: 1;
}

.task-details p {
  margin: 5px 0;
  color: #666;
  word-break: break-word;
}

.task-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 15px;
}

.delete-btn,
.edit-btn,
.done-btn {
  padding: 6px 12px;
  font-size: 0.85rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  min-width: fit-content;
  transition: background 0.3s;
}

.delete-btn {
  background: #ff4444;
  color: white;
}

.delete-btn:hover {
  background: #cc0000;
}

.edit-btn {
  background: #2196f3;
  color: white;
}

.edit-btn:hover {
  background: #1976d2;
}

.done-btn {
  background: #4CAF50;
  color: white;
}

.done-btn:hover {
  background: #45a049;
}

.task-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

label {
  font-weight: bold;
  color: #666;
}

input, select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.save-btn {
  padding: 12px 24px;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: #4CAF50;
  color: white;
  transition: background 0.3s;
  margin-top: 10px;
}

.save-btn:hover {
  background: #45a049;
}

.task-status select {
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: bold;
  border: none;
  background: transparent;
  cursor: pointer;
}

.task-status.new select {
  color: #1976d2;
}

.task-status.analysis select {
  color: #9c27b0;
}

.task-status.in-development select {
  color: #f57c00;
}

.task-status.review select {
  color: #2196f3;
}

.task-status.under-revision select {
  color: #ff9800;
}

.task-status.rollout select {
  color: #4caf50;
}

.task-status.other-direction select {
  color: #607d8b;
}

.task-status.completed select {
  color: #4CAF50;
}

.dashboard-btn {
  background-color: #2196f3;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 16px;
}

.dashboard-btn:hover {
  background-color: #1976d2;
}
</style> 