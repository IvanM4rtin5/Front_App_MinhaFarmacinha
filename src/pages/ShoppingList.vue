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
          label="Novo Produto/Medicamento"
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
              <q-checkbox
                :model-value="props.row.checked"
                @update:model-value="
                  (checked) => toggleChecked(props.row, checked)
                "
                color="positive"
              />
            </q-td>
            <q-td key="name" :props="props">
              <span
                :class="{
                  'text-strike': props.row.checked,
                  'text-grey-6': props.row.checked,
                  'item-large': true,
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
            <q-th
              v-if="shoppingList.length > 0"
              key="checked"
              :props="props"
              class="header-large text-primary"
            >
              Check
            </q-th>
            <q-th key="name" :props="props" class="header-large text-primary">
              Produtos
              <q-icon name="shopping_cart" color="primary" />
            </q-th>
            <q-th
              key="actions"
              :props="props"
              class="header-large text-primary"
            >
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

    <q-dialog v-model="showAddMedicineModal" persistent>
      <q-card>
        <q-card-section class="row items-center q-ml-sm" >
            <q-avatar icon="add"
            class="q-mr-sm"
            color="primary"
            text-color="white"/>
            <h6 class="q-ml-sm text-primary" >Adicionar Produto?</h6>
            <p class="q-mt-md q-ml-lg">
              Deseja adicionar
              <strong>{{ selectedShoppingItem?.name }}</strong> na sua lista medicamento ?
            </p>
        </q-card-section>
        <q-card-actions class="q-mr-md" align="right">
          <q-btn flat 
          label="Cancelar"
          style="background-color: red;"
          color="white" 
          v-close-popup />
          <q-btn
            flat
            label="Adicionar"
            style="background-color: #1976d2;"
            color="white"
            @click="confirmAddToMedicines"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { api } from "src/boot/axios";
import { useRouter } from "vue-router";
import { useNotify } from "../composables/useNotify";

interface ShoppingItem {
  id: number;
  name: string;
  checked: boolean;
}

const { success, info, error } = useNotify();
const newProduct = ref("");
const shoppingList = ref<ShoppingItem[]>([]);
const loadingDeleteId = ref<number | null>(null);
const loadingAdd = ref(false);
const router = useRouter();

const showAddMedicineModal = ref(false);
const selectedShoppingItem = ref<ShoppingItem | null>(null);

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

async function addProduct() {
  const name = newProduct.value.trim();
  if (!name) {
    info("Insira um nome por favor");
    return;
  }
  loadingAdd.value = true;
  try {
    const response = await api.post("/shopping/", { name });
    shoppingList.value.push({
      id: response.data.id,
      name: response.data.name,
      checked: response.data.checked,
    });
    newProduct.value = "";
    success("Produto adicionado com sucesso!");
  } catch {
    error("Erro ao adicionar produto");
  } finally {
    loadingAdd.value = false;
  }
}

async function removeProduct(id: number) {
  loadingDeleteId.value = id;
  const item = shoppingList.value.find((item) => item.id === id);
  try {
    await api.delete(`/shopping/${id}`);
    const idx = shoppingList.value.findIndex((item) => item.id === id);
    if (idx !== -1) shoppingList.value.splice(idx, 1);
    if (item) success(`Produto "${item.name}" removido com sucesso`);
  } catch {
    error("Erro ao remover produto");
  } finally {
    loadingDeleteId.value = null;
  }
}

async function toggleChecked(item: ShoppingItem, checked: boolean) {
  try {
    const response = await api.patch(`/shopping/${item.id}`, { checked });
    item.checked = response.data.checked;
  } catch {
    error("Erro ao atualizar item");
  }
}

function addToMedicines(item: ShoppingItem) {
  selectedShoppingItem.value = item;
  showAddMedicineModal.value = true;
}

function confirmAddToMedicines() {
  showAddMedicineModal.value = false;
  void router.push({
    path: "/app/medicines",
    query: { add: "1", name: selectedShoppingItem.value?.name, shoppingId: selectedShoppingItem.value?.id }
  });
}

async function fetchShoppingList() {
  try {
    const response = await api.get("/shopping/");
    shoppingList.value = response.data.map((item: ShoppingItem) => ({
      id: item.id,
      name: item.name,
      checked: item.checked,
    }));
  } catch {
    error("Erro ao buscar lista de compras");
  }
}
onMounted(fetchShoppingList);
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
.header-large {
  font-size: 18px;
  font-weight: 550;
}
.item-large {
  font-size: 18px;
}

</style>
