<template>
  <div class="signup-page">
    <div class="signup-container">
      <div class="signup-left">
        <div
          class="text-h5 text-primary q-mb-sm"
          style="font-weight: bold; font-size: 27px"
        >
          CRIAR CONTA
        </div>
        <div
          class="text-subtitle2 q-mb-lg"
          style="color: var(--gray-dark); font-size: 15px"
        >
          Preencha os dados abaixo para criar sua conta na
          <strong>Minha Farmacinha</strong>
        </div>
        <form @submit.prevent="handleSignUp">
          <q-input
            v-model="name"
            label="Nome Completo"
            outlined
            dense
            class="q-mb-md"
            color="blue"
          />

          <q-input
            v-model="age"
            label="Idade"
            type="number"
            outlined
            dense
            class="q-mb-md"
            color="blue"
          />

          <q-input
            v-model="email"
            label="E-mail"
            type="email"
            outlined
            dense
            class="q-mb-md"
            color="blue"
          />

          <q-input
            v-model="password"
            label="Senha"
            type="password"
            outlined
            dense
            class="q-mb-md"
            color="blue"
          />

          <q-input
            v-model="confirmPassword"
            label="Confirmar Senha"
            type="password"
            outlined
            dense
            class="q-mb-lg"
            color="blue"
          />

          <div class="row q-gutter-sm">
            <q-btn
              label="Cadastrar"
              type="submit"
              color="primary"
              @click="handleSignUp"
            />
            <q-btn
              label="Cancelar"
              color="negative"
              class="q-ml-lg"
              @click="goToLogin"
            />
          </div>
        </form>
      </div>
      <div class="signup-right">
        <img
          src="../assets/image/logo-farmacinha.png"
          alt="Logo Minha Farmacinha"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useNotify } from "src/composables/useNotify";

const name = ref("");
const age = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const router = useRouter();
const { success, error } = useNotify();

const handleSignUp = async () => {
  if (password.value !== confirmPassword.value) {
    error("As senhas não coincidem!");
    return;
  }

  if (!name.value || !age.value || !email.value || !password.value) {
    error("Por favor, preencha todos os campos!");
    return;
  }

  try {
    // Aqui você implementará a lógica de cadastro com sua API
    success("Cadastro realizado com sucesso!");
    await router.push("/");
  } catch {
    error("Erro ao realizar cadastro. Tente novamente.");
  }
};

const goToLogin = async () => {
  await router.push("/");
};
</script>

<style scoped>
.signup-page {
  background: var(--blue-light);
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.signup-container {
  display: flex;
  width: 700px;
  border-radius: 50px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  background: var(--white);
}

.signup-left,
.signup-right {
  width: 50%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.signup-left {
  background: var(--white);
}

input {
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 1px solid var(--gray-light);
  border-radius: 8px;
}

.signup-right {
  background: linear-gradient(135deg, var(--blue) 0%, var(--blue-dark) 100%);
  align-items: center;
  justify-content: center;
}

.signup-right img {
  max-width: 80%;
}
</style>
