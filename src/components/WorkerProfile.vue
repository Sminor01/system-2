<template>
  <div class="worker-profile">
    <h2>Управление сотрудниками</h2>
    
    <!-- Worker List Panel -->
    <div class="worker-list">
      <div class="list-header">
        <h3>Сотрудники</h3>
        <div class="header-actions">
          <div class="filter-group">
            <label>Фильтр по должности:</label>
            <select v-model="positionFilter" class="filter-select">
              <option value="all">Все должности</option>
              <option value="Frontend">Фронтенд</option>
              <option value="Backend">Бэкенд</option>
              <option value="Lead">Руководитель</option>
            </select>
          </div>
          <button @click="showAddModal = true" class="add-btn">
            <span class="icon">+</span> Добавить сотрудника
          </button>
        </div>
      </div>
      <div class="workers">
        <div v-for="worker in filteredWorkers" :key="worker.id" class="worker-card">
          <div class="worker-info">
            <h4>{{ worker.firstName }} {{ worker.lastName }}</h4>
            <p>Должность: {{ getPositionLabel(worker.position) }}</p>
            <p>Отдел: {{ worker.department }}</p>
          </div>
          <div class="worker-actions">
            <button @click="editWorker(worker)" class="edit-btn">Редактировать</button>
            <button @click="deleteWorker(worker.id)" class="delete-btn">Удалить</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Worker Modal -->
    <Modal :show="showAddModal" :title="isEditing ? 'Редактировать сотрудника' : 'Добавить нового сотрудника'" @close="closeModal">
      <div class="profile-form">
        <div class="form-group">
          <label>Должность</label>
          <select v-model="currentWorker.position">
            <option value="">Выберите должность</option>
            <option value="Frontend">Фронтенд</option>
            <option value="Backend">Бэкенд</option>
            <option value="Lead">Руководитель</option>
          </select>
        </div>
        <div class="form-group">
          <label>Отдел</label>
          <input v-model="currentWorker.department" type="text" placeholder="Введите название отдела">
        </div>
        <div class="form-group">
          <label>Имя</label>
          <input v-model="currentWorker.firstName" type="text" placeholder="Введите имя">
        </div>
        <div class="form-group">
          <label>Фамилия</label>
          <input v-model="currentWorker.lastName" type="text" placeholder="Введите фамилию">
        </div>
        <div class="form-group">
          <label>Отчество</label>
          <input v-model="currentWorker.secondName" type="text" placeholder="Введите отчество">
        </div>
        <button @click="saveWorker" class="save-btn">{{ isEditing ? 'Сохранить изменения' : 'Добавить сотрудника' }}</button>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import Modal from './Modal.vue'

const workers = ref([])
const showAddModal = ref(false)
const isEditing = ref(false)
const positionFilter = ref('all')
const currentWorker = ref({
  position: '',
  department: '',
  firstName: '',
  lastName: '',
  secondName: ''
})

const positionLabels = {
  'Frontend': 'Фронтенд',
  'Backend': 'Бэкенд',
  'Lead': 'Руководитель'
}

const getPositionLabel = (position) => positionLabels[position] || position

const filteredWorkers = computed(() => {
  if (positionFilter.value === 'all') {
    return workers.value
  }
  return workers.value.filter(worker => worker.position === positionFilter.value)
})

const loadWorkers = () => {
  try {
    const savedWorkers = localStorage.getItem('workers')
    if (savedWorkers) {
      workers.value = JSON.parse(savedWorkers)
    }
  } catch (error) {
    console.error('Ошибка загрузки сотрудников:', error)
  }
}

const saveWorkers = () => {
  try {
    localStorage.setItem('workers', JSON.stringify(workers.value))
  } catch (error) {
    console.error('Ошибка сохранения сотрудников:', error)
  }
}

const closeModal = () => {
  showAddModal.value = false
  isEditing.value = false
  resetCurrentWorker()
}

const resetCurrentWorker = () => {
  currentWorker.value = {
    position: '',
    department: '',
    firstName: '',
    lastName: '',
    secondName: ''
  }
}

const editWorker = (worker) => {
  isEditing.value = true
  currentWorker.value = { ...worker }
  showAddModal.value = true
}

const saveWorker = () => {
  if (!currentWorker.value.firstName || !currentWorker.value.lastName || !currentWorker.value.position) {
    alert('Имя, фамилия и должность обязательны для заполнения!')
    return
  }

  if (isEditing.value) {
    const index = workers.value.findIndex(w => w.id === currentWorker.value.id)
    if (index !== -1) {
      workers.value[index] = { ...currentWorker.value }
    }
  } else {
    workers.value.push({
      id: Date.now(),
      ...currentWorker.value
    })
  }
  
  closeModal()
  saveWorkers()
}

const deleteWorker = (workerId) => {
  if (confirm('Вы уверены, что хотите удалить этого сотрудника?')) {
    workers.value = workers.value.filter(worker => worker.id !== workerId)
    saveWorkers()
  }
}

onMounted(() => {
  loadWorkers()
})
</script>

<style scoped>
.worker-profile {
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
  margin: 20px 0;
}

h2, h3 {
  margin-bottom: 20px;
  color: #333;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
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
  transition: all 0.3s ease;
}

.add-btn:hover {
  background: #45a049;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.icon {
  font-size: 1.2rem;
  font-weight: bold;
}

.worker-list {
  margin-bottom: 40px;
}

.workers {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.worker-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: 15px;
  transition: all 0.3s ease;
}

.worker-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.worker-info {
  flex-grow: 1;
}

.worker-info h4 {
  margin: 0 0 12px 0;
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: 600;
}

.worker-info p {
  margin: 8px 0;
  color: #666;
  font-size: 0.95rem;
  line-height: 1.4;
}

.worker-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding-top: 10px;
  border-top: 1px solid #eee;
}

.edit-btn, .delete-btn {
  padding: 8px 16px;
  font-size: 0.9rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
  text-align: center;
  font-weight: 500;
}

.edit-btn {
  background: #2196f3;
  color: white;
}

.edit-btn:hover {
  background: #1976d2;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(33, 150, 243, 0.2);
}

.delete-btn {
  background: #ff4444;
  color: white;
}

.delete-btn:hover {
  background: #cc0000;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(255, 68, 68, 0.2);
}

.profile-form {
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
  font-weight: 600;
  color: #555;
  font-size: 0.95rem;
}

input, select {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

input:focus, select:focus {
  outline: none;
  border-color: #2196f3;
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1);
}

.save-btn {
  padding: 12px 24px;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: #4CAF50;
  color: white;
  transition: all 0.3s ease;
  margin-top: 10px;
  font-weight: 500;
}

.save-btn:hover {
  background: #45a049;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(76, 175, 80, 0.2);
}
</style> 