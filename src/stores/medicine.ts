import { defineStore } from "pinia";
import { ref } from "vue";
import { api } from "src/boot/axios";
import type { Medicine, MedicineForm } from "src/types/Medicine/medicine";

export const useMedicinesStore = defineStore("medicines", () => {
  const medicines = ref<Medicine[]>([]);
  const loading = ref(false);
  const errorMsg = ref<string | null>(null);

  async function fetchMedicines() {
    loading.value = true;
    try {
      const response = await api.get<Medicine[]>("/medication/");
      medicines.value = response.data;
      errorMsg.value = null;
    } catch {
      errorMsg.value = "Erro ao carregar medicamentos";
    } finally {
      loading.value = false;
    }
  }

  async function addMedicine(medicine: MedicineForm) {
    loading.value = true;
    try {
      await api.post("/medication/", medicine);
      await fetchMedicines();
      errorMsg.value = null;
      return true;
    } catch {
      errorMsg.value = "Erro ao adicionar medicamento";
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function updateMedicine(medicine: MedicineForm) {
    loading.value = true;
    try {
      await api.put(`/medication/${medicine.id}`, medicine);
      await fetchMedicines();
      errorMsg.value = null;
      return true;
    } catch {
      errorMsg.value = "Erro ao atualizar medicamento";
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function deleteMedicine(id: number) {
    loading.value = true;
    try {
      await api.delete(`/medication/${id}`);
      await fetchMedicines();
      errorMsg.value = null;
      return true;
    } catch {
      errorMsg.value = "Erro ao excluir medicamento";
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function consumeDose(Id: number, schedule: Date) {
    loading.value = true;
    try {
      await api.post(`/medication/${Id}/consume`, { schedule });
      await fetchMedicines();
      errorMsg.value = null;
      return true;
    } catch {
      errorMsg.value = "Erro ao consumir dose";
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function saveMedicine(medicine: MedicineForm, isEditing: boolean) {
    if (isEditing) {
      return await updateMedicine(medicine);
    } else {
      return await addMedicine(medicine);
    }
  }

  function getMedicineById(id: number) {
    return medicines.value.find((m) => m.id === id) || null;
  }

  return {
    medicines,
    loading,
    errorMsg,
    fetchMedicines,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    consumeDose,
    saveMedicine,
    getMedicineById,
  };
});
