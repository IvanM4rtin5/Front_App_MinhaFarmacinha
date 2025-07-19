<template>
  <div class="signup-page">
      <template v-if="isMobile">
        <div class="signup-card">
          <div class="signup-blue-bg top"></div>
          <img
            src="../assets/image/favicon-96x96.png"
            alt="Logo Minha Farmacinha"
            class="logo-img"
          />
          <div class="signup-form-content">
            <div
              class="text-h5 text-primary q-mb-sm text-center"
              style="font-weight: bold; font-size: 22px;"
            >
              CRIAR CONTA
            </div>
            <div
              class="text-subtitle2 q-mb-lg text-center"
              style="color: var(--gray-dark); font-size: 14px"
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
                label="Data de Nascimento"
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
          <div class="signup-blue-bg bottom"></div>
        </div>
      </template>
      <template v-else>
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
      </template>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { api } from "src/boot/axios";
import { useRouter } from "vue-router";
import { useNotify } from "src/composables/useNotify";

const name = ref("");
const date = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const loading = ref(false);
const router = useRouter();
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

const handleSignUp = async () => {
  if (loading.value) return;
  loading.value = true;

  if (password.value !== confirmPassword.value) {
    error("As senhas não coincidem!");
    loading.value = false;
    return;
  }

  if (!name.value || !date.value || !email.value || !password.value) {
    error("Por favor, preencha todos os campos!");
    loading.value = false;
    return;
  }

  // Email validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email.value)) {
    error("Por favor, insira um email válido!");
    return;
  }

  //  YYYY-MM-DD date format validation
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date.value)) {
    error("Data de nascimento inválida!");
    return;
  }

  const user = {
    username: name.value,
    email: email.value,
    password: password.value,
    birth_date: date.value,
  };

  try {
    await api.post("/auth/register", user);
    success("Usuário cadastrado com sucesso!");
    await router.push("/");
  } catch (e: unknown) {
    const err = e as {
      response?: { data?: { detail?: string; message?: string } };
    };
    if (err.response && err.response.data) {
      error(
        err.response.data.detail ||
          err.response.data.message ||
          "Erro ao realizar cadastro. Tente novamente."
      );
    } else {
      error("Erro ao realizar cadastro. Tente novamente.");
    }
  } finally {
    loading.value = false;
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

.row.q-gutter-sm,
.buttons-container {
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

@media (max-width: 700px) {
  .signup-card {
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

  .signup-blue-bg {
    width: 100%;
    height: 60px;
    background: linear-gradient(135deg, var(--blue) 0%, var(--blue-dark) 100%);
    position: absolute;
    left: 0;
    z-index: 1;
  }
  .signup-blue-bg.top {
    top: 0;
    border-radius: 25px 25px 0 0;
  }
  .signup-blue-bg.bottom {
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

  .signup-form-content {
    width: 100%;
    padding: 0 24px;
    z-index: 2;
    margin-bottom: 16px;
    margin-top: 8px;
  }
}
</style>
