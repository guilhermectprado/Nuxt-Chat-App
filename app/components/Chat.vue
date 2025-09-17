<template>
  <section class="flex flex-col">
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

    <div v-else class="flex-1 flex flex-col">
      <header
        class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 rounded-t"
      >
        <div class="flex items-center gap-3">
          <UAvatar
            :src="activeChat.profileImage || '/image.png'"
            size="md"
            :chip="{
              color: activeChat.isOnline ? 'primary' : 'neutral',
            }"
          />
          <div>
            <h1 class="font-medium">{{ activeChat.fullName }}</h1>
            <p class="text-sm text-muted">
              {{ activeChat.isOnline ? "Online" : "Offline" }}
            </p>
          </div>
        </div>
      </header>

      <div class="flex-1 p-4 overflow-y-auto">
        <div class="space-y-4">
          <div class="text-center text-gray-500">
            <p>Início da conversa com {{ activeChat.fullName }}</p>
          </div>
        </div>
      </div>

      <footer
        class="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4 rounded-b"
      >
        <div class="flex gap-2">
          <UTextarea
            v-model="messageInput"
            placeholder="Digite sua mensagem..."
            :rows="1"
            class="flex-1"
            @keydown.enter.prevent="sendMessage"
          />
          <UButton
            icon="lucide:send"
            @click="sendMessage"
            :disabled="!messageInput.trim()"
          />
        </div>
      </footer>
    </div>
  </section>
</template>

<script setup lang="ts">
const { activeChat } = useActiveChat();
const messageInput = ref("");

const sendMessage = () => {
  if (!messageInput.value.trim()) return;

  // Aqui você implementará o envio da mensagem
  console.log(
    "Enviando mensagem:",
    messageInput.value,
    "para:",
    activeChat.value?.fullName
  );

  messageInput.value = "";
};
</script>
