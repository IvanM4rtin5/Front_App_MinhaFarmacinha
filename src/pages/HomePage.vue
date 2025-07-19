<template>
  <q-page padding>
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md-6">
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
      <div class="col-12 col-md-6">
        <InfoPopover class="popover-responsive">
          <p>
            Bem-vindo à sua
            <strong class="text-primary">Farmacinha Digital!</strong> Aqui você
            pode acompanhar seus medicamentos, acessar listas de compras,
            receber lembretes importantes e gerenciar seu perfil de forma
            simples e prática nos <strong class="text-grey-9">Cards</strong> abaixo:
          </p>
          <ul style="margin: 0; padding-left: 18px">
            <li>Visualize um resumo dos seus medicamentos e listas</li>
            <li>Acesse rapidamente suas listas de compras e medicamentos</li>
            <li>Receba lembretes e notificações importantes</li>
            <li>Gerencie seu perfil e preferências</li>
          </ul>
        </InfoPopover>
      </div>
    </div>

    <CardMedicines :shopping-list="3" next-reminder="Omeprazol às 09:00" />
  </q-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import InfoPopover from "src/components/InfoPopover.vue";
import CardMedicines from "components/Cards/CardMedicines.vue";

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
