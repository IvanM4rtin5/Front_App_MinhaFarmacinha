<template>
  <q-page padding>
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h5 class="text-primary">
          Minha Farmacinha <q-icon name="chevron_right" />Perfil do Usuário
        </h5>
        <p class="text-grey-7">Gerencie suas informações pessoais</p>
      </div>
    </div>

    <div class="profile-container">
      <div class="profile-header q-mb-lg">
        <div class="profile-avatar">
          <q-avatar size="56px" color="primary" text-color="white">
            {{ name?.[0]?.toUpperCase() + (name?.[1] ?? "") || "?" }}
          </q-avatar>
          <q-btn round flat icon="edit" size="sm" class="edit-avatar-btn" />
        </div>
        <div class="profile-info">
          <h1>{{ name || "Usuário" }}</h1>
          <p class="user-email">
            {{
              user && typeof user === "object"
                ? user.email
                : "email@exemplo.com"
            }}
          </p>
        </div>
      </div>

      <div class="card-grid q-mb-xl">
        <q-card bordered class="card-item">
          <q-card-section>
            <div class="text-h6 text-primary">💊 Meus Medicamentos</div>
            <div class="text-h4 text-weight-bold q-mt-sm">12</div>
            <q-btn flat label="Ver todos" color="primary" class="q-mt-md" />
          </q-card-section>
        </q-card>

        <q-card bordered class="card-item">
          <q-card-section>
            <div class="text-h6 text-negative">📋 Minhas Listas</div>
            <div class="text-h4 text-weight-bold q-mt-sm">5</div>
            <q-btn flat label="Gerenciar" color="negative" class="q-mt-md" />
          </q-card-section>
        </q-card>

        <q-card bordered class="card-item">
          <q-card-section>
            <div class="text-h6 text-positive">⭐ Favoritos</div>
            <div class="text-h4 text-weight-bold q-mt-sm">3</div>
            <q-btn
              flat
              label="Ver favoritos"
              color="positive"
              class="q-mt-md"
            />
          </q-card-section>
        </q-card>
      </div>

      <div class="profile-actions q-mt-xl">
        <q-btn
          class="action-btn"
          color="primary"
          icon="edit"
          label="Editar Perfil"
        />
        <q-btn
          class="action-btn"
          color="secondary"
          icon="settings"
          label="Configurações"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();
const { name, user } = storeToRefs(authStore);
</script>

<style scoped>
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  background: var(--white);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 24px;
}

.profile-avatar {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.edit-avatar-btn {
  position: absolute;
  bottom: -8px;
  right: -8px;
  background: var(--orange-smooth);
  color: var(--white);
  width: 24px;
  height: 24px;
  font-size: 12px;
}

.profile-info h1 {
  color: var(--orange-smooth);
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.user-email {
  color: var(--gray-dark);
  margin: 4px 0 0 0;
  font-weight: 500;
  font-size: 15px;
}

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

.profile-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.action-btn {
  min-width: 160px;
}

:deep(.q-btn[color="primary"]) {
  background-color: var(--blue);
  color: var(--white);
}

:deep(.q-btn[color="secondary"]) {
  background-color: var(--green);
  color: var(--white);
}

:deep(.q-btn[color="negative"]) {
  background-color: var(--orange-smooth);
  color: var(--white);
}

:deep(.q-btn[color="positive"]) {
  background-color: var(--green);
  color: var(--white);
}

:deep(.text-primary) {
  color: var(--blue) !important;
}

:deep(.text-negative) {
  color: var(--orange-smooth) !important;
}

:deep(.text-positive) {
  color: var(--green) !important;
}
</style>
