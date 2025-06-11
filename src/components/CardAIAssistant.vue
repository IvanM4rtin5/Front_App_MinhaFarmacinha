<template>
  <q-card bordered class="card-item">
    <q-card-section>
      <div class="text-subtitle1">🤖 IA Assistente</div>
      <div class="q-mt-sm">
        Converse com o assistente para tirar dúvidas sobre medicação.
      </div>
      <q-btn
        flat
        label="Abrir chat"
        color="primary"
        class="q-mt-md"
        @click="openChat"
      />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const openChat = () => {
  void router.push("/app/chat");
};
</script>

<style scoped>
.card-item {
  padding: 12px;
}

.text-h6 {
  font-weight: 600;
}
</style>
