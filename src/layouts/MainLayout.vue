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
        <q-toolbar-title>
          Minha Farmacinha
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- Menu lateral -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list padding>
        <q-item-label header> Menu </q-item-label>

        <q-item clickable to="/" exact>
          <q-item-section avatar><q-icon name="homepage" /></q-item-section>
          <q-item-section>Home</q-item-section>
        </q-item>

        <q-item clickable to="/medicines">
          <q-item-section avatar><q-icon name="medical_services" /></q-item-section>
          <q-item-section>Medicamentos</q-item-section>
        </q-item>

        <q-item clickable to="/shopping">
          <q-item-section avatar><q-icon name="shopping_cart" /></q-item-section>
          <q-item-section>Compras</q-item-section>
        </q-item>

        <q-item clickable to="/chat">
          <q-item-section avatar><q-icon name="chat" /></q-item-section>
          <q-item-section>Chat IA</q-item-section>
        </q-item>

        <q-item clickable to="/profile">
          <q-item-section avatar><q-icon name="person" /></q-item-section>
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
import { ref } from 'vue'

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>