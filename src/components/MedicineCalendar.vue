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
import { useQuasar } from "quasar";

interface CalendarEvent {
  start: Date;
  end: Date;
  title: string;
  category: Medicine["category"];
}
const { error } = useNotify();
const $q = useQuasar();
const events = ref<CalendarEvent[]>([]);
const view = ref("day");

onMounted(async () => {
  try {
    const response = await api.get<Medicine[]>("/medication/");
    const medicines = response.data;

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
          return {
            start,
            end,
            title: `${med.name} ${med.dosage}mg`,
            category: med.category,
          };
        });
      }).flat();
    });
  } catch {
    error("Erro ao buscar medicamentos:");
  }
});

function onEventClick(event: CalendarEvent) {
  $q.notify({
    type: "info",
    message: `${event.title} - ${event.category}`,
  });
}
</script>
