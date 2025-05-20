<template>
  <div class="profile">
    <WorkerProfile />
  </div>
</template>

<script setup>
import WorkerProfile from '@/components/WorkerProfile.vue';
</script>

<style scoped>
.profile {
  padding: 20px;
  margin-left: 250px; /* Same as sidebar width */
}

@media (max-width: 768px) {
  .profile {
    margin-left: 70px; /* Same as collapsed sidebar width */
  }
}
</style> 