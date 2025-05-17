<template>
  <div class="worker-profile">
    <h2>Worker Management</h2>
    
    <!-- Worker List Panel -->
    <div class="worker-list">
      <div class="list-header">
        <h3>Workers</h3>
        <div class="header-actions">
          <div class="filter-group">
            <label>Filter by Position:</label>
            <select v-model="positionFilter" class="filter-select">
              <option value="all">All Positions</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Lead">Lead</option>
            </select>
          </div>
          <button @click="showAddModal = true" class="add-btn">
            <span class="icon">+</span> Add Worker
          </button>
        </div>
      </div>
      <div class="workers">
        <div v-for="worker in filteredWorkers" :key="worker.id" class="worker-card">
          <div class="worker-info">
            <h4>{{ worker.firstName }} {{ worker.lastName }}</h4>
            <p>Position: {{ worker.position }}</p>
            <p>Department: {{ worker.department }}</p>
          </div>
          <div class="worker-actions">
            <button @click="editWorker(worker)" class="edit-btn">Edit</button>
            <button @click="deleteWorker(worker.id)" class="delete-btn">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Worker Modal -->
    <Modal :show="showAddModal" :title="isEditing ? 'Edit Worker' : 'Add New Worker'" @close="closeModal">
      <div class="profile-form">
        <div class="form-group">
          <label>Position</label>
          <select v-model="currentWorker.position">
            <option value="">Select position</option>
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Lead">Lead</option>
          </select>
        </div>
        <div class="form-group">
          <label>Department</label>
          <input v-model="currentWorker.department" type="text" placeholder="Enter department">
        </div>
        <div class="form-group">
          <label>First Name</label>
          <input v-model="currentWorker.firstName" type="text" placeholder="Enter first name">
        </div>
        <div class="form-group">
          <label>Last Name</label>
          <input v-model="currentWorker.lastName" type="text" placeholder="Enter last name">
        </div>
        <div class="form-group">
          <label>Second Name</label>
          <input v-model="currentWorker.secondName" type="text" placeholder="Enter second name">
        </div>
        <button @click="saveWorker" class="save-btn">{{ isEditing ? 'Save Changes' : 'Add Worker' }}</button>
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
    console.error('Error loading workers:', error)
  }
}

const saveWorkers = () => {
  try {
    localStorage.setItem('workers', JSON.stringify(workers.value))
  } catch (error) {
    console.error('Error saving workers:', error)
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
    alert('First name, last name, and position are required!')
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
  if (confirm('Are you sure you want to delete this worker?')) {
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
  transition: background 0.3s;
}

.add-btn:hover {
  background: #45a049;
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
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.worker-card {
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.worker-info h4 {
  margin: 0 0 10px 0;
  color: #2c3e50;
}

.worker-info p {
  margin: 5px 0;
  color: #666;
}

.worker-actions {
  display: flex;
  gap: 10px;
}

.edit-btn {
  padding: 8px 16px;
  font-size: 0.9rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: #2196f3;
  color: white;
  transition: background 0.3s;
}

.edit-btn:hover {
  background: #1976d2;
}

.delete-btn {
  padding: 8px 16px;
  font-size: 0.9rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: #ff4444;
  color: white;
  transition: background 0.3s;
}

.delete-btn:hover {
  background: #cc0000;
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
</style> 