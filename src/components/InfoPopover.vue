<template>
  <div style="display: flex; justify-content: flex-end; width: 100%">
    <q-btn
      flat
      color="primary"
      no-caps
      style="display: flex; align-items: center; font-weight: 400"
    >
      <q-avatar size="28px" class="q-mr-sm">
        <img src="../assets/image/apple-touch-icon.png" />
      </q-avatar>
      SAIBA MAIS
    </q-btn>
    <q-popup-proxy
      transition-show="flip-up"
      transition-hide="flip-down"
      :anchor="anchor"
      :self="self"
    >
      <q-banner
        class="text-dark"
        style="
        min-width: 147px; 
        max-width: 300px;
        background: linear-gradient(135deg, var(--blue-light) 0%, var(--blue) 150%);
        "
      >
        <slot> Nenhuma informação fornecida. </slot>
      </q-banner>
    </q-popup-proxy>
  </div>
</template>

<script setup lang="ts">
const anchor = "bottom right";
const self = "top right";
</script>

