<template>
  <q-card bordered class="card-item">
    <q-card-section>
      <div class="text-subtitle1">📅 Próximo lembrete</div>
      <div class="text-h6 text-primary q-mt-sm">{{ nextReminder }}</div>
      <q-btn
        flat
        label="Ver calendário"
        color="negative"
        class="q-mt-md"
        clickable
        to="/app/calendar"
      />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { api } from "src/boot/axios";
import type { Medicine } from "src/types/Medicine/medicine";

const nextReminder = ref("Nenhum lembrete");

onMounted(async () => {
  try {
    const response = await api.get<Medicine[]>("/medication/");
    const medicines = response.data;

    const now = new Date();

    const reminders = medicines.flatMap((med) =>
      (med.schedules || []).map((time) => {
        const [hour, minute] = time.split(":").map(Number);
        const date = new Date();
        date.setHours(hour ?? 0, minute ?? 0, 0, 0);
        return {
          date,
          name: med.name,
          dosage: med.dosage,
        };
      })
    );

    const futureReminders = reminders.filter((r) => r.date > now);

    if (futureReminders.length > 0) {
      futureReminders.sort((a, b) => a.date.getTime() - b.date.getTime());
      const next = futureReminders[0];
      if (next) {
        nextReminder.value = `${next.name} ${
          next.dosage
        }mg às ${next.date.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        })}`;
      }
    }
  } catch {
    nextReminder.value = "Nenhum lembrete";
  }
});

</script>

<style scoped>
.card-item {
  padding: 12px;
}

.text-h6 {
  font-weight: 600;
}
</style>
