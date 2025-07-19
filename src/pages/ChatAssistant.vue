<template>
  <q-page padding>
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md-6">
        <h5 class="text-primary">
          Minha Farmacinha <q-icon name="chevron_right" /> Farmacinha Responde !
        </h5>
        <p class="text-grey-7">Tire aqui suas duvidas sobre medicamentos</p>
      </div>
      <div class="col-12 col-md-6">
        <InfoPopover class="popover-responsive">
          <p>
            Converse com o assistente virtual para tirar dúvidas sobre
            medicamentos, uso correto, horários e outras informações importantes
            para sua saúde.
          </p>
          <ul style="margin: 0; padding-left: 18px">
            <li>Solicite orientações sobre horários e dosagens</li>
            <li>Peça dicas para organização da sua farmacinha</li>
            <li>Receba respostas rápidas e confiáveis</li>
          </ul>
        </InfoPopover>
      </div>
    </div>
    <h3 class="text-center gradient-text">Bem - vindo</h3>
    <div class="chat-container">
      <div class="chat-messages">
        <q-chat-message
          v-for="(msg, idx) in messages"
          :key="idx"
          :text="[msg.text]"
          :sent="msg.sent"
          :name="msg.name"
          :avatar="msg.avatar"
          :stamp="msg.stamp"
        />
      </div>
      <div class="chat-input">
        <q-input
          v-model="userInput"
          @keyup.enter="sendMessage"
          label="Digite sua dúvida..."
          outlined
          dense
          class="full-width"
        >
          <template #append>
            <q-btn flat icon="send" @click="sendMessage" />
          </template>
        </q-input>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "src/stores/auth";
import { storeToRefs } from "pinia";
import logoFarmacinha from "src/assets/image/favicon-96x96.png";
import avatarDefault from "src/assets/image/avatarDefault.png";
import InfoPopover from "src/components/InfoPopover.vue";

const authStore = useAuthStore();
const { name, avatarUrl } = storeToRefs(authStore);

const userInput = ref("");
const messages = ref([
  {
    text: "Olá! Sou seu assistente da Farmacinha. Como posso ajudar?",
    sent: false,
    name: "Farmacinha IA",
    avatar: logoFarmacinha,
    icon: "person",
    stamp: new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  },
]);

function sendMessage() {
  if (!userInput.value.trim()) return;

  const nomeFormatado = name.value
    ? name.value
        .split(" ")
        .map((n) => n.charAt(0).toUpperCase() + n.slice(1).toLowerCase())
        .join(" ")
    : "Você";

  const hasAvatar = !!avatarUrl.value;

  const msg = {
    text: userInput.value,
    sent: true,
    name: nomeFormatado,
    avatar: hasAvatar ? avatarUrl.value : avatarDefault,
    icon: "person",
    stamp: new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  messages.value.push(msg);

  setTimeout(() => {
    messages.value.push({
      text: "Recebi sua dúvida! Em breve responderei com informações sobre o assunto.",
      sent: false,
      name: "Farmacinha IA",
      avatar: logoFarmacinha,
      icon: "",
      stamp: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
  }, 1200);

  userInput.value = "";
}
</script>

<style scoped>
.chat-container {
  max-width: 600px;
  margin: 20px auto 0 auto;
  display: flex;
  flex-direction: column;
  height: 60vh;
  background: linear-gradient(135deg, var(--blue-light) 0%, var(--blue) 150%);
  border: 1px solid var(--green-light);
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 16px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 12px;
  padding-right: 4px;
}

.chat-input {
  display: flex;
  align-items: center;
}
.gradient-text {
  background: linear-gradient(
    135deg,
    var(--blue-dark) 0%,
    var(--gray-dark) 120%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
}
</style>
