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
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const shoppingListCount = ref(0);

const navigateToShoppingList = () => {
  void router.push("/app/shopping-list");
};

defineProps({
  count: {
    type: Number,
    default: 0,
  },
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
