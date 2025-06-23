<template>
  <q-page class="q-pa-md">
    <div class="col">
      <h5 class="text-primary">
        Minha Farmacinha <q-icon name="chevron_right" /> Lista de Compras
      </h5>
      <p class="text-grey-7">
        Lista de medicamentos que voçe deseja ou precisa comprar
      </p>
    </div>

    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-8">
        <q-input
          v-model="newProduct"
          label="Novo produto/medicamento"
          outlined
          dense
          @keyup.enter="addProduct"
          :disable="loadingAdd"
        />
      </div>
      <div class="col-4">
        <q-btn
          color="positive"
          label="Adicionar"
          @click="addProduct"
          class="full-width"
          :loading="loadingAdd"
          :disable="loadingAdd"
        />
      </div>
    </div>

    <q-card flat bordered class="bg-white q-mt-md">
      <q-table
        :rows="shoppingList"
        :columns="columns"
        row-key="id"
        hide-bottom
        class="q-mb-none"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td v-if="shoppingList.length > 0" key="checked" :props="props">
              <q-checkbox v-model="props.row.checked" color="positive" />
            </q-td>
            <q-td key="name" :props="props">
              <span
                :class="{
                  'text-strike': props.row.checked,
                  'text-grey-6': props.row.checked,
                }"
                >{{ props.row.name }}</span
              >
            </q-td>
            <q-td key="actions" :props="props">
              <transition name="fade">
                <div v-if="props.row.checked">
                  <q-btn
                    flat
                    round
                    icon="delete"
                    color="negative"
                    @click="removeProduct(props.row.id)"
                    :loading="loadingDeleteId === props.row.id"
                    :disable="loadingDeleteId === props.row.id"
                  />
                  <q-btn
                    flat
                    round
                    icon="add"
                    color="primary"
                    @click="addToMedicines(props.row)"
                    class="q-ml-sm"
                  />
                </div>
              </transition>
            </q-td>
          </q-tr>
        </template>
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th v-if="shoppingList.length > 0" key="checked" :props="props">
              Check
            </q-th>
            <q-th key="name" :props="props">Produtos</q-th>
            <q-th key="actions" :props="props">
              <transition name="fade">
                <span v-if="shoppingList.some((item) => item.checked)"
                  >Ações</span
                >
              </transition>
            </q-th>
          </q-tr>
        </template>
        <template v-slot:no-data>
          <q-tr>
            <q-td colspan="100%" class="text-grey-6 text-center"
              >Nenhum produto adicionado ainda.</q-td
            >
          </q-tr>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useNotify } from "../composables/useNotify";

interface ShoppingItem {
  id: number;
  name: string;
  checked: boolean;
}

const { success } = useNotify();
const newProduct = ref("");
const shoppingList = ref<ShoppingItem[]>([]);
let nextId = 1;
const loadingDeleteId = ref<number | null>(null);
const loadingAdd = ref(false);

const columns = [
  {
    name: "checked",
    label: "Check",
    field: "checked",
    align: "center" as const,
  },
  {
    name: "name",
    label: "Produto",
    field: "name",
    align: "left" as const,
  },
  { name: "actions", label: "", field: "actions", align: "center" as const },
];

function addProduct() {
  const name = newProduct.value.trim();
  if (!name) return;
  loadingAdd.value = true;
  setTimeout(() => {
    shoppingList.value.push({ id: nextId++, name, checked: false });
    newProduct.value = "";
    loadingAdd.value = false;
  }, 500); // Simula loading
}

function removeProduct(id: number) {
  loadingDeleteId.value = id;
  const item = shoppingList.value.find((item) => item.id === id);
  setTimeout(() => {
    const idx = shoppingList.value.findIndex((item) => item.id === id);
    if (idx !== -1) shoppingList.value.splice(idx, 1);
    loadingDeleteId.value = null;
    if (item) success(`Produto "${item.name}" removido com sucesso`);
  }, 700);
}

function addToMedicines(item: ShoppingItem) {
  // in development
  success(`Produto "${item.name}" adicionado à lista de medicamentos!`);
}
</script>

<style scoped>
.text-strike {
  text-decoration: line-through;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
