<template>
  <q-card bordered class="card-item">
    <q-card-section>
      <div class="text-subtitle1">📅 Próximo lembrete</div>
      <div class="text-h6 text-primary q-mt-sm">{{ nextReminder }}</div>
      <q-btn
        flat
        label="Ver calendário"
        color="primary"
        class="q-mt-md"
        @click="navigateToMedicines"
      />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

defineProps({
  nextReminder: {
    type: String,
    default: "Nenhum lembrete",
  },
});

const navigateToMedicines = () => {
  void router.push("/app/medicines");
};
</script>

<style scoped>
.card-item {
  padding: 12px;
}

.text-h6 {
  font-weight: 600;
}
</style>
