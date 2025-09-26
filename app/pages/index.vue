<template>
  <div class="w-full h-dvh flex justify-center overflow-hidden">
    <div
      class="w-full h-full max-w-7xl grid grid-cols-2 rounded border border-indigo-400"
    >
      <SidebarRoot />
      <ChatRoot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "~/store/useUserStore";

const { socket } = useSocketComposable();
const userStore = useUserStore();

onMounted(() => {
  console.log(userStore.getUserId);

  if (socket) {
    socket.emit("join-user", userStore.getUserId);
  }
});
</script>

<style scoped></style>
