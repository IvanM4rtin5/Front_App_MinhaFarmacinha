<template>
  <vue-cal
    locale="pt-br"
    style="height: 500px"
    :events="events"
    :time="true"
    :view="view"
    @event-click="onEventClick"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";
import { useNotify } from "src/composables/useNotify";
import { api } from "src/boot/axios";
import type { Medicine } from "src/types/Medicine/medicine";
import type { Notification } from "src/types/Notification/notification";
import { useQuasar, Dialog } from "quasar";

interface CalendarEvent {
  start: Date;
  end: Date;
  title: string;
  category: Medicine["category"];
  medicineId: number;
  notificationId: number | null;
  notificationStatus: string | null;
}
const { error } = useNotify();
const $q = useQuasar();
const events = ref<CalendarEvent[]>([]);
const view = ref("day");

onMounted(async () => {
  await reloadCalendarAndNotifications();
});

async function reloadCalendarAndNotifications() {
  try {
    const [medRes, notifRes] = await Promise.all([
      api.get<Medicine[]>("/medication/"),
      api.get("/notification/", { params: { limit: 100 } }),
    ]);
    const medicines = medRes.data;
    const notifications = notifRes.data;

    const today = new Date();

    events.value = medicines.flatMap((med) => {
      if (!med.schedules || !med.days_until_empty) return [];

      return Array.from({ length: med.days_until_empty }, (_, i) => {
        const eventDay = new Date(today);
        eventDay.setDate(today.getDate() + i);

        return (med.schedules || []).map((time) => {
          const [hour, minute] = time.split(":").map(Number);
          const start = new Date(
            eventDay.getFullYear(),
            eventDay.getMonth(),
            eventDay.getDate(),
            hour,
            minute ?? 0
          );
          const end = new Date(
            eventDay.getFullYear(),
            eventDay.getMonth(),
            eventDay.getDate(),
            hour,
            (minute ?? 0) + 30
          );

          const notification = notifications.find(
            (n: Notification) =>
              n.medication_id === med.id &&
              n.notification_type === "medication_reminder" &&
              n.scheduled_for &&
              new Date(n.scheduled_for).getTime() === start.getTime()
          );

          return {
            start,
            end,
            title: `${med.name} ${med.dosage}mg`,
            category: med.category,
            medicineId: med.id,
            notificationId: notification ? notification.id : null,
            notificationStatus: notification ? notification.status : null,
          };
        });
      }).flat();
    });
  } catch {
    error("Erro ao buscar medicamentos ou notificações.");
  }
}
function onEventClick(event: CalendarEvent) {
  if (event.notificationStatus === "READ") {
    $q.notify({ type: "info", message: "Dose marcada como tomada!" });
    return;
  }

  Dialog.create({
    title: "Confirmação de Dose",
    message: `
    <div style="text-align:center;">
      <span class="material-icons" style="font-size:40px;color:#1976d2;margin-bottom:8px;">medication</span>
      <div>Você tomou o medicamento <b>${event.title}</b> neste horário?</div>
    </div>
  `,
    html: true,
    cancel: {
      label: "Cancelar",
      color: "negative",
      flat: false,
    },
    ok: {
      label: "Sim, tomei",
      color: "primary",
      flat: false,
      push: true,
    },
    persistent: true,
    class: "q-pa-md custom-dose-dialog",
  }).onOk(() => {
    void handleDoseConfirmation(event);
  });
}

async function handleDoseConfirmation(event: CalendarEvent) {
  try {
    await api.post(`/medication/${event.medicineId}/consume-dose`, {
      schedule: event.start,
    });

    if (event.notificationId) {
      await api.patch(`/notification/${event.notificationId}/read`);
    }

    $q.notify({
      type: "positive",
      message: "Dose Realizada com sucesso!",
    });

    await reloadCalendarAndNotifications();
  } catch {
    $q.notify({
      type: "negative",
      message: "Erro ao realizar dose.",
    });
  }
}
</script>
