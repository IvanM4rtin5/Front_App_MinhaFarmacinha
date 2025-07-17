<template>
  <q-dialog class="modal-notify-card"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    :backdrop-filter="'blur(4px) saturate(150%)'"
  >
    <q-card :style="cardStyle">
      <q-card-section class="row items-center q-pb-none text-h6   modal-notify-header">
        {{ title }}
      </q-card-section>
      <q-card-section>
        <slot />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancelar" color="primary" v-close-popup />
        <q-btn flat :label="confirmLabel" color="negative" @click="onConfirm" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
defineProps({
  modelValue: Boolean,
  title: { type: String, default: "Confirmação" },
  confirmLabel: { type: String, default: "Confirmar" },
  cardStyle: { type: String, default: "" },
});
const emit = defineEmits(["update:modelValue", "confirm"]);

function onConfirm() {
  emit("confirm");
  emit("update:modelValue", false);
}
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
  justify-content: center;
  text-align: center;
  background: linear-gradient(90deg, var(--gray-dark) 0%, red 100%);
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

.modal-notify-actions {
  padding-bottom: 8px;
  padding-right: 12px;
}
</style>