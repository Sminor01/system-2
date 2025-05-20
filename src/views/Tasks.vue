<template>
  <div class="tasks">
    <TaskList />
  </div>
</template>

<script setup>
import TaskList from '@/components/TaskList.vue';
</script>

<style scoped>
.tasks {
  padding: 20px;
  margin-left: 250px; /* Same as sidebar width */
}

@media (max-width: 768px) {
  .tasks {
    margin-left: 70px; /* Same as collapsed sidebar width */
  }
}
</style> 