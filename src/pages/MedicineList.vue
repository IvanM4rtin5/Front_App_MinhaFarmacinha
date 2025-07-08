<template>
  <q-page padding>
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h5 class="text-primary">
          Minha Farmacinha <q-icon name="chevron_right" /> Meus Medicamentos
        </h5>
        <p class="text-grey-7">
          Lista de medicamentos que voçe está utilizando atualmente.
        </p>
      </div>
      <div class="col-auto">
        <q-btn
          color="negative"
          icon="add"
          :label="!isMobile ? 'Adicionar Medicamento' : ''"
          @click="openAddDialog"
          class="q-px-md"
          :round="isMobile"
          :dense="isMobile"
        />
      </div>
    </div>

    <div class="row q-mb-md q-col-gutter-md">
      <div class="col-md-6 col-12">
        <q-input
          v-model="search"
          dense
          outlined
          placeholder="Buscar medicamentos..."
          class="q-mr-md"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <div class="col-md-6 col-12">
        <q-select
          v-model="selectedGroup"
          :options="groupOptions"
          dense
          outlined
          label="Filtrar por grupo"
          emit-value
          map-options
          clearable
        />
      </div>
    </div>

    <q-card flat bordered class="bg-white">
      <q-table
        :rows="medicines"
        :columns="columns"
        row-key="id"
        :loading="loading"
        :filter="search"
        v-model:pagination="pagination"
        :rows-per-page-options="[10, 20, 50, 0]"
        class="my-sticky-header-table"
      >
        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
        </template>
        <template v-slot:no-data>
          <div class="text-center q-pa-md text-grey-7 text-h6">
            <q-icon 
            name="medical_services" 
            size="md" 
            class="q-mr-sm"
            color="red"
            />
            Nenhum medicamento encontrado.
          </div>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-chip
              :color="getStatusColor(props.row)"
              text-color="white"
              dense
              class="q-ml-sm"
            >
              {{ props.row.status }}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-schedules="props">
          <q-td :props="props">
            {{ props.row.schedules.join(" - ") }}
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-sm">
            <q-btn
              flat
              round
              color="primary"
              icon="edit"
              @click="editMedicine(props.row)"
            />
            <q-btn
              flat
              round
              color="positive"
              icon="add"
              @click="addMedicine(props.row)"
            />
            <q-btn
              flat
              round
              color="negative"
              icon="delete"
              @click="confirmDelete(props.row)"
            >
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Diálog of medicine -->
    <q-dialog v-model="medicineDialog" persistent>
      <q-card class="bg-grey-2" style="width: 80vw; max-width: 800px">
        <q-card-section class="row items-center bg-primary text-white">
          <div class="text-h6" style="flex: 1; text-align: center">
            {{ isEditing ? "Editar" : "Adicionar" }} Medicamento
          </div>
        </q-card-section>

        <q-card-section class="q-pt-lg">
          <q-form @submit="saveMedicine" class="q-gutter-md">
            <q-input
              v-if="isEditing"
              v-model="createdAtFormatted"
              label="Data de inserção"
              outlined
              readonly
              disable
            />
            <q-input
              v-model="newMedicine.name"
              label="Nome do medicamento"
              :rules="[(val) => !!val || 'Nome é obrigatório']"
              outlined
            />

            <q-input
              v-model="newMedicine.dosage"
              type="number"
              step="0.01"
              label="Dosagem (Mg ou Unidade)"
              :rules="[(val) => !!val || 'Informe a Dosagem']"
              outlined
            />

            <q-select
              v-model="newMedicine.category"
              :options="categoryOptions"
              label="Categoria"
              :rules="[(val) => !!val || 'Categoria é obrigatória']"
              outlined
              emit-value
              map-options
            />

            <q-select
              v-model="newMedicine.frequency"
              :options="frequencyOptions"
              label="Frequência"
              :rules="[(val) => !!val || 'Frequência é obrigatória']"
              outlined
              emit-value
              map-options
            />

            <q-input
              v-model.number="newMedicine.boxes"
              type="number"
              label="Quantidade de caixas"
              :rules="[
                (val) => val > 0 || 'Deve ter pelo menos 1 caixa',
                (val) => !!val || 'Campo obrigatório',
              ]"
              outlined
            />
            <q-input
              v-model.number="newMedicine.pills_per_box"
              type="number"
              label="Comprimidos por caixa"
              :rules="[
                (val) => val > 0 || 'A caixa deve ter pelo menos 1 comprimido',
                (val) => !!val || 'Campo obrigatório',
              ]"
              outlined
            />
            <q-input
              v-model.number="newMedicine.stock"
              type="number"
              label="Quantidade em estoque"
              outlined
              readonly
              disable
            />
            <div class="text-subtitle2 q-mb-sm">Horários de medicação</div>
            <div class="row q-col-gutter-sm">
              <div
                v-for="(_, index) in newMedicine.schedules"
                :key="index"
                class="col-12 col-sm-6"
              >
                <q-input
                  v-model="newMedicine.schedules[index]"
                  type="time"
                  outlined
                  dense
                  :label="`Horário ${index + 1}`"
                />
              </div>
              <q-input
                v-model="newMedicine.days_until_empty"
                label="Dias até acabar"
                outlined
                readonly
                disable
              />
            </div>

            <div class="row justify-end q-mt-md">
              <q-btn
                label="Cancelar"
                color="white"
                style="background-color: red"
                flat
                v-close-popup
                class="q-mr-sm"
              />
              <q-btn label="Salvar" type="submit" color="primary" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Dialog of confirmation to remove -->
    <q-dialog v-model="deleteDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="negative" text-color="white" />
          <span class="q-ml-sm">Excluir medicamento</span>
        </q-card-section>

        <q-card-section>
          <span v-if="medicineToDelete">
            Tem certeza que deseja excluir o medicamento "{{
              medicineToDelete.name
            }}"?
          </span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn
            flat
            label="Excluir"
            color="negative"
            @click="deleteMedicine"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, onUnmounted, computed } from "vue";
import { api } from "src/boot/axios";
import type { AxiosError } from "axios";
import { useNotify } from "src/composables/useNotify";
import { useRoute, useRouter } from "vue-router";
import type {Medicine,MedicineForm} from "../types/Medicine/medicine";

const loading = ref(false);
const search = ref("");
const selectedGroup = ref<string | null>(null);
const isEditing = ref(false);
const medicineToDelete = ref<Medicine | null>(null);
const medicineDialog = ref(false);
const deleteDialog = ref(false);
const { success, error, info } = useNotify();
const route = useRoute();
const router = useRouter();

const createdAtFormatted = computed(() =>
  newMedicine.created_at
    ? new Date(newMedicine.created_at).toLocaleString("pt-BR")
    : ""
);

// Options for the selects
const groupOptions = [
  { label: "Ansiolíticos", value: "ansioliticos" },
  { label: "Anti-Depressivos", value: "anti-depressivos" },
  { label: "Analgésicos", value: "analgesicos" },
  { label: "Anti-inflamatórios", value: "anti-inflamatorios" },
  { label: "Antibióticos", value: "antibioticos" },
  { label: "Antivirais", value: "antivirais" },
  { label: "Diabetes", value: "diabetes" },
  { label: "Hipertensão", value: "hipertensao" },
  { label: "Suplementos", value: "suplementos" },
  { label: "Vitaminas", value: "vitaminas" },
  { label: "Outros", value: "outros" },
];

const categoryOptions = [
  { label: "Ansioliticos", value: "ansioliticos" },
  { label: "Anti-Depressivos", value: "anti-depressivos" },
  { label: "Analgésicos", value: "analgesicos" },
  { label: "Anti-inflamatórios", value: "anti-inflamatorios" },
  { label: "Antibióticos", value: "antibioticos" },
  { label: "Antivirais", value: "antivirais" },
  { label: "Diabetes", value: "diabetes" },
  { label: "Hipertensão", value: "hipertensao" },
  { label: "Suplementos", value: "suplementos" },
  { label: "Vitaminas", value: "vitaminas" },
  { label: "Outros", value: "outros" },
];

const frequencyOptions = [
  { label: "Uma vez ao dia", value: "1x ao dia", times: 1 },
  { label: "Duas vezes ao dia", value: "2x ao dia", times: 2 },
  { label: "Três vezes ao dia", value: "3x ao dia", times: 3 },
  { label: "Quatro vezes ao dia", value: "4x ao dia", times: 4 },
  { label: "A cada 8 horas", value: "3x ao dia", times: 3 },
  { label: "A cada 12 horas", value: "2x ao dia", times: 2 },
  { label: "Quando necessário", value: "1x ao dia", times: 1 },
  { label: "Antes das refeições", value: "3x ao dia", times: 3 },
  { label: "Após as refeições", value: "3x ao dia", times: 3 },
];

// List of medicines
const medicines = ref<Medicine[]>([]);

// Columns for the table
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
    name: "category",
    align: "left" as const,
    label: "Categoria",
    field: "category",
    sortable: true,
  },
  {
    name: "frequency",
    align: "left" as const,
    label: "Frequência",
    field: "frequency",
    sortable: true,
  },
  {
    name: "schedules",
    align: "left" as const,
    label: "Horários",
    field: "schedules",
    sortable: false,
  },
  {
    name: "stock",
    align: "center" as const,
    label: "Estoque",
    field: "stock",
    sortable: true,
  },
  {
    name: "status",
    align: "center" as const,
    label: "Status",
    field: "status",
    sortable: true,
  },
  {
    name: "pills_per_box",
    align: "center" as const,
    label: "Comprimidos/Caixa",
    field: "pills_per_box",
    sortable: true,
  },
  {
    name: "created_at",
    align: "center" as const,
    label: "Data de inserção",
    field: "created_at",
    sortable: true,
    format: (val: string) => new Date(val).toLocaleDateString("pt-BR"),
  },
  {
    name: "actions",
    align: "center" as const,
    label: "Ações",
    field: "actions",
    sortable: false,
  },
];

const pagination = ref({
  rowsPerPage: 10,
});

// New medicine reactive object
const newMedicine = reactive<MedicineForm>({
  id: 0,
  name: "",
  dosage: 0,
  category: "",
  frequency: "",
  schedules: [],
  stock: 0,
  boxes: 1,
  pills_per_box: 1,
  created_at: "",
  days_until_empty: 0,
});

watch(
  () => [newMedicine.boxes, newMedicine.pills_per_box],
  () => {
    newMedicine.stock = newMedicine.boxes * newMedicine.pills_per_box;
  }
);

const openAddDialog = () => {
  isEditing.value = false;
  resetForm();
  medicineDialog.value = true;
};

const editMedicine = (medicine: Medicine) => {
  newMedicine.id = medicine.id;
  newMedicine.name = medicine.name;
  newMedicine.dosage = medicine.dosage;
  newMedicine.category = medicine.category;
  newMedicine.frequency = medicine.frequency;
  newMedicine.schedules = [...medicine.schedules];
  newMedicine.stock = medicine.stock;
  newMedicine.pills_per_box = medicine.pills_per_box;
  newMedicine.created_at = medicine.created_at;
  newMedicine.days_until_empty = medicine.days_until_empty ?? 0;
  isEditing.value = true;
  medicineDialog.value = true;
};

const addMedicine = async (medicine: Medicine) => {
  try {
    const updatedMedicine = {
      ...medicine,
      stock: (medicine.stock ?? 0) + (medicine.pills_per_box ?? 0),
    };
    await api.put(`/medication/${medicine.id}`, updatedMedicine);
    success("Mais uma caixa adicionada ao estoque!");
    await fetchMedicines();
  } catch (err) {
    error("Erro ao adicionar caixa ao medicamento.");
    console.error(err);
  }
};

const confirmDelete = (medicine: Medicine) => {
  medicineToDelete.value = medicine;
  deleteDialog.value = true;
};

const deleteMedicine = async () => {
  if (!medicineToDelete.value) return;

  try {
    await api.delete(`/medication/${medicineToDelete.value.id}`);
    success("Medicamento excluído com sucesso!");
    await fetchMedicines();
    medicineToDelete.value = null;
  } catch (err) {
    const axiosError = err as AxiosError;
    console.error(
      "Erro ao excluir medicamento:",
      axiosError.response?.data || axiosError.message
    );
    error("Erro ao excluir medicamento");
  }
};

const resetForm = () => {
  newMedicine.id = 0;
  newMedicine.name = "";
  newMedicine.dosage = 0;
  newMedicine.category = "";
  newMedicine.frequency = "";
  newMedicine.schedules = [];
  newMedicine.stock = 0;
  newMedicine.boxes = 1;
  isEditing.value = false;
};

const fetchMedicines = async () => {
  try {
    loading.value = true;
    const response = await api.get("/medication/", {
      params: {
        search: search.value || undefined,
        category: selectedGroup.value || undefined,
      },
    });
    medicines.value = response.data.filter((med: Medicine) => {
      if (med.days_until_empty !== undefined && med.days_until_empty <= 0) {
        info(`O medicamento "${med.name}" acabou!`);
        return false;
      }
      return true;
    });
    if (route.query.editId) {
      console.log("editId na query:", route.query.editId);
      const med = medicines.value.find(
        (m) => m.id === Number(route.query.editId)
      );
      if (med) {
        editMedicine(med);
        void router.replace({ query: { ...route.query, editId: undefined } });
      } else {
        if (route.query.name && route.query.dosage) {
          newMedicine.name = String(route.query.name);
          newMedicine.dosage = Number(route.query.dosage);
          if (route.query.category)
            newMedicine.category = String(route.query.category);
          if (route.query.frequency)
            newMedicine.frequency = String(route.query.frequency);

          isEditing.value = false;
          medicineDialog.value = true;
          info(
            "Este medicamento não está mais cadastrado. Você pode adicioná-lo novamente."
          );
          void router.replace({
            query: {
              ...route.query,
              editId: undefined,
              name: undefined,
              dosage: undefined,
              category: undefined,
              frequency: undefined,
            },
          });
        } else {
          error("O medicamento não está mais cadastrado.");
        }
      }
    }
  } catch (err) {
    const axiosError = err as AxiosError;
    console.error(
      "Erro ao buscar medicamentos:",
      axiosError.response?.data || axiosError.message
    );
    error("Erro ao carregar medicamentos");
  } finally {
    loading.value = false;
  }
};

const saveMedicine = async () => {
  if (
    !newMedicine.name ||
    !newMedicine.dosage ||
    !newMedicine.category ||
    !newMedicine.frequency
  ) {
    error("Por favor, preencha todos os campos obrigatórios.");
    return;
  }
  if (newMedicine.schedules.length === 0) {
    error("Por favor, adicione pelo menos um horário de medicação.");
    return;
  }

  if (newMedicine.stock < 0) {
    error("A quantidade em estoque não pode ser negativa.");
    return;
  }

  try {
    if (isEditing.value) {
      await api.put(`/medication/${newMedicine.id}`, newMedicine);
      success("Medicamento atualizado com sucesso!");
    } else {
      await api.post("/medication/", newMedicine);
      success("Medicamento adicionado com sucesso!");
    }

    await fetchMedicines();
    medicineDialog.value = false;
    resetForm();

    if (
      !isEditing.value &&
      route.query.shoppingId &&
      typeof route.query.shoppingId === "string"
    ) {
      try {
        await api.delete(`/shopping/${route.query.shoppingId}`);
        success("Medicamento adicionado e removido da lista de compras!");
      } catch {
        error("Não foi possível remover o medicamento da lista de compras.");
      }
    }
  } catch (err: unknown) {
    console.log("Erro ao salvar medicamento (catch):", err);

    const status =
      typeof err === "object" && err !== null && "response" in err
        ? (err as { response?: { status?: number } }).response?.status
        : undefined;

    if (status === 409) {
      info(
        "Já existe um medicamento com este nome e dosagem. Edite o medicamento existente."
      );

      await fetchMedicines();

      const existing = medicines.value.find(
        (m) =>
          m.name.trim().toLowerCase() ===
            newMedicine.name.trim().toLowerCase() &&
          m.dosage === newMedicine.dosage
      );
      if (existing) {
        // console.log(existing);
        error(
          "Não foi possível localizar o medicamento duplicado para edição."
        );
      }
      return;
    }

    error("Erro ao salvar medicamento");
    console.error("Erro ao salvar medicamento:", err);
  }
};

const getStatusColor = (medicine: Medicine): string => {
  if (medicine.stock <= 7) return "negative";
  if (medicine.stock <= 15) return "orange";
  if(medicine.stock >=15) return "blue";
  return "positive";
};

// Watching for changes in search and selectedGroup to refetch medicines
watch([search, selectedGroup], async () => {
  await fetchMedicines();
});

const updateSchedulesBasedOnFrequency = () => {
  const selectedFrequency = frequencyOptions.find(
    (opt) => opt.value === newMedicine.frequency
  );
  if (selectedFrequency) {
    const currentSchedules = [...newMedicine.schedules];
    newMedicine.schedules = Array(selectedFrequency.times)
      .fill("")
      .map((_, index) => currentSchedules[index] || "");
  }
};

watch(
  () => newMedicine.frequency,
  () => {
    updateSchedulesBasedOnFrequency();
  }
);

// Carryng out the initial fetch of medicines
onMounted(async () => {
  console.log("Componente montado. Query params:", route.query);
  await fetchMedicines();
  // Automatically open modal if it comes from the shopping list
  if (route.query.add === "1") {
    openAddDialog();
    if (route.query.name) {
      newMedicine.name = route.query.name as string;
    }
  }
});

const isMobile = ref(window.innerWidth <= 700);
const handleResize = () => {
  isMobile.value = window.innerWidth <= 700;
};
onMounted(() => window.addEventListener("resize", handleResize));
onUnmounted(() => window.removeEventListener("resize", handleResize));
</script>

<style scoped>
.text-primary {
  color: var(--blue);
}

.text-negative {
  color: var(--orange-smooth);
}

.text-positive {
  color: var(--green);
}

/* Style for the table */
:deep(.q-table th) {
  font-weight: bold;
  background-color: #f5f5f5;
}

:deep(.q-table tr:hover) {
  background-color: var(--gray-light);
}

:deep(.q-btn.q-btn--flat) {
  color: var(--blue);
}

/* Style for the negative button */
.q-btn[color="negative"] {
  background-color: var(--orange-smooth);
  color: white;
}

/* style for badge */
:deep(.q-badge) {
  font-size: 0.8rem;
  padding: 4px 8px;
}

:deep(.q-badge[color="negative"]) {
  background-color: var(--orange-smooth);
}

:deep(.q-badge[color="orange"]) {
  background-color: var(--yellow-Calm);
  color: var(--gray-dark);
}

:deep(.q-badge[color="positive"]) {
  background-color: var(--green-light);
  color: var(--green-dark);
}

@media (max-width: 700px) {
  .q-btn.q-px-md {
    padding-left: 8px !important;
    padding-right: 8px !important;
    font-size: 14px !important;
    min-width: 36px !important;
  }
}
</style>
