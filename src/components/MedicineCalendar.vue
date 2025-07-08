<template>
  <vue-cal
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

interface CalendarEvent {
  start: Date;
  end: Date;
  title: string;
}
const { success, error } = useNotify();
const events = ref<CalendarEvent[]>([]);
const view = ref("day");

onMounted(async () => {
  try {
    const response = await api.get<Medicine[]>("/medication/");
    const medicines = response.data;

    events.value = medicines.flatMap((med) =>
      (med.schedules || []).map((time) => {
        // time: "08:00", "14:00", etc.
        const [hour, minute] = time.split(":").map(Number);
        const today = new Date();
        const start = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          hour,
          minute ?? 0
        );
        const end = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          hour,
          (minute ?? 0) + 30
        );

        return {
          start,
          end,
          title: `${med.name} (${med.dosage}mg)`,
        };
      })
    );
  } catch {
    error("Erro ao buscar medicamentos:");
  }
});

function onEventClick(event: CalendarEvent) {
  success(event.title);
}
</script>
