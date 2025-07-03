<template>
  <q-btn
    flat
    round
    dense
    icon="notifications"
    class="q-ml-md"
    @click="loadNotifications"
  >
    <q-badge color="red" floating v-if="unreadCount > 0">{{
      unreadCount
    }}</q-badge>

    <q-menu>
      <q-list style="min-width: 350px">
        <q-item-label header>
          <h6 class="text-primary text-center">Notificações</h6>
        </q-item-label>

        <q-separator />

        <div v-if="loading" class="q-pa-md text-center">
          <q-spinner color="primary" />
          <div class="q-mt-sm">Carregando...</div>
        </div>

        <div
          v-else-if="notifications.length === 0"
          class="q-pa-md text-center text-grey"
        >
          Nenhuma notificação
        </div>

        <q-item
          v-else
          v-for="notification in notifications"
          :key="notification.id"
          clickable
          v-ripple
          @click="
            markAsRead(notification.id);
            emitNotification(notification);
          "
          :class="{ 'bg-grey-1': notification.status === 'READ' }"
        >
          <q-item-section avatar>
            <q-icon
              :name="getNotificationIcon(notification.notification_type)"
              :color="getNotificationColor(notification.notification_type)"
            />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ notification.title }}</q-item-label>
            <q-item-label caption>{{ notification.message }}</q-item-label>
            <q-item-label caption v-if="notification.medication_name">
              Medicamento: {{ notification.medication_name }}
            </q-item-label>
            <q-item-label caption v-if="notification.medication_dosage">
              Dosagem: {{ notification.medication_dosage }}
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-item-label caption>{{
              formatTime(notification.created_at)
            }}</q-item-label>
            <q-icon
              v-if="notification.status !== 'READ'"
              name="fiber_manual_record"
              color="primary"
              size="xs"
            />
            <q-btn
              flat
              round
              dense
              icon="delete"
              color="negative"
              @click.stop="deleteNotification(notification.id)"
              size="sm"
            />
          </q-item-section>
        </q-item>

        <q-separator />

        <q-item clickable v-ripple @click="markAllAsRead">
          <q-item-section class="text-center text-primary">
            Marcar todas como lidas
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="refreshNotifications">
          <q-item-section class="text-center text-primary">
            Atualizar
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from "vue";
import { useQuasar } from "quasar";
import { api } from "../../boot/axios";
import type { Notification } from "../../types/notification";

export default defineComponent({
  name: "NotificationsDropdown",
  emits: ["abrirMensagem"],

  setup(props, { emit }) {
    const $q = useQuasar();
    const notifications = ref<Notification[]>([]);
    const unreadCount = ref(0);
    const loading = ref(false);
    let websocket: WebSocket | null = null;

    const getNotificationIcon = (type: string): string => {
      const icons = {
        medication_reminder: "schedule",
        low_stock_alert: "warning",
        medication_expiry: "event_busy",
        refill_reminder: "shopping_cart",
        general: "info",
      };
      return icons[type as keyof typeof icons] || "notifications";
    };

    const getNotificationColor = (type: string): string => {
      const colors = {
        medication_reminder: "primary",
        low_stock_alert: "warning",
        medication_expiry: "negative",
        refill_reminder: "orange",
        general: "info",
      };
      return colors[type as keyof typeof colors] || "grey";
    };

    const formatTime = (dateString: string): string => {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return "Agora";
      if (diffMins < 60) return `${diffMins} min atrás`;
      if (diffHours < 24)
        return `${diffHours} hora${diffHours > 1 ? "s" : ""} atrás`;
      if (diffDays < 7)
        return `${diffDays} dia${diffDays > 1 ? "s" : ""} atrás`;

      return date.toLocaleDateString("pt-BR");
    };

    const loadNotifications = async () => {
      try {
        loading.value = true;
        const response = await api.get("/notification/", {
          params: { limit: 100 },
        });

        notifications.value = response.data;
        updateUnreadCount();
      } catch (error: unknown) {
        console.error("Erro ao carregar notificações:", error);

        if (
          typeof error === "object" &&
          error !== null &&
          "response" in error
        ) {
          const axiosError = error as { response?: { status?: number } };
          if (axiosError.response?.status === 401) {
            console.log("Token expirado");
          }
        }

        $q.notify({
          type: "negative",
          message: "Erro ao carregar notificações",
        });
      } finally {
        loading.value = false;
      }
    };

    const loadUnreadCount = async () => {
      try {
        const response = await api.get("/notification/unread/count");
        unreadCount.value = response.data.unread_count;
      } catch (error: unknown) {
        console.error("Erro ao carregar contador:", error);
        if (
          typeof error === "object" &&
          error !== null &&
          "response" in error
        ) {
          const axiosError = error as { response?: { status?: number } };
          if (axiosError.response?.status === 401) {
            console.log("Token expirado");
          }
        }
      }
    };

    const markAsRead = async (notificationId: number) => {
      try {
        await api.patch(`/notification/${notificationId}/read`);

        const notification = notifications.value.find(
          (n) => n.id === notificationId
        );
        if (notification) {
          notification.status = "READ";
        }
        updateUnreadCount();
      } catch (error: unknown) {
        console.error("Erro ao marcar como lida:", error);
        if (
          typeof error === "object" &&
          error !== null &&
          "response" in error
        ) {
          const axiosError = error as { response?: { status?: number } };
          if (axiosError.response?.status === 401) {
            $q.notify({
              type: "negative",
              message: "Token expirado. Faça login novamente.",
            });
          }
        }
      }
    };

    const markAllAsRead = async () => {
      try {
        await api.post("/notification/mark-all-read");

        notifications.value.forEach((n) => (n.status = "READ"));
        updateUnreadCount();
        $q.notify({
          type: "positive",
          message: "Todas as notificações foram marcadas como lidas",
        });
      } catch (error: unknown) {
        console.error("Erro ao marcar todas como lidas:", error);
        if (
          typeof error === "object" &&
          error !== null &&
          "response" in error
        ) {
          const axiosError = error as { response?: { status?: number } };
          if (axiosError.response?.status === 401) {
            $q.notify({
              type: "negative",
              message: "Token expirado. Faça login novamente.",
            });
          }
        }

        $q.notify({
          type: "negative",
          message: "Erro ao marcar notificações como lidas",
        });
      }
    };

    const refreshNotifications = () => {
      void loadNotifications();
      void loadUnreadCount();
    };

    const updateUnreadCount = () => {
      unreadCount.value = notifications.value.filter(
        (n) => n.status !== "READ"
      ).length;
    };

    const connectWebSocket = () => {
      const userStr = localStorage.getItem("user");
      let userId = null;
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          userId = user && user.id ? user.id : null;
        } catch {
          userId = null;
        }
      }
      const token = localStorage.getItem("token");
      if (!userId || !token) {
        // console.warn("WebSocket não conectado: user_id ou token ausente");
        return;
      }
      const wsUrl = `ws://localhost:8000/api/v1/notification/ws/${userId}?token=${token}`;
      websocket = new WebSocket(wsUrl);

      websocket.onopen = () => {
        // console.log("WebSocket conectado para notificações");
      };

      websocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "new_notification") {
            notifications.value.unshift(data.notification);
            updateUnreadCount();

            $q.notify({
              type: "positive",
              message: data.notification.title,
              caption: data.notification.message,
              icon: getNotificationIcon(data.notification.notification_type),
              color: getNotificationColor(data.notification.notification_type),
            });
          }
        } catch (error) {
          console.error("Erro ao processar mensagem WebSocket:", error);
        }
      };

      websocket.onerror = (error) => {
        console.error("Erro no WebSocket:", error);
      };

      websocket.onclose = () => {
        // console.log("WebSocket desconectado");
        setTimeout(connectWebSocket, 5000);
      };
    };

    function emitNotification(notification: Notification) {
      emit("abrirMensagem", notification);
    }

    const deleteNotification = async (notificationId: number) => {
      try {
        await api.delete(`/notification/${notificationId}`);
        notifications.value = notifications.value.filter(
          (n) => n.id !== notificationId
        );
        $q.notify({
          type: "positive",
          message: "Notificação deletada com sucesso",
        });
        updateUnreadCount();
      } catch {
        $q.notify({
          type: "negative",
          message: "Erro ao deletar notificação",
        });
      }
    };

    // Lifecycle
    onMounted(() => {
      void loadNotifications();
      void loadUnreadCount();
      connectWebSocket();
    });

    onUnmounted(() => {
      if (websocket) {
        websocket.close();
      }
    });

    return {
      notifications,
      unreadCount,
      loading,
      getNotificationIcon,
      getNotificationColor,
      formatTime,
      loadNotifications,
      markAsRead,
      markAllAsRead,
      refreshNotifications,
      emitNotification,
      deleteNotification,
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
