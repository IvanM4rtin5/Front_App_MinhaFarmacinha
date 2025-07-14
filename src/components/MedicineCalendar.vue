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
import { ref, computed, onMounted } from "vue";
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";
import { storeToRefs } from "pinia";
import { useQuasar, Dialog } from "quasar";
import { useMedicinesStore } from "../stores/medicine";
import { useNotificationStore } from "src/stores/notification";
import type { CalendarEvent } from "../types/Calendar/eventCalendar";
import type { AxiosError } from "axios";

const $q = useQuasar();
const view = ref("day");

const medicinesStore = useMedicinesStore();
const { medicines } = storeToRefs(medicinesStore);

const notificationStore = useNotificationStore();
const { notifications } = storeToRefs(notificationStore);

onMounted(() => {
  void notificationStore.fetchNotifications();
  void medicinesStore.fetchMedicines();
});

const events = computed<CalendarEvent[]>(() => {
  const today = new Date();
  return medicines.value.flatMap((med) => {
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

        // Relaciona notificação pelo horário e medicamento
        const notification = notifications.value.find(
          (n) =>
            n.medication_id === med.id &&
            n.notification_type === "medication_reminder" &&
            n.scheduled_for &&
            new Date(n.scheduled_for).getTime() === start.getTime()
        );

        return {
          start,
          end: new Date(start.getTime() + 30 * 60000),
          title: `${med.name} ${med.dosage}mg`,
          category: med.category,
          medicineId: med.id,
          notificationId: notification ? notification.id : null,
          notificationStatus: notification ? notification.status : null,
        };
      });
    }).flat();
  });
});

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
    await medicinesStore.consumeDose(event.medicineId, event.start);

    if (event.notificationId) {
      await notificationStore.deleteNotification(event.notificationId);
    }

    $q.notify({
      type: "positive",
      message: "Dose Realizada com sucesso!",
    });

    // Atualize medicamentos e notificações após a ação
    await medicinesStore.fetchMedicines();
    await notificationStore.fetchNotifications();
  } catch (err: unknown) {
    if (
      err &&
      typeof err === "object" &&
      (err as AxiosError).isAxiosError &&
      (err as AxiosError).response?.status === 404
    ) {
      $q.notify({
        type: "negative",
        message: "Este medicamento já foi removido do sistema.",
      });
      await medicinesStore.fetchMedicines();
    } else {
      $q.notify({
        type: "negative",
        message: "Erro ao realizar dose.",
      });
    }
  }
}
</script>
