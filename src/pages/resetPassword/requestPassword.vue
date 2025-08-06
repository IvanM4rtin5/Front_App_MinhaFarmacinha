<template>
  <div class="reset-password-page">
    <template v-if="isMobile">
      <div class="reset-password-card">
        <div class="reset-password-blue-bg top"></div>
        <img
          src="../../assets/image/favicon-96x96.png"
          alt="Logo Minha Farmacinha"
          class="logo-img"
        />
        <div class="reset-password-form-content">
          <div
            class="text-h5 text-primary q-mb-sm text-center"
            style="font-weight: bold; font-size: 22px"
          >
            RECUPERAR SENHA
          </div>
          <div
            class="text-subtitle2 q-mb-lg text-center"
            style="color: var(--gray-dark); font-size: 14px"
          >
            Digite o e-mail cadastrado para receber um link de recuperação de
            senha
          </div>
          <form @submit.prevent="handleRequestPassword">
            <q-input
              v-model="email"
              label="E-mail"
              type="email"
              outlined
              dense
              class="q-mb-lg"
              color="blue"
              autocomplete="email"
              :error="!!emailError"
              :error-message="emailError"
              @blur="validateEmail"
            />

            <div class="row q-gutter-sm">
              <q-btn
                label="Enviar Link"
                type="submit"
                color="primary"
                :loading="isLoading"
                :disabled="isRequestDisabled"
                class="full-width"
              />
              <q-btn
                label="Voltar"
                color="negative"
                class="full-width q-mt-sm"
                @click="goBack"
              />
            </div>
          </form>
        </div>
        <div class="reset-password-blue-bg bottom"></div>
      </div>
    </template>
    <template v-else>
      <div class="reset-password-container">
        <div class="reset-password-left">
          <div
            class="text-h5 text-primary q-mb-sm text-center"
            style="font-weight: bold; font-size: 27px"
          >
            RECUPERAR SENHA
          </div>
          <div
            class="text-subtitle2 q-mb-lg text-center"
            style="color: var(--gray-dark); font-size: 15px"
          >
            Digite o e-mail cadastrado para receber um link de recuperação de
            senha
          </div>
          <form @submit.prevent="handleRequestPassword">
            <q-input
              v-model="email"
              label="E-mail"
              type="email"
              outlined
              dense
              class="q-mb-lg"
              color="blue"
              autocomplete="email"
              :error="!!emailError"
              :error-message="emailError"
              @blur="validateEmail"
            />

            <div class="row q-gutter-sm">
              <q-btn
                label="Enviar Link"
                type="submit"
                color="primary"
                :loading="isLoading"
                :disabled="isRequestDisabled"
              />
              <q-btn label="Voltar" color="negative" @click="goBack" />
            </div>
            <div class="text-center q-mt-md q-mb-lg">
              <span class="text-grey-7"
                >Lembrou sua senha?
                <router-link
                  to="/"
                  class="text-primary text-weight-medium"
                  style="text-decoration: none"
                  >Faça login</router-link
                ></span
              >
            </div>
          </form>
        </div>
        <div class="reset-password-right">
          <img
            src="../../assets/image/logo-farmacinha.png"
            alt="Logo Minha Farmacinha"
            class="reset-password-logo"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import {
  passwordResetService,
  getErrorMessage,
} from "../../services/passwordReset";

const $q = useQuasar();
const router = useRouter();

const email = ref("");
const emailError = ref("");
const isLoading = ref(false);

const isMobile = computed(() => $q.screen.lt.md);

const isRequestDisabled = computed(() => {
  return !email.value || !!emailError.value || isLoading.value;
});

const validateEmail = () => {
  emailError.value = "";

  if (!email.value) {
    emailError.value = "E-mail é obrigatório";
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    emailError.value = "Digite um e-mail válido";
    return;
  }
};

const handleRequestPassword = async () => {
  validateEmail();

  if (emailError.value) {
    return;
  }

  isLoading.value = true;

  try {
    await passwordResetService.requestReset({ email: email.value });

    $q.notify({
      type: "positive",
      message: "E-mail de recuperação enviado com sucesso!",
      position: "top",
      timeout: 3000,
    });
  } catch (error: unknown) {
    const message = getErrorMessage(error);

    $q.notify({
      type: "negative",
      message: message,
      position: "top",
      timeout: 3000,
    });
  } finally {
    isLoading.value = false;
  }
};

const goBack = () => {
  void router.push("/");
};
</script>

<style scoped>
.reset-password-page {
  min-height: 100vh;
  background: var(--blue-light);
}

/* Mobile Styles */
.reset-password-card {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.reset-password-blue-bg {
  position: absolute;
  width: 100%;
  height: 200px;
  background: var(--blue);
  border-radius: 0 0 50% 50%;
}

.reset-password-blue-bg.top {
  top: 0;
}

.reset-password-blue-bg.bottom {
  bottom: 0;
  border-radius: 50% 50% 0 0;
}

.logo-img {
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
  z-index: 1;
  position: relative;
}

.reset-password-form-content {
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  z-index: 1;
  position: relative;
}

/* Desktop Styles */
.reset-password-container {
  display: flex;
  min-height: 100vh;
}

.reset-password-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  background: white;
}

.reset-password-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--blue);
  padding: 40px;
}

.reset-password-logo {
  max-width: 300px;
  height: auto;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .reset-password-form-content {
    padding: 20px;
    margin: 0 10px;
  }

  /* .logo-img {
    width: 60px;
    height: 60px;
  } */
  .logo-img {
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin: 32px 0 12px 0;
  z-index: 2;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: relative;
}
}
</style>
