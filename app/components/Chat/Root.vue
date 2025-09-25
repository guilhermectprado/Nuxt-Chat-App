<template>
  <section class="flex flex-col h-full overflow-hidden">
    <div v-if="!activeChat" class="flex-1 flex items-center justify-center">
      <div class="text-center text-white">
        <Icon
          name="lucide:message-circle"
          class="w-16 h-16 mx-auto mb-4 opacity-50"
        />
        <h2 class="text-xl font-medium mb-2">Selecione um chat</h2>
        <p class="opacity-75">Escolha uma conversa para começar a conversar</p>
      </div>
    </div>

    <div v-else class="flex flex-col h-full overflow-hidden">
      <ChatHeader />
      <ChatMessages />
      <ChatInput />
    </div>
  </section>
</template>

<script setup lang="ts">
const { activeChat } = useChatComposable();
</script>

<style scoped></style>
