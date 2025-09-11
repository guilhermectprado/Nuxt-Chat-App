<template>
  <div>
    asssssssssss

    <UButton @click="logout">Logout</UButton>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "~/store/useUserStore";

const logout = async () => {
  try {
    const response = await $fetch("/api/auth/logout", {
      method: "POST",
    });

    if (!response.success) throw response;

    useUserStore().clearUser();
    navigateTo("/login");
  } catch (error: any) {
    console.log(`${error.data.statusCode} - ${error.data.message}`);
  }
};
</script>

<style scoped></style>
