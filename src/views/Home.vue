<template>
  <div class="home">
    <Timer />
  </div>
</template>

<script setup>
import Timer from '@/components/Timer.vue';
</script>

<style scoped>
.home {
  padding: 20px;
  margin-left: 250px; /* Same as sidebar width */
}

@media (max-width: 768px) {
  .home {
    margin-left: 70px; /* Same as collapsed sidebar width */
  }
}
</style> 