<template>
  <q-dialog v-model="dialogModel">
    <q-card class="modal-notify-card">
      <q-card-section class="modal-notify-header">
        <q-icon
          name="notifications_active"
          color="primary"
          size="32px"
          class="q-mr-sm"
        />
        <div class="text-h6">{{ notification?.title }}</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="modal-notify-message">
          {{ notification?.message }}
        </div>
        <div
          v-if="notification?.medication_name"
          class="modal-notify-medication q-mt-md"
        >
          <q-icon name="medication" color="blue" size="20px" class="q-mr-xs" />
          <strong>Medicamento:</strong> {{ notification.medication_name }}
        </div>
      </q-card-section>
      <q-card-actions align="right" class="modal-notify-actions">
        <q-btn flat label="Fechar" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from "vue";
import type { Notification } from "src/types/notification";

const props = defineProps<{
  modelValue: boolean;
  notification: Notification | null;
}>();
const emit = defineEmits(["update:modelValue"]);

const dialogModel = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit("update:modelValue", val),
});
</script>

<style scoped>
.modal-notify-card {
  min-width: 350px;
  max-width: 90vw;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.18);
  background: #fafdff;
}

.modal-notify-header {
  display: flex;
  align-items: center;
  background: linear-gradient(90deg, #1976d2 0%, #42a5f5 100%);
  color: white;
  border-radius: 16px 16px 0 0;
  padding-bottom: 12px;
}

.text-h6 {
  font-weight: 600;
  font-size: 1.2rem;
}

.modal-notify-message {
  font-size: 1.05rem;
  color: #333;
  margin-top: 8px;
}

.modal-notify-medication {
  display: flex;
  align-items: center;
  background: #e3f2fd;
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 0.98rem;
}

.modal-notify-actions {
  padding-bottom: 8px;
  padding-right: 12px;
}
</style>
