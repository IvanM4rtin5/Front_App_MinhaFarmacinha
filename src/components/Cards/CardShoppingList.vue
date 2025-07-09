<template>
  <q-card bordered class="card-item">
    <q-card-section>
      <div class="text-h6 text-positive">🛒 Lista de Compras</div>
      <div class="text-h4 text-weight-bold q-mt-sm">
        {{ shoppingListCount }}
      </div>
      <q-btn
        flat
        label="Ver lista"
        color="positive"
        class="q-mt-md"
        @click="navigateToShoppingList"
      />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref,onMounted } from "vue";
import { useRouter } from "vue-router";
import { api } from "src/boot/axios";
import { useNotify } from "src/composables/useNotify";
import type {Products} from "src/types/StoreList/products"

const router = useRouter();
const shoppingListCount = ref(0);
const {error} = useNotify();

const fetchShoppingList = async () => {
  try{
    const response = await api.get<Products[]>("/shopping/");
    const products = response.data;
    shoppingListCount .value = products. length;
  }catch{
    error("Erro ao carregar dados da Lista de Produtos")
  }
};

const navigateToShoppingList = () => {
  void router.push("/app/shopping");
};

onMounted(() => {
  void fetchShoppingList();
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
