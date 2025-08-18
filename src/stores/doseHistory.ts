import { defineStore } from "pinia";
import { ref } from "vue";
import { api } from "src/boot/axios";
import type { DoseHistory } from "src/types/Medicine/doseHistory";

export const useDoseHistoryStore = defineStore("doseHistory", () => {
  const doses = ref<DoseHistory[]>([]);
  const loading = ref(false);
  const errorMsg = ref<string | null>(null);

  async function fetchDoseHistory() {
    loading.value = true;
    try {
      const response = await api.get<DoseHistory[]>("/dose-history/");
      doses.value = response.data;
      errorMsg.value = null;
    } catch {
      errorMsg.value = "Erro ao carregar histórico de doses";
    } finally {
      loading.value = false;
    }
  }

  async function takeDose(doseId: number) {
    loading.value = true;
    try {
      await api.post(`/dose-history/${doseId}/take`);
      await fetchDoseHistory();
      errorMsg.value = null;
      return true;
    } catch {
      errorMsg.value = "Erro ao marcar dose como tomada";
      return false;
    } finally {
      loading.value = false;
    }
  }

  return {
    doses,
    loading,
    errorMsg,
    fetchDoseHistory,
    takeDose,
  };
});
