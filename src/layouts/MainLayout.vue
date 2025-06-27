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
        <!-- User (avatar + name + menu) -->
        <div class="q-mt-xl q-mb-md flex flex-center column">
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
const authStore = useAuthStore();
const { name, user, avatarUrl } = storeToRefs(authStore);

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
</script>

<style>
.q-drawer {
  background-color: var(--gray-dark);
}
.q-item,
.q-item-label {
  font-size: 18px;
}

.footer-container {
  margin-top: 10px;
  padding: 24px 16px;
  background: linear-gradient(135deg, var(--blue-light) 0%, var(--white) 100%);
  border-top: 2px solid var(--blue);
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
</style>
