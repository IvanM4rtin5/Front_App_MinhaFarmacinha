<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-left">
        <div
          class="text-h5 text-primary q-mb-sm"
          style="font-weight: bold; font-size: 27px"
        >
          SEJA BEM-VINDO
        </div>
        <div
          class="text-subtitle2 q-mb-lg"
          style="color: var(--gray-dark); font-size: 15px"
        >
          Identifique-se Por favor para acessar a
          <strong>Minha Farmacinha</strong>
        </div>
        <form @submit.prevent="handleLogin">
          <q-input
            v-model="username"
            label="Usuário"
            outlined
            dense
            class="q-mb-md"
            color="blue"
            autocomplete="username"
          />

          <q-input
            v-model="password"
            label="Senha"
            type="password"
            autocomplete="current-password"
            outlined
            dense
            class="q-mb-lg"
            color="blue"
          />

          <div class="row q-gutter-sm">
            <q-btn
              label="Entrar"
              type="submit"
              color="primary"
              @click="handleLogin"
            />
            <q-btn label="Cancelar" color="negative" class="q-ml-lg" />
          </div>
          <div class="text-center q-mt-md">
            <span class="text-grey-7">Não tem uma conta? </span>
            <router-link
              to="/signup"
              class="text-primary text-weight-medium"
              style="text-decoration: none"
            >
              Cadastre-se
            </router-link>
          </div>
        </form>
      </div>
      <div class="login-right">
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
import { useAuthStore } from "../stores/auth";
import { useNotify } from "src/composables/useNotify";

const username = ref("");
const password = ref("");
const router = useRouter();
const loginError = ref(false);
const authStore = useAuthStore();
const { success, error } = useNotify();

const handleLogin = async () => {
  console.log(username.value, password.value);
  try {
    const user = await authStore.login(username.value, password.value);
    if (user) {
      loginError.value = false;
      success("Login realizado com sucesso!");
      await router.push("/app/home");
    } else {
      loginError.value = true;
      error("Usuário ou senha incorretos");
    }
  } catch (err) {
    loginError.value = true;
    error("Erro ao realizar login. Por favor Tente novamente.");
    console.error("Erro no login:", err);
  }
};
</script>

<style scoped>
.login-page {
  background: var(--blue-light);
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-container {
  display: flex;
  width: 700px;
  border-radius: 50px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  background: var(--white);
}

.login-left,
.login-right {
  width: 50%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.login-left {
  background: var(--white);
}

input {
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 1px solid var(--gray-light);
  border-radius: 8px;
}

.login-right {
  background: linear-gradient(135deg, var(--blue) 0%, var(--blue-dark) 100%);
  align-items: center;
  justify-content: center;
}

.login-right img {
  max-width: 80%;
}
</style>
