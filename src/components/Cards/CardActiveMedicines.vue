<template>
  <q-card bordered class="card-item">
    <q-card-section>
      <div class="text-h6 text-primary">💊 Medicamentos Ativos</div>
      <div class="text-h4 text-weight-bold q-mt-sm">
        {{ activeMedicinesCount }}
      </div>
      <q-btn
        flat
        label="Ver todos"
        color="primary"
        class="q-mt-md"
        to="/app/medicines"
      />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { api } from "src/boot/axios";
import { useNotify } from "src/composables/useNotify";
import type { Medicine} from 'src/types/Medicine/medicine';

const { error } = useNotify();
const activeMedicinesCount = ref(0);

const fetchMedicinesData = async () => {
  try {
    const response = await api.get<Medicine[]>("/medication/");
    const medicines = response.data;
    activeMedicinesCount.value = medicines.length;
  } catch (err) {
    console.error("Erro ao buscar dados dos medicamentos:", err);
    error("Erro ao carregar dados dos medicamentos");
  }
};

onMounted(() => {
  void fetchMedicinesData();
});
</script>

<style scoped>
.card-item {
  padding: 12px;
}

.text-h6 {
  font-weight: 600;
}
</style>
