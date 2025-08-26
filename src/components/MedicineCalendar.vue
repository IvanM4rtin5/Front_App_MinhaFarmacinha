<template>
  <q-page padding>
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md-6">
        <h5 class="text-primary" style="margin: 0">
          Minha Farmacinha <q-icon name="chevron_right" /> Calendário
        </h5>
      </div>
      <div class="col-12 col-md-6">
        <InfoPopover class="popover-responsive">
          <p>
            Gerencie e visualize seus horários de medicação de forma prática. No
            calendário, você pode acompanhar todos os seus lembretes, conferir
            doses agendadas e marcar medicamentos como tomados.
          </p>
          <ul style="margin: 0; padding-left: 18px">
            <li>Veja todos os horários de medicação em um só lugar</li>
            <li>Receba lembretes para não esquecer nenhuma dose</li>
            <li>Marque medicamentos como tomados diretamente no calendário</li>
            <li>Visualize o histórico de uso dos seus medicamentos</li>
          </ul>
        </InfoPopover>
      </div>
    </div>
    <vue-cal
      locale="pt-br"
      style="height: 500px"
      :events="computedEvents"
      :time="true"
      :view="view"
      @event-click="onEventClick"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";
import { storeToRefs } from "pinia";
import { useQuasar, Dialog } from "quasar";
import { useMedicinesStore } from "../stores/medicine";
import { useDoseHistoryStore } from "src/stores/doseHistory";
import { useNotificationStore } from "src/stores/notification";
import type { CalendarEvent } from "../types/Calendar/eventCalendar";
import InfoPopover from "./InfoPopover.vue";
import type { AxiosError } from "axios";

const $q = useQuasar();
const view = ref("month");

const medicinesStore = useMedicinesStore();
const { medicines } = storeToRefs(medicinesStore);

const notificationStore = useNotificationStore();
const { notifications } = storeToRefs(notificationStore);

const doseHistoryStore = useDoseHistoryStore();
const { doses } = storeToRefs(doseHistoryStore);

onMounted(async () => {
  await Promise.all([
    notificationStore.fetchNotifications(),
    medicinesStore.fetchMedicines(),
    doseHistoryStore.fetchDoseHistory(),
  ]);

  // Debug: verifique se as doses estão carregando
  console.log("Doses carregadas:", doses.value);
  console.log("Medicamentos carregados:", medicines.value);
});

function onEventClick(event: CalendarEvent) {
  if (event.notificationStatus === "READ") {
    $q.notify({ type: "info", message: "Dose marcada como tomada!" });
    if (event.status === "taken" || event.status === "missed") {
      $q.notify({
        type: "info",
        message: `Esta dose já foi ${
          event.status === "taken" ? "tomada" : "marcada como esquecida"
        }.`,
      });
    }
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

const computedEvents = computed<CalendarEvent[]>(() => {
  const allEvents: CalendarEvent[] = [];

  doses.value
    .filter((dose) => dose.taken_at !== null)
    .forEach((dose) => {
      const start = new Date(dose.taken_at!);
      allEvents.push({
        start: new Date(dose.taken_at!),
        end: new Date(start.getTime() + 30 * 60000),
        title: `${dose.medicine_name} ${dose.dosage}mg`,
        category: dose.category,
        medicineId: dose.medication_id,
        notificationId: dose.notification_id || null,
        notificationStatus: dose.status,
        doseId: dose.id,
        status:
          dose.status === "tomada"
            ? "taken"
            : dose.status === "esquecida"
            ? "missed"
            : "pending",
      });
    });

  medicines.value.forEach((med) => {
    if (!med.schedules || !med.days_until_empty || !med.created_at) return;

    const startDate = new Date(med.created_at);

    for (let i = 0; i < med.days_until_empty; i++) {
      const eventDay = new Date(startDate);
      eventDay.setDate(startDate.getDate() + i);

      med.schedules.forEach((time) => {
        const [hour, minute] = time.split(":").map(Number);
        const start = new Date(
          eventDay.getFullYear(),
          eventDay.getMonth(),
          eventDay.getDate(),
          hour,
          minute ?? 0
        );

        const notification = notifications.value.find(
          (n) =>
            n.medication_id === med.id &&
            n.notification_type === "medication_reminder" &&
            n.scheduled_for &&
            new Date(n.scheduled_for).getTime() === start.getTime()
        );

        allEvents.push({
          start,
          end: new Date(start.getTime() + 30 * 60000),
          title: `${med.name} ${med.dosage}mg`,
          category: med.category,
          medicineId: med.id,
          notificationId: notification ? notification.id : null,
          notificationStatus: notification ? notification.status : null,
          doseId: null,
          status: "pending",
          takenAt: null,
          wasTaken: false,
        });
      });
    }
  });

  return allEvents;
});

async function handleDoseConfirmation(event: CalendarEvent) {
  try {
    await medicinesStore.consumeDose(event.medicineId, event.start);

    if (event.notificationId) {
      await notificationStore.deleteNotification(event.notificationId);
    }

    $q.notify({
      type: "positive",
      message: "Dose registrada com sucesso!",
    });

    await Promise.all([
      medicinesStore.fetchMedicines(),
      notificationStore.fetchNotifications(),
      doseHistoryStore.fetchDoseHistory(),
    ]);
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

<style scoped>
.vuecal__event {
  cursor: pointer;
}
:deep(.vuecal__event:hover) {
  background-color: #e3f2fd;
}
:deep(.vuecal__header) {
  background: linear-gradient(
    135deg,
    var(--blue-dark) 0%,
    var(--gray-dark) 120%
  );
  color: #fff;
}
:deep(.vuecal__header *) {
  color: #fff !important;
}
:deep(.vuecal__body) {
  background: linear-gradient(135deg, var(--blue-light) 0%, var(--blue) 150%);
}
:deep(.vuecal__body *) {
  color: #000 !important;
}

:deep(.vuecal__event.taken) {
  background-color: #4caf50 !important;
  color: white !important;
}

:deep(.vuecal__event.missed) {
  background-color: #f44336 !important;
  color: white !important;
}

:deep(.vuecal__event.pending) {
  background-color: #ff9800 !important;
  color: white !important;
}
</style>
