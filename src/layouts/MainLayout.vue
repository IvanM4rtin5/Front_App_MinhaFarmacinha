<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Cabeçalho -->
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-avatar class="q-ml-sm">
          <q-icon name="local_pharmacy" color="primary" />
        </q-avatar>
        <q-toolbar-title> Minha Farmacinha </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- Menu lateral -->
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list padding class="text-white">
        <q-item-label header 
        class="text-uppercase text-bold text-white text-center q-mt-7 q-mb-lg">
          Menu
        </q-item-label>

        <q-item clickable to="/" exact>
          <q-item-section avatar
            ><q-icon name="home" color="primary"
          /></q-item-section>
          <q-item-section>Início</q-item-section>
        </q-item>

        <q-item clickable to="/medicines">
          <q-item-section avatar
            ><q-icon name="medical_services" color="primary"
          /></q-item-section>
          <q-item-section>Medicamentos</q-item-section>
        </q-item>

        <q-item clickable to="/shopping">
          <q-item-section avatar
            ><q-icon name="shopping_cart" color="primary"
          /></q-item-section>
          <q-item-section>Compras</q-item-section>
        </q-item>

        <q-item clickable to="/chat">
          <q-item-section avatar
            ><q-icon name="chat" color="primary"
          /></q-item-section>
          <q-item-section>Chat IA</q-item-section>
        </q-item>

        <q-item clickable to="/profile">
          <q-item-section avatar
            ><q-icon name="person" color="primary"
          /></q-item-section>
          <q-item-section>Perfil</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- Conteúdo da página -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from "vue";

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>

<style>
.q-drawer {
  background-color: var(--gray-dark);
}
.q-item, .q-item-label {
  font-size: 18px;
}
</style>
