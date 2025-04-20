<template>
  <q-page padding>
    <div class="row items-center q-mb-md">
      <div class="col">
        <h5 class=" text-primary">Resumo do Dia</h5>
      </div>
    </div>

    <div class="row q-col-gutter-m q-mb-lg">
      <q-card class="col-xs-12 col-sm-4" bordered>
        <q-card-section>
          <div class="text-h6 text-primary">💊 Medicamentos Ativos</div>
          <div class="text-h4 text-weight-bold q-mt-sm">05</div>
          <q-btn flat label="Ver todos" color="primary" class="q-mt-md" />
        </q-card-section>
      </q-card>

      <q-card class="col-xs-12 col-sm-4" bordered >
        <q-card-section>
          <div class="text-h6 text-negative">⚠️ Reposição Urgente</div>
          <div class="text-h4 text-weight-bold q-mt-sm">01</div>
          <q-btn flat label="Resolver agora" color="negative" class="q-mt-md" />
        </q-card-section>
      </q-card>

      <q-card class="col-xs-12 col-sm-4" bordered>
        <q-card-section>
          <div class="text-h6 text-positive">🛒 Lista de Compras</div>
          <div class="text-h4 text-weight-bold q-mt-sm">03</div>
          <q-btn flat label="Ver lista" color="positive" class="q-mt-md" />
        </q-card-section>
      </q-card>
    </div>

    <div class="row q-col-gutter-m">
      <q-card class="col-xs-12 col-md-6" bordered>
        <q-card-section>
          <div class="text-subtitle1">📅 Próximo lembrete</div>
          <div class="text-h6 text-primary q-mt-sm">Omeprazol às 09:00</div>
          <q-btn flat label="Ver calendário" color="primary" class="q-mt-md" />
        </q-card-section>
      </q-card>

      <q-card class="col-xs-12 col-md-6" bordered>
        <q-card-section>
          <div class="text-subtitle1">🤖 IA Assistente</div>
          <div class="q-mt-sm">Converse com o assistente para tirar dúvidas sobre medicação.</div>
          <q-btn flat label="Abrir chat" color="primary" class="q-mt-md" />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
// Aqui futuramente você pode puxar dados via API ou store
</script>

<style scoped>
.text-h6 {
  font-weight: 600;
}
</style>
