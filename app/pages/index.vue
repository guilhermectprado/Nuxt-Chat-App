<template>
  <div class="w-full h-dvh flex justify-center">
    <div class="w-full h-full max-w-7xl flex flex-col gap-4">
      <header class="flex justify-between gap-4">
        <Profile />
        <UButton @click="logout">Logout</UButton>
      </header>

      <main class="flex-1 grid grid-cols-2 rounded border border-indigo-400">
        <SidebarRoot />
        <Chat />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "~/store/useUserStore";
const userStore = useUserStore();

const logout = async () => {
  try {
    const response = await $fetch("/api/auth/logout", {
      method: "POST",
    });

    if (!response.success) throw response;

    userStore.clearUser();
    navigateTo("/login");
  } catch (error: any) {
    console.log(`${error.data.statusCode} - ${error.data.message}`);
  }
};
</script>

<style scoped></style>
