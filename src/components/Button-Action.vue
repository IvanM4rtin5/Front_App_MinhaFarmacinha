<template>
  <q-btn-dropdown
    color="primary"
    icon="more_vert"
    dense
    flat
    no-caps
    menu-anchor="bottom right"
    menu-self="top right"
  >
    <q-list 
    style="min-width: 120px;">

      <q-item clickable v-close-popup @click="onEdit">
        <q-item-section avatar>
          <q-icon name="edit" color="primary" />
        </q-item-section>
        <q-item-section style="color: blue">Editar</q-item-section>
      </q-item>
      <q-separator />
      <q-item clickable v-close-popup @click="onAdd">
        <q-item-section avatar>
          <q-icon name="add" color="green" />
        </q-item-section>
        <q-item-section style="color: green">Adicionar</q-item-section>
      </q-item>
      <q-separator />
      <q-item clickable v-close-popup @click="onDelete">
        <q-item-section avatar>
          <q-icon name="delete" color="negative" />
        </q-item-section>
        <q-item-section style="color: red">Excluir</q-item-section>
      </q-item>
      <!-- Adicione mais ações conforme necessário -->
    </q-list>
  </q-btn-dropdown>
</template>

<script setup lang="ts">
const props = defineProps<{ row: unknown }>();
const emit = defineEmits(["edit", "delete", "add"]);

function onEdit() {
  emit("edit", props.row);
}
function onDelete() {
  emit("delete", props.row);
}
function onAdd() {
  emit("add", props.row);
}
</script>