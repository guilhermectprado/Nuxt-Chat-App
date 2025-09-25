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

const { socket } = useSocketComposable();

// onMounted(() => {
//   if (socket) {
//     socket.off("new-message");

//     socket.on("new-message", async (message) => {
//       if (message.chatId !== activeChat.value?._id) {
//         addUnreadMessage(message.chatId);
//       }
//     });
//   }
// });

// onUnmounted(() => {
//   if (socket) {
//     socket.off("new-message");
//   }
// });
</script>

<style scoped></style>
