<template>
  <div>
    <q-card bordered class="card-item">
      <q-card-section>
        <div class="text-h6 text-negative">⚠️ Reposição Urgente</div>
        <div class="text-h4 text-weight-bold q-mt-sm">
          {{ urgentMedicinesCount }}
        </div>
        <q-btn
          flat
          label="Resolver agora"
          color="negative"
          class="q-mt-md"
          @click="showUrgentMedicines = true"
        />
      </q-card-section>
    </q-card>

    <!-- Modal with table urgent medicines -->
    <q-dialog v-model="showUrgentMedicines" persistent>
      <q-card style="width: 70vw; max-width: 700px">
        <q-card-section class="row items-center bg-negative text-white">
          <div class="text-h6">Medicamentos com Estoque Baixo</div>
        </q-card-section>

        <q-card-section>
          <q-table
            :rows="urgentMedicines"
            :columns="columns"
            row-key="id"
            :loading="loading"
            :pagination="{ rowsPerPage: 5 }"
            class="urgent-medicines-table"
          >
            <template v-slot:body-cell-stock="props">
              <q-td :props="props" style="font-size: 20px">
                <q-chip color="negative" text-color="white" dense>
                  {{ props.row.stock }} unidades
                </q-chip>
              </q-td>
            </template>

            <template v-slot:body-cell-actions="props">
              <q-td :props="props" class="q-gutter-sm">
                <q-btn
                  flat
                  round
                  color="primary"
                  icon="edit"
                  size="lg"
                  @click="editMedicine(props.row)"
                />
              </q-td>
            </template>
          </q-table>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Fechar" color="primary" v-close-popup />
          <q-btn
            flat
            label="Ver todos os medicamentos"
            color="primary"
            @click="navigateToMedicines"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { api } from "src/boot/axios";
import { useNotify } from "src/composables/useNotify";

interface Medicine {
  id: number;
  name: string;
  dosage: string;
  category: string;
  frequency: string;
  schedules: string[];
  stock: number;
  status: string;
}

const router = useRouter();
const { error } = useNotify();
const urgentMedicinesCount = ref(0);
const urgentMedicines = ref<Medicine[]>([]);
const loading = ref(false);
const showUrgentMedicines = ref(false);

const columns = [
  {
    name: "name",
    align: "left" as const,
    label: "Medicamento",
    field: "name",
    sortable: true,
  },
  {
    name: "dosage",
    align: "left" as const,
    label: "Dosagem",
    field: "dosage",
    sortable: true,
  },
  {
    name: "stock",
    align: "center" as const,
    label: "Estoque",
    field: "stock",
    sortable: true,
  },
  {
    name: "actions",
    align: "center" as const,
    label: "Ações",
    field: "actions",
  },
];

const fetchMedicinesData = async () => {
  try {
    loading.value = true;
    const response = await api.get<Medicine[]>("/medication/");
    const medicines = response.data;
    urgentMedicines.value = medicines.filter((med: Medicine) => med.stock <= 3);
    urgentMedicinesCount.value = urgentMedicines.value.length;
  } catch (err) {
    console.error("Erro ao buscar dados dos medicamentos:", err);
    error("Erro ao carregar dados dos medicamentos");
  } finally {
    loading.value = false;
  }
};

const navigateToMedicines = () => {
  void router.push("/app/medicines");
};

const editMedicine = (medicine: Medicine) => {
  void router.push(`/app/medicines/edit/${medicine.id}`);
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

:deep(.urgent-medicines-table) {
  font-size: 18px;
}

:deep(.urgent-medicines-table th) {
  font-size: 20px;
  font-weight: bold;
}

:deep(.urgent-medicines-table td) {
  font-size: 18px;
}

:deep(.urgent-medicines-table .q-chip) {
  font-size: 18px;
  height: 32px;
}
</style>
