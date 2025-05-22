<template>
  <q-btn flat round dense icon="notifications" class="q-ml-md">
    <q-badge color="red" floating v-if="unreadCount > 0">{{
      unreadCount
    }}</q-badge>

    <q-menu>
      <q-list style="min-width: 300px">
        <q-item-label header>Notificações</q-item-label>

        <q-separator />

        <q-item
          v-for="notification in notifications"
          :key="notification.id"
          clickable
          v-ripple
        >
          <q-item-section avatar>
            <q-icon :name="notification.icon" :color="notification.color" />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ notification.title }}</q-item-label>
            <q-item-label caption>{{ notification.message }}</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-item-label caption>{{ notification.time }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator />

        <q-item clickable v-ripple>
          <q-item-section class="text-center text-primary">
            Ver todas as notificações
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

interface Notification {
  id: number;
  title: string;
  message: string;
  icon: string;
  color: string;
  time: string;
  read: boolean;
}

export default defineComponent({
  name: "NotificationsDropdown",

  setup() {
    const notifications = ref<Notification[]>([
      {
        id: 1,
        title: "Medicamento próximo do vencimento",
        message: "Paracetamol vence em 7 dias",
        icon: "warning",
        color: "warning",
        time: "5 min atrás",
        read: false,
      },
      {
        id: 2,
        title: "Lembrete de medicamento",
        message: "Hora de tomar seu remédio",
        icon: "schedule",
        color: "primary",
        time: "1 hora atrás",
        read: false,
      },
    ]);

    const unreadCount = ref(notifications.value.filter((n) => !n.read).length);

    return {
      notifications,
      unreadCount,
    };
  },
});
</script>

<style scoped>
.q-badge {
  font-size: 10px;
  padding: 2px 4px;
}
</style>
