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
        <q-item-label
          header
          class="text-uppercase text-bold text-white text-center q-mt-7 q-mb-lg"
        >
          Menu
        </q-item-label>
        <q-btn
          flat
          rounded
          class="q-mb-md q-px-md q-ml-lg items-center "
        >
        <q-avatar
        size="32px"
        color="primary"
        text-color="white"
        class="q-mr-sm"
        >
        <q-icon name="person" />
      </q-avatar>
      <div class="text-white text-subtitle2 text-left" v-if="name">{{ name }}
            <q-menu>
              <q-list>
                <q-btn 
                flat 
                label="Sair"
                color="negative"
                @click="handleUserClick"
                />
              </q-list>
            </q-menu>

          </div>
        </q-btn>

        <q-separator spaced color="grey-6" />

        <q-item clickable to="/home" exact>
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
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
const authStore = useAuthStore();
const { name, user } = storeToRefs(authStore);

function  handleUserClick() {
  if (user.value) {
    authStore.logout();
    void router.push('/')
  }
}
</script>

<style>
.q-drawer {
  background-color: var(--gray-dark);
}
.q-item,
.q-item-label {
  font-size: 18px;
}
</style>
