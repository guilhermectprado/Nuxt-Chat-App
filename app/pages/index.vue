<template>
  <div class="flex flex-col gap-4">
    <section class="w-full flex justify-end">
      <UButton @click="logout">Logout</UButton>
    </section>

    <Profile />

    <section class="w-full flex gap-4">
      <SideBar />
      <Chat />
    </section>
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
