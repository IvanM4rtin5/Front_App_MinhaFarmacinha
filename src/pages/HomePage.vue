<template>
    <q-page padding>
      <div class="row items-center q-mb-lg">
        <div class="col">
          <h5 class="text-primary">Minha Farmacinha <q-icon name="chevron_right" />Resumo do Dia</h5>
          <p 
          @click="handleUserClick" 
          class="text-grey-7" 
          style="cursor: pointer;
          display: inline-block;"
          >
          Bem-vindo {{ name }}
          <q-tooltip 
          style="top: -6px;" >
            Clique para ver seu perfil</q-tooltip>
          </p> 
        </div>
      </div>
  
      <div class="card-grid q-mb-xl">
        <q-card bordered class="card-item">
          <q-card-section>
            <div class="text-h6 text-primary">💊 Medicamentos Ativos</div>
            <div class="text-h4 text-weight-bold q-mt-sm">05</div>
            <q-btn flat label="Ver todos" color="primary" class="q-mt-md" />
          </q-card-section>
        </q-card>
  
        <q-card bordered class="card-item">
          <q-card-section>
            <div class="text-h6 text-negative">⚠️ Reposição Urgente</div>
            <div class="text-h4 text-weight-bold q-mt-sm">01</div>
            <q-btn flat label="Resolver agora" color="negative" class="q-mt-md" />
          </q-card-section>
        </q-card>
  
        <q-card bordered class="card-item">
          <q-card-section>
            <div class="text-h6 text-positive">🛒 Lista de Compras</div>
            <div class="text-h4 text-weight-bold q-mt-sm">03</div>
            <q-btn flat label="Ver lista" color="positive" class="q-mt-md" />
          </q-card-section>
        </q-card>
      </div>
  
      <div class="card-grid">
        <q-card bordered class="card-item">
          <q-card-section>
            <div class="text-subtitle1">📅 Próximo lembrete</div>
            <div class="text-h6 text-primary q-mt-sm">Omeprazol às 09:00</div>
            <q-btn flat label="Ver calendário" color="primary" class="q-mt-md" />
          </q-card-section>
        </q-card>
  
        <q-card bordered class="card-item">
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
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
 
  
  const router = useRouter();
  const name = ref(localStorage.getItem('name') || 'Visitante');
  
  const handleUserClick = () => {
    void router.push('/app/profile');
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