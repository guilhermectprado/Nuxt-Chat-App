<template>
  <header class="border-b border-neutral-700 p-4 rounded-t flex-shrink-0">
    <UUser
      :name="name"
      :description="description"
      :avatar="{
        src: activeChat?.participants[0]?.profileImage,
        icon: 'i-lucide-image',
      }"
      size="xl"
    />
  </header>
</template>

<script setup lang="ts">
const { activeChat } = useChatComposable();

const name = computed(() => {
  return activeChat.value?.isGroup
    ? activeChat.value.name
    : activeChat.value?.participants[0]?.fullName;
});

const description = computed(() => {
  return activeChat.value?.isGroup
    ? activeChat.value?.description || "Sem descrição"
    : activeChat.value?.participants[0]?.username;
});
</script>

<style scoped></style>
