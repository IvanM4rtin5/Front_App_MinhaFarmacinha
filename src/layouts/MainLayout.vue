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
          size="lg"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title class="text-h5">
          Minha Farmacinha
          <q-avatar color="primary" text-color="white" size="50px">
            <q-icon name="health_and_safety" />
          </q-avatar>
        </q-toolbar-title>

        <div class="row items-center">
          <NotificationsDropdown />
          <q-tooltip>Notificações</q-tooltip>
        </div>
      </q-toolbar>
    </q-header>
    <!-- Menu lateral -->
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list padding class="text-white">
        <!-- Usuário (avatar + nome + menu) -->
        <div class="q-mt-xl q-mb-md flex flex-center column">
          <q-avatar size="56px" color="primary" text-color="white">
            {{ name?.[0]?.toUpperCase() + (name?.[1] ?? "") || "?" }}
          </q-avatar>

          <div class="q-mt-sm text-subtitle2 text-white text-center">
            {{ name || "Usuário" }}
          </div>

          <q-btn dense flat color="primary" label="Opções" class="q-mt-sm">
            <q-menu transition-show="rotate" transition-hide="rotate">
              <q-list style="min-width: 90px; color: var(--gray-dark)">
                <q-item clickable>
                  <q-item-section>Configurações</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Editar perfil</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable @click="handleUserClick">
                  <q-item-section><strong>Sair</strong></q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>

        <q-separator spaced color="grey-6" />

        <q-item clickable to="/app/home" exact>
          <q-item-section avatar
            ><q-icon name="home" color="primary"
          /></q-item-section>
          <q-item-section>Início</q-item-section>
        </q-item>

        <q-item clickable to="/app/medicines">
          <q-item-section avatar
            ><q-icon name="medical_services" color="primary"
          /></q-item-section>
          <q-item-section>Medicamentos</q-item-section>
        </q-item>

        <q-item clickable to="/app/shopping">
          <q-item-section avatar
            ><q-icon name="shopping_cart" color="primary"
          /></q-item-section>
          <q-item-section>Compras</q-item-section>
        </q-item>

        <q-item clickable to="/app/chat">
          <q-item-section avatar
            ><q-icon name="chat" color="primary"
          /></q-item-section>
          <q-item-section>Chat IA</q-item-section>
        </q-item>

        <q-item clickable to="/app/profile">
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
import NotificationsDropdown from "components/NotificationsDropdown.vue";

const router = useRouter();
const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
const authStore = useAuthStore();
const { name, user } = storeToRefs(authStore);

function handleUserClick() {
  if (user.value) {
    authStore.logout();
    void router.push("/");
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
