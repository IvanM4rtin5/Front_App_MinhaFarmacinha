<template>
  <q-page padding>
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h5 class="text-primary">
          Minha Farmacinha <q-icon name="chevron_right" />Resumo do Dia
        </h5>
        <p
          @click="handleUserClick"
          class="text-grey-7"
          style="cursor: pointer; display: inline-block"
        >
          Bem-vindo {{ name }}
          <q-tooltip style="top: -6px"> Clique para ver seu perfil</q-tooltip>
        </p>
      </div>
    </div>

    <CardMedicines :shopping-list="3" next-reminder="Omeprazol às 09:00" />
  </q-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import CardMedicines from "components/CardMedicines.vue";

const router = useRouter();
const name = ref(localStorage.getItem("name") || "Visitante");

const handleUserClick = () => {
  void router.push("/app/profile");
};
</script>

<style scoped>
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.card-item {
  padding: 12px;
}

.text-h6 {
  font-weight: 600;
}
p {
  font-weight: 500;
  font-size: 15px;
}
</style>
