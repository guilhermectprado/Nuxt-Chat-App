<template>
  <div class="flex gap-1 items-center">
    <UAvatar src="/image.png" />
    <p>
      {{ userStore.user.fullName }}
      <span class="text-muted text-sm">({{ userStore.user.username }})</span>
    </p>
  </div>
</template>

<script setup>
import { useUserStore } from "~/store/useUserStore";

const userStore = useUserStore();
</script>

<style lang="scss" scoped></style>
