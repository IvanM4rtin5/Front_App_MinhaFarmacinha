<template>
  <q-page padding>
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h5 class="text-primary">Minha Farmacinha <q-icon name="chevron_right" /> Meus Medicamentos</h5>
        <p class="text-grey-7">Lista de medicamentos que estou utilizando atualmente.</p>
      </div>
      <div class="col-auto">
        <q-btn 
          color="negative" 
          icon="add" 
          label="Adicionar Medicamento" 
          @click="openAddDialog"
          class="q-px-md"
        />
      </div>
    </div>

    <div class="row q-mb-md q-col-gutter-md">
      <div class="col-md-6 col-12">
        <q-input
          outlined
          dense
          placeholder="Buscar medicamento..."
          v-model="search"
          class="bg-white"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <div class="col-md-6 col-12">
        <div class="row q-col-gutter-md">
          <div class="col">
            <q-select
              outlined
              dense
              v-model="selectedGroup"
              :options="groupOptions"
              placeholder="- Selecionar Categoria -"
              class="bg-white"
            >
              <template v-slot:append>
                <q-icon name="expand_more" />
              </template>
            </q-select>
          </div>
          <div class="col-auto">
            <q-btn flat dense icon="filter_list" class="q-px-sm bg-white" />
          </div>
        </div>
      </div>
    </div>

    <q-card flat bordered class="bg-white">
      <q-table
        :rows="medicines"
        :columns="columns"
        row-key="id"
        v-model:pagination="pagination"
        :loading="loading"
        flat
        bordered
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
              <q-icon name="unfold_more" size="sm" class="q-ml-xs" />
            </q-th>
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="name" :props="props">
              <div class="row items-center">
                <q-icon :name="props.row.icon || 'medication'" color="primary" size="sm" class="q-mr-sm" />
                {{ props.row.name }}
              </div>
            </q-td>
            <q-td key="dosage" :props="props">{{ props.row.dosage }}</q-td>
            <q-td key="category" :props="props">{{ props.row.category }}</q-td>
            <q-td key="frequency" :props="props">{{ props.row.frequency }}</q-td>
            <q-td key="schedules" :props="props">
              <div class="row items-center">
                <q-chip 
                  v-for="(time, index) in props.row.schedules" 
                  :key="index" 
                  size="sm" 
                  color="blue-1" 
                  text-color="primary"
                  class="q-mr-xs"
                >
                  <q-icon name="schedule" size="xs" class="q-mr-xs" />
                  {{ time }}
                </q-chip>
              </div>
            </q-td>
            <q-td key="stock" :props="props">
              <q-badge :color="getStockColor(props.row.stock)">{{ props.row.stock }}</q-badge>
            </q-td>
            <q-td key="action" :props="props" class="q-gutter-x-sm">
              <q-btn size="sm" flat round color="primary" icon="edit" @click="editMedicine(props.row)" />
              <q-btn size="sm" flat round color="negative" icon="delete" @click="confirmDelete(props.row)" />
            </q-td>
          </q-tr>
        </template>
        <template v-slot:no-data>
          <div class="full-width row flex-center q-pa-md text-grey-7">
            <q-icon name="medication_liquid" size="2rem" class="q-mb-sm" />
            <div>Nenhum medicamento encontrado. Adicione seu primeiro medicamento!</div>
          </div>
        </template>
      </q-table>
    </q-card>

    <!-- Dialog para adicionar/editar medicamento -->
    <q-dialog v-model="medicineDialog" persistent>
      <q-card style="width: 600px; max-width: 100vw; padding-left: 5px;">
        <q-card-section class="row items-center" style="background-color: var(--gray-dark); color: var(--white); margin-left: -5px;">
          <div class="text-h6 ">{{ isEditing ? 'Editar Medicamento' : 'Adicionar Novo Medicamento' }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pt-md">
          <q-form @submit="saveMedicine" class="q-gutter-md">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input 
                  v-model="newMedicine.name" 
                  label="Nome do Medicamento" 
                  outlined 
                  :rules="[val => !!val || 'Campo obrigatório']"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input 
                  v-model="newMedicine.dosage" 
                  label="Dosagem (ex: 500mg, 10ml)" 
                  outlined 
                  :rules="[val => !!val || 'Campo obrigatório']"
                />
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-select 
                  v-model="newMedicine.category" 
                  :options="categoryOptions" 
                  label="Categoria" 
                  outlined 
                  :rules="[val => !!val || 'Selecione uma categoria']"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-select 
                  v-model="newMedicine.frequency" 
                  :options="frequencyOptions" 
                  label="Frequência de Uso" 
                  outlined 
                  :rules="[val => !!val || 'Selecione a frequência']"
                />
              </div>
            </div>

            <q-card bordered class="q-pa-md">
              <div class="text-subtitle2 q-mb-md">Horários de Medicação</div>
              <div class="row q-col-gutter-md">
                <div class="col-9">
                  <q-time
                    v-model="currentTime"
                    format24h
                    mask="HH:mm"
                    outlined
                    class="full-width"
                  />
                </div>
                <div class="col-3">
                  <q-btn 
                    color="primary" 
                    icon="add" 
                    label="Adicionar" 
                    class="full-width"
                    @click="addSchedule"
                  />
                </div>
              </div>
              
              <div class="q-mt-md">
                <q-list bordered separator>
                  <q-item v-for="(time, index) in newMedicine.schedules" :key="index">
                    <q-item-section>
                      <div class="row items-center">
                        <q-icon name="schedule" color="primary" class="q-mr-sm" />
                        {{ time }}
                      </div>
                    </q-item-section>
                    <q-item-section side>
                      <q-btn size="sm" flat round dense color="negative" icon="remove_circle" @click="removeSchedule(index)" />
                    </q-item-section>
                  </q-item>
                  <q-item v-if="newMedicine.schedules.length === 0">
                    <q-item-section class="text-grey">
                      Nenhum horário adicionado
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </q-card>

            <div class="row q-col-gutter-md q-mt-md">
              <div class="col-12 col-md-6">
                <q-input 
                  v-model="newMedicine.stock" 
                  label="Quantidade disponível" 
                  type="number" 
                  outlined 
                  :rules="[val => val >= 0 || 'Quantidade não pode ser negativa']"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input 
                  v-model="newMedicine.duration" 
                  label="Duração do tratamento (dias)" 
                  type="number" 
                  outlined 
                  hint="Deixe em branco para uso contínuo"
                />
              </div>
            </div>

            <q-input 
              v-model="newMedicine.notes" 
              label="Observações" 
              type="textarea" 
              outlined 
              hint="Instruções especiais, restrições, etc."
            />
          </q-form>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
          <q-btn label="Salvar" color="primary" @click="saveMedicine" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog de confirmação para excluir -->
    <q-dialog v-model="deleteDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="negative" text-color="white" />
          <span class="q-ml-sm">Excluir medicamento</span>
        </q-card-section>

        <q-card-section>
          <span v-if="medicineToDelete">
            Tem certeza que deseja excluir o medicamento "{{ medicineToDelete.name }}"?
          </span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="Excluir" color="negative" @click="deleteMedicine" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

// Definição de tipos
interface Medicine {
  id: number;
  name: string;
  dosage: string;
  category: string;
  frequency: string;
  schedules: string[];
  stock: number;
  duration: number | null;
  notes: string;
  icon: string;
}

// Dados para a tabela
const loading = ref(false);
const search = ref('');
const selectedGroup = ref<string | null>(null);
const currentTime = ref('08:00');
const isEditing = ref(false);
const medicineToDelete = ref<Medicine | null>(null);
const medicineDialog = ref(false);
const deleteDialog = ref(false);

// Opções para os selects
const groupOptions = [
  '- Selecionar Categoria -',
  'Analgésicos',
  'Anti-inflamatórios',
  'Antibióticos',
  'Antivirais',
  'Diabetes',
  'Hipertensão',
  'Suplementos',
  'Vitaminas',
  'Outros'
];

const categoryOptions = [
  'Analgésicos',
  'Anti-inflamatórios',
  'Antibióticos',
  'Antivirais',
  'Diabetes',
  'Hipertensão',
  'Suplementos',
  'Vitaminas',
  'Outros'
];

const frequencyOptions = [
  'Uma vez ao dia',
  'Duas vezes ao dia',
  'Três vezes ao dia',
  'Quatro vezes ao dia',
  'A cada 8 horas',
  'A cada 12 horas',
  'Quando necessário',
  'Antes das refeições',
  'Após as refeições'
];

// Lista de medicamentos
const medicines = ref<Medicine[]>([
  { 
    id: 1,
    name: 'Omeprazol', 
    dosage: '20mg', 
    category: 'Outros', 
    frequency: 'Uma vez ao dia',
    schedules: ['08:00'],
    stock: 30,
    duration: 30,
    notes: 'Tomar em jejum',
    icon: 'medication_liquid'
  },
  { 
    id: 2,
    name: 'Paracetamol', 
    dosage: '750mg', 
    category: 'Analgésicos', 
    frequency: 'Quando necessário',
    schedules: [],
    stock: 15,
    duration: null,
    notes: 'Em caso de dor ou febre',
    icon: 'medication'
  },
  { 
    id: 3,
    name: 'Losartana', 
    dosage: '50mg', 
    category: 'Hipertensão', 
    frequency: 'Duas vezes ao dia',
    schedules: ['08:00', '20:00'],
    stock: 45,
    duration: null,
    notes: 'Controle de pressão arterial',
    icon: 'medication'
  },
  { 
    id: 4,
    name: 'Insulina', 
    dosage: '10 UI', 
    category: 'Diabetes', 
    frequency: 'Três vezes ao dia',
    schedules: ['07:00', '13:00', '19:00'],
    stock: 5,
    duration: null,
    notes: 'Aplicar antes das refeições',
    icon: 'vaccines'
  },
  { 
    id: 5,
    name: 'Amoxicilina', 
    dosage: '500mg', 
    category: 'Antibióticos', 
    frequency: 'A cada 8 horas',
    schedules: ['06:00', '14:00', '22:00'],
    stock: 3,
    duration: 7,
    notes: 'Tomar até o fim do tratamento',
    icon: 'medication'
  }
]);

// Colunas da tabela - corrigindo o tipo de align
const columns = [
  { name: 'name', align: 'left' as const, label: 'Medicamento', field: 'name', sortable: true },
  { name: 'dosage', align: 'left' as const, label: 'Dosagem', field: 'dosage', sortable: true },
  { name: 'category', align: 'left' as const, label: 'Categoria', field: 'category', sortable: true },
  { name: 'frequency', align: 'left' as const, label: 'Frequência', field: 'frequency', sortable: true },
  { name: 'schedules', align: 'left' as const, label: 'Horários', field: 'schedules', sortable: false },
  { name: 'stock', align: 'center' as const, label: 'Estoque', field: 'stock', sortable: true },
  { name: 'action', align: 'center' as const, label: 'Ações', field: 'action', sortable: false }
];

const pagination = ref({
  rowsPerPage: 10
});

// Novo medicamento com tipos corretos
const newMedicine = reactive<Medicine>({
  id: 0,
  name: '',
  dosage: '',
  category: '',
  frequency: '',
  schedules: [],
  stock: 0,
  duration: null,
  notes: '',
  icon: 'medication'
});

// Funções
const openAddDialog = () => {
  isEditing.value = false;
  resetForm();
  medicineDialog.value = true;
};

const editMedicine = (medicine: Medicine) => {
  isEditing.value = true;
  
  // Copiar valores do medicamento para o formulário
  newMedicine.id = medicine.id;
  newMedicine.name = medicine.name;
  newMedicine.dosage = medicine.dosage;
  newMedicine.category = medicine.category;
  newMedicine.frequency = medicine.frequency;
  newMedicine.schedules = [...medicine.schedules];
  newMedicine.stock = medicine.stock;
  newMedicine.duration = medicine.duration;
  newMedicine.notes = medicine.notes;
  newMedicine.icon = medicine.icon;
  
  medicineDialog.value = true;
};

const confirmDelete = (medicine: Medicine) => {
  medicineToDelete.value = medicine;
  deleteDialog.value = true;
};

const deleteMedicine = () => {
  if (medicineToDelete.value) {
    const index = medicines.value.findIndex(m => m.id === medicineToDelete.value!.id);
    if (index !== -1) {
      medicines.value.splice(index, 1);
    }
  }
};

const resetForm = () => {
  // Resetar valores do formulário
  newMedicine.id = 0;
  newMedicine.name = '';
  newMedicine.dosage = '';
  newMedicine.category = '';
  newMedicine.frequency = '';
  newMedicine.schedules = [];
  newMedicine.stock = 0;
  newMedicine.duration = null;
  newMedicine.notes = '';
  newMedicine.icon = 'medication';
};

const addSchedule = () => {
  if (currentTime.value && !newMedicine.schedules.includes(currentTime.value)) {
    newMedicine.schedules.push(currentTime.value);
    // Ordenar os horários
    newMedicine.schedules.sort();
  }
};

const removeSchedule = (index: number) => {
  newMedicine.schedules.splice(index, 1);
};

const saveMedicine = () => {
  // Gerar um ID para novo medicamento
  if (newMedicine.id === 0) {
    newMedicine.id = Date.now();
  }
  
  if (isEditing.value) {
    // Atualizar medicamento existente
    const index = medicines.value.findIndex(m => m.id === newMedicine.id);
    if (index !== -1) {
      medicines.value[index] = { ...newMedicine };
    }
  } else {
    // Adicionar novo medicamento
    medicines.value.push({ ...newMedicine });
  }
  
  // Fechar o diálogo e resetar o formulário
  medicineDialog.value = false;
  resetForm();
};

const getStockColor = (stock: number): string => {
  if (stock <= 3) return 'negative';
  if (stock <= 10) return 'orange';
  return 'positive';
};
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

/* Estilo para a tabela */
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

/* Estilo para o botão principal */
.q-btn[color="negative"] {
  background-color: var(--orange-smooth);
  color: white;
}

/* Estilo para badges de estoque */
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
</style>