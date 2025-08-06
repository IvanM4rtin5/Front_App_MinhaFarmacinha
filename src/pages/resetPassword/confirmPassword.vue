<template>
  <div class="confirm-password-page">
    <template v-if="isMobile">
      <div class="confirm-password-card">
        <div class="confirm-password-blue-bg top"></div>
        <img
          src="../../assets/image/favicon-96x96.png"
          alt="Logo Minha Farmacinha"
          class="logo-img rounded-borders"
        />
        <div class="confirm-password-form-content">
          <div
            class="text-h5 text-primary q-mb-sm text-center"
            style="font-weight: bold; font-size: 22px"
          >
            {{ isTokenValid ? "REDEFINIR SENHA" : "VERIFICANDO TOKEN" }}
          </div>
          <div
            class="text-subtitle2 q-mb-lg text-center"
            style="color: var(--gray-dark); font-size: 14px"
          >
            {{
              isTokenValid
                ? "Digite sua nova senha"
                : "Verificando o link de recuperação..."
            }}
          </div>

          <!-- Loading state -->
          <div v-if="isLoading && !isTokenValid" class="text-center q-mb-lg">
            <q-spinner-dots size="50px" color="primary" />
            <p class="text-grey-7 q-mt-md">
              Verificando o link de recuperação...
            </p>
          </div>

          <!-- Error state -->
          <div
            v-else-if="!isTokenValid && !isLoading"
            class="text-center q-mb-lg"
          >
            <q-icon name="error" size="80px" color="negative" class="q-mb-md" />
            <p class="text-grey-7">
              Link inválido ou expirado. Solicite um novo link de recuperação.
            </p>
          </div>

          <!-- Form for password reset -->
          <form v-if="isTokenValid" @submit.prevent="handlePasswordReset">
            <q-input
              v-model="newPassword"
              label="Nova Senha"
              :type="isPwd ? 'password' : 'text'"
              outlined
              dense
              class="q-mb-sm"
              color="blue"
              :error="!!passwordError"
              :error-message="passwordError"
              @blur="validatePassword"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>

            <q-input
              v-model="confirmPassword"
              label="Confirmar Nova Senha"
              :type="isPwdConfirm ? 'password' : 'text'"
              outlined
              dense
              class="q-mb-lg"
              color="blue"
              :error="!!confirmPasswordError"
              :error-message="confirmPasswordError"
              @blur="validateConfirmPassword"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwdConfirm ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwdConfirm = !isPwdConfirm"
                />
              </template>
            </q-input>

            <div class="row q-gutter-sm">
              <q-btn
                label="Redefinir Senha"
                type="submit"
                color="primary"
                :loading="isResetting"
                :disabled="isResetDisabled"
                class="full-width"
              />
              <q-btn
                label="Voltar ao Login"
                color="negative"
                class="full-width q-mt-sm"
                @click="goToLogin"
              />
            </div>
          </form>

          <!-- Success state -->
          <div v-else-if="isSuccess" class="text-center q-mb-lg">
            <q-icon
              name="check_circle"
              size="80px"
              color="positive"
              class="q-mb-md"
            />
            <p class="text-grey-7">
              Senha redefinida com sucesso! Você será redirecionado para o
              login.
            </p>
          </div>

          <div class="text-center q-mt-md q-mb-lg">
            <span class="text-grey-7">Lembrou sua senha? </span>
            <router-link
              to="/"
              class="text-primary text-weight-medium"
              style="text-decoration: none"
            >
              Faça login
            </router-link>
          </div>
        </div>
        <div class="confirm-password-blue-bg bottom"></div>
      </div>
    </template>
    <template v-else>
      <div class="confirm-password-container">
        <div class="confirm-password-left">
          <div
            class="text-h5 text-primary q-mb-sm text-center"
            style="font-weight: bold; font-size: 27px"
          >
            {{ isTokenValid ? "REDEFINIR SENHA" : "VERIFICANDO TOKEN" }}
          </div>
          <div
            class="text-subtitle2 q-mb-lg text-center"
            style="color: var(--gray-dark); font-size: 15px"
          >
            {{
              isTokenValid
                ? "Digite sua nova senha"
                : "Verificando o link de recuperação..."
            }}
          </div>

          <!-- Loading state -->
          <div v-if="isLoading && !isTokenValid" class="text-center q-mb-lg">
            <q-spinner-dots size="80px" color="primary" />
            <p class="text-grey-7 q-mt-md">
              Verificando o link de recuperação...
            </p>
          </div>

          <!-- Error state -->
          <div
            v-else-if="!isTokenValid && !isLoading"
            class="text-center q-mb-lg"
          >
            <q-icon
              name="error"
              size="100px"
              color="negative"
              class="q-mb-md"
            />
            <p class="text-grey-7">
              Link inválido ou expirado. Solicite um novo link de recuperação.
            </p>
          </div>

          <!-- Form for password reset -->
          <form v-if="isTokenValid" @submit.prevent="handlePasswordReset">
            <q-input
              v-model="newPassword"
              label="Nova Senha"
              :type="isPwd ? 'password' : 'text'"
              outlined
              dense
              class="q-mb-sm"
              color="blue"
              :error="!!passwordError"
              :error-message="passwordError"
              @blur="validatePassword"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>

            <q-input
              v-model="confirmPassword"
              label="Confirmar Nova Senha"
              :type="isPwdConfirm ? 'password' : 'text'"
              outlined
              dense
              class="q-mb-lg"
              color="blue"
              :error="!!confirmPasswordError"
              :error-message="confirmPasswordError"
              @blur="validateConfirmPassword"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwdConfirm ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwdConfirm = !isPwdConfirm"
                />
              </template>
            </q-input>

            <div class="row q-gutter-sm">
              <q-btn
                label="Redefinir Senha"
                type="submit"
                color="primary"
                :loading="isResetting"
                :disabled="isResetDisabled"
              />
              <q-btn
                label="Voltar ao Login"
                color="negative"
                @click="goToLogin"
              />
            </div>
          </form>

          <!-- Success state -->
          <div v-else-if="isSuccess" class="text-center q-mb-lg">
            <q-icon
              name="check_circle"
              size="100px"
              color="positive"
              class="q-mb-md"
            />
            <p class="text-grey-7">
              Senha redefinida com sucesso! Você será redirecionado para o
              login.
            </p>
          </div>

          <div class="text-center q-mt-md q-mb-lg">
            <span class="text-grey-7">Lembrou sua senha? </span>
            <router-link
              to="/"
              class="text-primary text-weight-medium"
              style="text-decoration: none"
            >
              Faça login
            </router-link>
          </div>
        </div>
        <div class="confirm-password-right">
          <img
            src="../../assets/image/logo-farmacinha.png"
            alt="Logo Minha Farmacinha"
            class="confirm-password-logo"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useRouter, useRoute } from "vue-router";
import {
  passwordResetService,
  getErrorMessage,
} from "../../services/passwordReset";

const $q = useQuasar();
const router = useRouter();
const route = useRoute();

const isLoading = ref(false);
const isResetting = ref(false);
const isTokenValid = ref(false);
const isSuccess = ref(false);
const newPassword = ref("");
const confirmPassword = ref("");
const isPwd = ref(true);
const isPwdConfirm = ref(true);
const passwordError = ref("");
const confirmPasswordError = ref("");

const isMobile = computed(() => $q.screen.lt.md);

const isResetDisabled = computed(() => {
  return (
    !newPassword.value ||
    !confirmPassword.value ||
    !!passwordError.value ||
    !!confirmPasswordError.value ||
    isResetting.value
  );
});

const validatePassword = () => {
  passwordError.value = "";

  if (!newPassword.value) {
    passwordError.value = "Nova senha é obrigatória";
    return;
  }

  if (newPassword.value.length < 6) {
    passwordError.value = "A senha deve ter pelo menos 6 caracteres";
    return;
  }
};

const validateConfirmPassword = () => {
  confirmPasswordError.value = "";

  if (!confirmPassword.value) {
    confirmPasswordError.value = "Confirmação de senha é obrigatória";
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    confirmPasswordError.value = "As senhas não coincidem";
    return;
  }
};

const verifyToken = async () => {
  let token = route.query.token as string;

  if (!token) {
    token = route.params.token as string;
  }

  if (!token) {
    isTokenValid.value = false;
    return;
  }

  isLoading.value = true;

  try {
    const response = await passwordResetService.verifyToken(token);

    if (response.valid) {
      isTokenValid.value = true;
      $q.notify({
        type: "positive",
        message: "Token válido! Digite sua nova senha.",
        position: "top",
        timeout: 3000,
      });
    } else {
      isTokenValid.value = false;
    }
  } catch {
    isTokenValid.value = false;
    $q.notify({
      type: "negative",
      message: "Token inválido ou expirado.",
      position: "top",
      timeout: 3000,
    });
  } finally {
    isLoading.value = false;
  }
};

const handlePasswordReset = async () => {
  validatePassword();
  validateConfirmPassword();

  if (passwordError.value || confirmPasswordError.value) {
    return;
  }

  let token = route.query.token as string;

  if (!token) {
    token = route.params.token as string;
  }

  isResetting.value = true;

  try {
    await passwordResetService.confirmReset({
      token: token,
      new_password: newPassword.value,
    });

    isSuccess.value = true;

    $q.notify({
      type: "positive",
      message: "Senha redefinida com sucesso!",
      position: "top",
      timeout: 3000,
    });

    setTimeout(() => {
      void router.push("/");
    }, 2000);
  } catch (error: unknown) {
    const message = getErrorMessage(error);

    $q.notify({
      type: "negative",
      message: message,
      position: "top",
      timeout: 3000,
    });
  } finally {
    isResetting.value = false;
  }
};

const goToLogin = () => {
  void router.push("/");
};

onMounted(() => {
  void verifyToken();
});
</script>

<style scoped>
.confirm-password-page {
  min-height: 100vh;
  background: var(--blue-light);
}

/* Mobile Styles */
.confirm-password-card {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.confirm-password-blue-bg {
  position: absolute;
  width: 100%;
  height: 200px;
  background: var(--blue);
  border-radius: 0 0 50% 50%;
}

.confirm-password-blue-bg.top {
  top: 0;
}

.confirm-password-blue-bg.bottom {
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

.confirm-password-form-content {
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
.confirm-password-container {
  display: flex;
  min-height: 100vh;
}

.confirm-password-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  background: white;
}

.confirm-password-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--blue);
  padding: 40px;
}

.confirm-password-logo {
  max-width: 300px;
  height: auto;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .confirm-password-form-content {
    padding: 20px;
    margin: 0 10px;
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
}
</style>
