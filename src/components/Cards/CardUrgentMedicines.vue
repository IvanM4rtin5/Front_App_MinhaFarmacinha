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
    <q-dialog v-model="showUrgentMedicines">
      <q-card style="width: 90vw; max-width: 700px">
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
          <template v-slot:no-data>
            <div class="text-center q-pa-md text-grey-7 text-h6">
              <q-icon name="medication" 
                size="md" 
                class="q-mr-sm" 
                color="red"
              />
              Nenhum medicamento encontrado.
            </div>
          </template>
            <template v-slot:body-cell-boxes="props">
              <q-td :props="props" style="font-size: 16px">
                <q-chip color="negative" text-color="white" dense>
                  {{ props.row.boxes }} Estoque
                </q-chip>
              </q-td>
            </template>

            <template v-slot:body-cell-actions="props">
              <q-td :props="props" class="q-gutter-sm">
                <q-btn
                  v-if="'id' in props.row"
                  flat
                  round
                  color="primary"
                  icon="add"
                  label="Add caixa"
                  @click="addAgain(props.row)"
                />
                <q-btn
                  v-else
                  flat
                  round
                  color="positive"
                  icon="edit"
                  label="Add novamente"
                  size="md"
                  @click="editMedicine(props.row)"
                />
                <q-btn
                  v-if="'id' in props.row"
                  flat
                  round
                  color="negative"
                  icon="delete"
                  label="Apagar"
                  size="md"
                  @click="deleteMedicine(props.row)"
                />
                <q-btn
                  v-else
                  flat
                  round
                  color="negative"
                  icon="delete"
                  @click="deleteNotificationBySnapshot(props.row)"
                />
              </q-td>
            </template>
          </q-table>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Fechar" color="negative" v-close-popup />
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
import { ref, onMounted, toRaw } from "vue";
import { useRouter } from "vue-router";
import { api } from "src/boot/axios";
import { useNotify } from "src/composables/useNotify";
import type {
  Medicine,
  MedicineToReplace,
} from "../../types/Medicine/medicine";
import type { Notification } from "../../types/Notification/notification";

const router = useRouter();
const { success, error, info } = useNotify();
const urgentMedicinesCount = ref(0);
const urgentMedicines = ref<(Medicine | MedicineToReplace)[]>([]);
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
    const medicines = response.data.filter((med: Medicine) => med.stock <= 7);

    const respReplace = await api.get<MedicineToReplace[]>(
      "/medication/to-replace/"
    );
    const toReplace = respReplace.data;

    urgentMedicines.value = [...medicines, ...toReplace];
    urgentMedicinesCount.value = urgentMedicines.value.length;
  } catch {
    error("Erro ao carregar dados dos medicamentos");
  } finally {
    loading.value = false;
  }
};

const navigateToMedicines = async () => {
  await router.push("/app/medicines");
};

const editMedicine = async (medicine: Medicine) => {
  await router.push({
    path: "/app/medicines",
    query: {
      add: "1",
      name: medicine.name,
      dosage: medicine.dosage,
      schedules: medicine.schedules,
      pills_per_box: medicine.pills_per_box,
    },
  });
};

const addAgain = async (medicine:Medicine) => {
  try {
    const updatedMedicine = {
      ...medicine,
      boxes: (medicine.boxes ?? 0) + 1,
    };
    await api.put(`/medication/${medicine.id}`, updatedMedicine);
    success("Mais uma caixa adicionada ao estoque!");
    await fetchMedicinesData(); 
  } catch (err) {
    error("Erro ao adicionar caixa ao medicamento.");
    console.error(err);
  }
};

const deleteMedicine = async (medicine: Medicine | MedicineToReplace) => {
  if ("id" in medicine) {
    try {
      await api.delete(`/medication/${medicine.id}`);
      urgentMedicines.value = urgentMedicines.value.filter(
        (m) => !("id" in m && m.id === medicine.id)
      );
      urgentMedicinesCount.value = urgentMedicines.value.length;
      success("Medicamento excluído com sucesso!");
    } catch {
      error("Erro ao excluir medicamento");
    }
  } else {
    info(
      "Este medicamento já foi excluído. Para repor, clique em 'Adicionar novamente'."
    );
  }
};

const deleteNotificationBySnapshot = async (medicine: MedicineToReplace) => {
  try {
    const rawMedicine = toRaw(medicine);
    const response = await api.get("/notification/", {
      params: { limit: 100 },
    });
    const notifications = response.data as Notification[];
    console.log("Notificações:", notifications);
    console.log("Medicine para deletar:", rawMedicine);

    notifications.forEach((n) => {
      console.log(
        "Comparando:",
        n.medication_name,
        rawMedicine.name,
        n.medication_dosage,
        rawMedicine.dosage,
        n.notification_type,
        rawMedicine.notification_type
      );
    });

    const notification = notifications.find(
      (n) =>
        n.medication_name === rawMedicine.name &&
        (n.medication_dosage?.toString() === rawMedicine.dosage.toString() ||
          n.medication_dosage === undefined) &&
        n.notification_type === rawMedicine.notification_type
    );
    if (notification) {
      await api.delete(`/notification/${notification.id}`);
      urgentMedicines.value = urgentMedicines.value.filter(
        (m) =>
          !(
            m.name === rawMedicine.name &&
            m.dosage.toString() === rawMedicine.dosage.toString() &&
            "notification_type" in m &&
            m.notification_type === rawMedicine.notification_type
          )
      );
      urgentMedicinesCount.value = urgentMedicines.value.length;
      success("Notificação excluída com sucesso!");
    } else {
      error(
        `Notificação não encontrada para ${rawMedicine.name} (${rawMedicine.dosage}) [${rawMedicine.notification_type}]`
      );
    }
  } catch {
    error("Erro ao excluir notificação");
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
