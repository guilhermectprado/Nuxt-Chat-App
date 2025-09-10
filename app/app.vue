<template>
  <UApp :locale="pt_br">
    <NuxtPage />
  </UApp>
</template>
<script setup>
import { pt_br } from "@nuxt/ui/runtime/locale/index.js";

useHead({
  title: "Chat App",
});
</script>
