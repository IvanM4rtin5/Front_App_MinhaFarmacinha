<template>
  <div>
    <div class="card-grid q-mb-xl">
      <CardActiveMedicines />
      <CardUrgentMedicines />
      <CardShoppingList :count="3" />
    </div>

    <div class="card-grid">
      <CardNextReminder next-reminder="Omeprazol às 09:00" />
      <CardAIAssistant />
    </div>
  </div>
</template>

<script setup lang="ts">
import CardActiveMedicines from "./CardActiveMedicines.vue";
import CardUrgentMedicines from "./CardUrgentMedicines.vue";
import CardShoppingList from "./CardShoppingList.vue";
import CardNextReminder from "./CardNextReminder.vue";
import CardAIAssistant from "./CardAIAssistant.vue";
</script>

<style scoped>
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}
</style>
