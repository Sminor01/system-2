<template>
  <div class="statistics">
    <Statistics />
  </div>
</template>

<script setup>
import Statistics from '@/components/Statistics.vue';
</script>

<style scoped>
.statistics {
  padding: 20px;
  margin-left: 250px; /* Same as sidebar width */
}

@media (max-width: 768px) {
  .statistics {
    margin-left: 70px; /* Same as collapsed sidebar width */
  }
}
</style> 