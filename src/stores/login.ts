import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useLoginStore = defineStore("login", () => {
  const authToken = ref(localStorage.getItem("auth-token"));

  const isLoggedIn = computed(() => {
    return authToken.value !== null;
  });

  return { authToken, isLoggedIn };
});
