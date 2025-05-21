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
          <!-- Nome -->
          <q-input
            v-model="name"
            label="Nome Completo"
            outlined
            dense
            class="q-mb-md"
            color="blue"
            :input-style="{ fontSize: '16px' }"
          />

          <!-- Data de nascimento -->
          <q-input
            v-model="date"
            type="date"
            outlined
            dense
            class="q-mb-md"
            color="blue"
            :input-style="{ fontSize: '16px' }"
          >
            <q-tooltip>Selecione sua data de nascimento.</q-tooltip>
          </q-input>

          <!-- Email -->
          <q-input
            v-model="email"
            label="E-mail"
            type="email"
            outlined
            dense
            class="q-mb-md"
            color="blue"
            :input-style="{ fontSize: '16px' }"
          />

          <!-- Senha -->
          <q-input
            v-model="password"
            label="Senha"
            type="password"
            outlined
            dense
            class="q-mb-md"
            color="blue"
            :input-style="{ fontSize: '16px' }"
          />


          <!-- Confirmar senha -->
          <q-input
            v-model="confirmPassword"
            label="Confirmar Senha"
            type="password"
            outlined
            dense
            class="q-mb-lg"
            color="blue"
            :input-style="{ fontSize: '16px' }"
          />

          <div class="row q-gutter-sm buttons-container">
            <q-btn
              label="Cadastrar"
              type="submit"
              color="primary"
              class="action-button"
            />
            <q-btn
              label="Cancelar"
              color="negative"
              class="action-button"
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
const date = ref("");
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

  if (!name.value || !date.value || !email.value || !password.value) {
    error("Por favor, preencha todos os campos!");
    return;
  }

  // Validação do formato da data dd/mm/aaaa
  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!dateRegex.test(date.value)) {
    error("Data de nascimento inválida! Use o formato dd/mm/aaaa.");
    return;
  }

  try {
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
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

.signup-container {
  display: flex;
  width: 700px;
  max-width: 100%;
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

.buttons-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: flex-start;
  margin-top: 1rem;
}

.action-button {
  min-width: 120px;
}

@media (max-width: 600px) {
  .signup-container {
    width: 100%;
    flex-direction: column;
    border-radius: 25px;
  }

  .signup-left,
  .signup-right {
    width: 100%;
    padding: 1.5rem;
  }

  .buttons-container {
    justify-content: center;
  }
}


</style>
