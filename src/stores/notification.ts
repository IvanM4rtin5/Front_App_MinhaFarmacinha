import { defineStore } from "pinia";
import { ref } from "vue";
import { api } from "src/boot/axios";
import type { Notification } from "src/types/Notification/notification";

export const useNotificationStore = defineStore("notifications", () => {
  const notifications = ref<Notification[]>([]);
  const loading = ref(false);

  async function fetchNotifications() {
    loading.value = true;
    try {
      const response = await api.get("/notification/", {
        params: { limit: 100 },
      });
      notifications.value = response.data;
    } finally {
      loading.value = false;
    }
  }

  async function deleteNotification(notificationId: number) {
    await api.delete(`/notification/${notificationId}`);
    await fetchNotifications();
  }

  return { notifications, loading, fetchNotifications, deleteNotification };
});
