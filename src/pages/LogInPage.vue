<template>
  <div class="login-page">
    <template v-if="isMobile">
      <div class="login-card">
        <div class="login-blue-bg top"></div>
        <img
          src="../assets/image/favicon-96x96.png"
          alt="Logo Minha Farmacinha"
          class="logo-img"
        />
        <div class="login-form-content">
          <div
            class="text-h5 text-primary q-mb-sm text-center"
            style="font-weight: bold; font-size: 22px"
          >
            SEJA BEM-VINDO
          </div>
          <div
            class="text-subtitle2 q-mb-lg text-center"
            style="color: var(--gray-dark); font-size: 14px"
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
              />
              <q-btn label="Cancelar" color="negative" class="q-ml-lg" />
            </div>
            <div class="text-center q-mt-md q-mb-lg">
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
        <div class="login-blue-bg bottom"></div>
      </div>
    </template>
    <template v-else>
      <div class="login-container">
        <div class="login-left">
          <div
            class="text-h5 text-primary q-mb-sm text-center"
            style="font-weight: bold; font-size: 27px"
          >
            SEJA BEM-VINDO
          </div>
          <div
            class="text-subtitle2 q-mb-lg text-center"
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
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useNotify } from "src/composables/useNotify";

const username = ref("");
const password = ref("");
const router = useRouter();
const loginError = ref(false);
const authStore = useAuthStore();
const { success, error } = useNotify();

const isMobile = ref(window.innerWidth <= 700);

const handleResize = () => {
  isMobile.value = window.innerWidth <= 700;
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
});
onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

const handleLogin = async () => {
  // console.log(username.value, password.value);
  try {
    const user = await authStore.login(username.value, password.value);
    // console.log("Resultado do login:", user);
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

.row.q-gutter-sm,
.buttons-container {
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

@media (max-width: 700px) {
  .login-container,
  .signup-container {
    flex-direction: column;
    width: 100%;
    max-width: 95vw;
    border-radius: 25px;
    min-height: unset;
  }

  .login-left,
  .login-right,
  .signup-left,
  .signup-right {
    width: 100%;
    padding: 1.2rem;
    min-height: unset;
  }

  .login-right,
  .signup-right {
    min-height: 120px;
    justify-content: flex-start;
  }

  .logo-img {
    max-width: 100px;
    margin: 0 auto;
  }
}

.login-card {
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  background: var(--white);
  border-radius: 25px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 0 24px 0;
}

.login-blue-bg {
  width: 100%;
  height: 60px;
  background: linear-gradient(135deg, var(--blue) 0%, var(--blue-dark) 100%);
  position: absolute;
  left: 0;
  z-index: 1;
}
.login-blue-bg.top {
  top: 0;
  border-radius: 25px 25px 0 0;
}
.login-blue-bg.bottom {
  bottom: 0;
  border-radius: 0 0 25px 25px;
}

.logo-img {
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin: 32px 0 12px 0;
  z-index: 2;
  background: var(--white);
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: relative;
}

.login-form-content {
  width: 100%;
  padding: 0 24px;
  z-index: 2;
  margin-bottom: 16px;
  margin-top: 8px;
}
</style>
