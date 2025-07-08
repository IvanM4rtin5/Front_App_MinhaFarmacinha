<template>
  <div class="row q-col-gutter-md">
    <div class="col-12 col-md-6">
      <q-input
        v-model="localSearch"
        dense
        outlined
        placeholder="Buscar medicamentos..."
        @update:model-value="emitSearch"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>
    <div class="col-12 col-md-6">
      <q-select
        v-model="localSelectedGroup"
        :options="categoryOptions"
        dense
        outlined
        label="Filtrar por grupo"
        emit-value
        map-options
        clearable
        @update:model-value="emitSelectedGroup"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from "vue";

const props = defineProps({
  search: String,
  selectedGroup: {
    type: [String, null],
    default: null,
  },
  categoryOptions: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["update:search", "update:selectedGroup"]);

const localSearch = ref(props.search || "");
const localSelectedGroup = ref(props.selectedGroup || null);

watch(
  () => props.search,
  (val) => {
    localSearch.value = val || "";
  }
);

watch(
  () => props.selectedGroup,
  (val) => {
    localSelectedGroup.value = val || null;
  }
);

function emitSearch(val: string | number | null) {
  emit("update:search", val ?? "");
}

function emitSelectedGroup(val: string | null) {
  emit("update:selectedGroup", val);
}
</script>
