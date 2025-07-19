<template>
  <q-page padding>
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md-6">
        <h5 class="text-primary">
          Minha Farmacinha <q-icon name="chevron_right" />Perfil do Usuário
        </h5>
        <p class="text-grey-7">Gerencie suas informações pessoais</p>
      </div>
      <div class="col-12 col-md-6">
        <InfoPopover class="popover-responsive">
          <p>Gerencie suas informações pessoais de forma simples:</p>
          <ul style="margin: 0; padding-left: 18px">
            <li>Atualize nome, e-mail e foto de perfil</li>
            <li>Altere sua senha</li>
            <li>Exclua sua conta, se desejar</li>
          </ul>
        </InfoPopover>
      </div>
    </div>

    <div class="profile-container">
      <div class="profile-header q-mb-lg">
        <div class="profile-avatar">
          <q-avatar size="56px" color="primary" text-color="white">
            <img v-if="avatarUrl" :src="avatarUrl" />
            <template v-else>
              {{ name?.[0]?.toUpperCase() + (name?.[1] ?? "") || "?" }}
            </template>
          </q-avatar>
          <q-btn
            round
            flat
            icon="edit"
            size="sm"
            class="edit-avatar-btn q-mt-sm"
            @click="handleAvatarUpload"
          />
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
        <CardActiveMedicines />

        <q-card bordered class="card-item">
          <q-card-section>
            <div class="text-h6 text-negative">📋 Minhas Listas</div>
            <div class="text-h4 text-weight-bold q-mt-sm">
              {{ shoppingList }}
            </div>
            <q-btn
              flat
              label="Gerenciar"
              color="negative"
              class="q-mt-md"
              clickable
              to="/app/shopping"
            />
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
          @click="layout = true"
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

  <!-- /*Modal*/ -->
  <q-dialog v-model="layout">
    <q-card style="width: 80vw; max-width: 600px">
      <q-card-section
        class="row items-center"
        style="background-color: var(--blue)"
      >
        <div class="text-h6" style="color: aquamarine">Editar Perfil</div>
      </q-card-section>

      <q-card-section>
        <div class="column items-center q-mb-md">
          <q-avatar
            size="100px"
            color="primary"
            style="color: var(--blue-light)"
          >
            <img v-if="avatarUrl" :src="avatarUrl" />
            <template v-else>
              {{
                formData.name?.[0]?.toUpperCase() +
                  (formData.name?.[1] ?? "") || "?"
              }}
            </template>
          </q-avatar>
        </div>

        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            v-model="formData.name"
            label="Nome"
            :rules="[(val) => !!val || 'Nome é obrigatório']"
          />

          <q-input
            v-model="formData.email"
            label="Email"
            type="email"
            :rules="[
              (val) => !!val || 'Email é obrigatório',
              (val) => isValidEmail(val) || 'Email inválido',
            ]"
          />

          <div class="row justify-end q-mt-md">
            <q-btn
              label="Cancelar"
              color="white"
              flat
              v-close-popup
              class="q-mr-sm"
              style="background-color: red"
            />
            <q-btn label="Salvar" type="submit" color="primary" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { api } from "src/boot/axios";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../stores/auth";
import InfoPopover from "src/components/InfoPopover.vue";
import CardActiveMedicines from "src/components/Cards/CardActiveMedicines.vue";
import type { Products } from "src/types/StoreList/products";
import { useNotify } from "src/composables/useNotify";

const authStore = useAuthStore();
const { name, user, avatarUrl } = storeToRefs(authStore);
const { error } = useNotify();

const shoppingList = ref(0);
const layout = ref(false);
const formData = ref({
  name: name.value,
  email: typeof user.value === "object" && user.value ? user.value.email : "",
});

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const handleAvatarUpload = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";

  input.onchange = (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      authStore.setAvatar(file);
    }
  };

  input.click();
};

const onSubmit = () => {
  try {
    authStore.updateProfile({
      name: formData.value.name,
      email: formData.value.email,
    });
    layout.value = false;
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
  }
};

const ShoppingList = async () => {
  try {
    const response = await api.get<Products[]>("/shopping/");
    const products = response.data;
    shoppingList.value = products.length;
  } catch {
    error("Erro ao carregar dados da Lista de Produtos");
  }
};
onMounted(() => {
  void ShoppingList();
});
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
