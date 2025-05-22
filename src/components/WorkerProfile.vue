<template>
  <div class="worker-profile">
    <div class="list-header">
      <h2>Workers</h2>
      <div class="header-actions">
        <button class="add-btn" @click="showAddModal = true">
          <span class="icon">+</span> Add Worker
        </button>
      </div>
    </div>

    <div class="workers-list">
      <div v-for="worker in workers" :key="worker.id" class="worker-card">
        <div class="worker-info">
          <h3>{{ worker.firstName }} {{ worker.lastName }} {{ worker.secondName }}</h3>
          <p><strong>Position:</strong> {{ worker.position }}</p>
          <p><strong>Department:</strong> {{ worker.department }}</p>
        </div>
        <div class="worker-actions">
          <button class="edit-btn" @click="editWorker(worker)">Edit</button>
          <button class="delete-btn" @click="deleteWorker(worker.id)">Delete</button>
        </div>
      </div>
    </div>

    <div v-if="showAddModal" class="modal">
      <div class="modal-content">
        <h3>{{ isEditing ? 'Edit Worker' : 'Add Worker' }}</h3>
        <form @submit.prevent="saveWorker">
          <div class="form-group">
            <label for="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              v-model="currentWorker.firstName"
              required
            />
          </div>
          <div class="form-group">
            <label for="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              v-model="currentWorker.lastName"
              required
            />
          </div>
          <div class="form-group">
            <label for="secondName">Second Name</label>
            <input
              type="text"
              id="secondName"
              v-model="currentWorker.secondName"
            />
          </div>
          <div class="form-group">
            <label for="position">Position</label>
            <input
              type="text"
              id="position"
              v-model="currentWorker.position"
              required
            />
          </div>
          <div class="form-group">
            <label for="department">Department</label>
            <input
              type="text"
              id="department"
              v-model="currentWorker.department"
              required
            />
          </div>
          <div class="modal-actions">
            <button type="submit" class="save-btn">Save</button>
            <button type="button" class="cancel-btn" @click="closeModal">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const workers = ref([])
const showAddModal = ref(false)
const isEditing = ref(false)
const currentWorker = ref({
  position: '',
  department: '',
  firstName: '',
  lastName: '',
  secondName: ''
})

const loadWorkers = async () => {
  try {
    await store.dispatch('fetchWorkers')
    workers.value = store.getters.getWorkers
  } catch (error) {
    console.error('Error loading workers:', error)
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

const saveWorker = async () => {
  if (!currentWorker.value.firstName || !currentWorker.value.lastName || !currentWorker.value.position) {
    alert('First name, last name, and position are required!')
    return
  }

  try {
    if (isEditing.value) {
      await store.dispatch('updateWorker', {
        id: currentWorker.value.id,
        workerData: currentWorker.value
      })
    } else {
      await store.dispatch('createWorker', currentWorker.value)
    }
    closeModal()
  } catch (error) {
    console.error('Error saving worker:', error)
  }
}

const deleteWorker = async (workerId) => {
  if (confirm('Are you sure you want to delete this worker?')) {
    try {
      await store.dispatch('deleteWorker', workerId)
    } catch (error) {
      console.error('Error deleting worker:', error)
    }
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

.workers-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.worker-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.worker-info h3 {
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
  margin-top: 15px;
}

.edit-btn, .delete-btn {
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.3s;
}

.edit-btn {
  background: #3498db;
  color: white;
}

.edit-btn:hover {
  background: #2980b9;
}

.delete-btn {
  background: #e74c3c;
  color: white;
}

.delete-btn:hover {
  background: #c0392b;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #2c3e50;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.save-btn, .cancel-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.save-btn {
  background: #4CAF50;
  color: white;
}

.save-btn:hover {
  background: #45a049;
}

.cancel-btn {
  background: #95a5a6;
  color: white;
}

.cancel-btn:hover {
  background: #7f8c8d;
}
</style> 