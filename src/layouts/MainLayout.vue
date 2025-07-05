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
          <NotificationsDropdown @abrirMensagem="openMessageModal" />
          <q-tooltip>Notificações</q-tooltip>
        </div>
      </q-toolbar>
    </q-header>
    <!-- Menu lateral -->
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list padding class="text-white">
        <!-- User (avatar + name + menu) -->
        <div class="q-mt-md q-mb-md flex flex-center column">
          <q-avatar size="56px" color="primary" text-color="white">
            <img v-if="avatarUrl" :src="avatarUrl" />
            <template v-else>
              {{ name?.[0]?.toUpperCase() + (name?.[1] ?? "") || "?" }}
            </template>
          </q-avatar>

          <div class="q-mt-sm text-subtitle2 text-white text-center">
            {{ name || "Usuário" }}
          </div>

          <q-btn dense flat color="primary" label="Opções" class="q-mt-sm">
            <q-menu transition-show="rotate" transition-hide="rotate">
              <q-list style="min-width: 90px" class="text-primary">
                <q-item clickable>
                  <q-item-section>Editar perfil</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable>
                  <q-item-section>Gerar Relatorio</q-item-section>
                </q-item>
                <q-separator />
                <q-item>
                  <q-item-section>Historico</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>

        <q-separator spaced color="primary" />

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
        <q-item clickable @click="handleUserClick()">
          <q-item-section avatar
            ><q-icon name="exit_to_app" color="primary"
          /></q-item-section>
          <q-item-section>Sair</q-item-section>
        </q-item>
      </q-list>
      <footer class="footer-container">
        <div class="footer-content">
          <div class="footer-logo-section">
            <img
              class="footer-logo"
              src="../assets/image/favicon-96x96.png"
              alt="Minha Farmacinha"
            />
            <span class="footer-brand">Minha Farmacinha</span>
          </div>
          <div class="footer-info">
            <p class="footer-text">
              © 2024 Minha Farmacinha. Todos os direitos reservados.
            </p>
            <p class="footer-subtext">Sua saúde em primeiro lugar</p>
          </div>
        </div>
      </footer>
    </q-drawer>

    <!-- page content -->
    <q-page-container>
      <ModalNotify
        v-model="showModalNotify"
        :notification="selectedNotification"
      />
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import NotificationsDropdown from "src/components/Notify/NotificationsDropdown.vue";
import ModalNotify from "src/components/Notify/ModalNotify.vue";
import type { Notification } from "src/types/Notification/notification";

const router = useRouter();
const leftDrawerOpen = ref(false);
const authStore = useAuthStore();
const { name, user, avatarUrl } = storeToRefs(authStore);
const showModalNotify = ref(false);
const selectedNotification = ref<Notification | null>(null);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function handleUserClick() {
  if (user.value) {
    authStore.logout();
    console.log("Redirecionando para /");
    void router.push("/");
  }
}

function openMessageModal(notification: Notification | null) {
  selectedNotification.value = notification;
  showModalNotify.value = true;
}
</script>

<style>
.q-drawer {
  background: linear-gradient(
    135deg,
    var(--blue-dark) 0%,
    var(--gray-dark) 120%
  );
  display: flex;
  flex-direction: column;
  height: 100%;
}

.q-list {
  flex: 1 1 auto;
  overflow-y: auto;
}

.q-item,
.q-item-label {
  font-size: 18px;
}

.footer-container {
  margin-top: auto;
  padding: 24px 16px;
  background: linear-gradient(135deg, var(--blue-light) 0%, var(--blue) 150%);
  border: 2px solid var(--blue);
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  max-width: 400px;
  margin: 0 auto;
}

.footer-logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.footer-logo {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.footer-logo:hover {
  transform: scale(1.05);
}

.footer-brand {
  font-size: 18px;
  font-weight: 600;
  color: var(--blue);
}

.footer-info {
  text-align: center;
}

.footer-text {
  color: var(--gray-dark);
  font-size: 14px;
  font-weight: 500;
  margin: 0 0 4px 0;
}

.footer-subtext {
  color: var(--gray-dark);
  font-size: 12px;
  opacity: 0.8;
  margin: 0;
}

@media (max-width: 600px) {
  .footer-container {
    margin-top: 152px;
    padding-bottom: 32px;
  }
}
</style>
