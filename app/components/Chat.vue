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

      <div
        class="flex-1 overflow-y-auto p-4 flex flex-col-reverse gap-3 scroll-smooth"
      >
        <div
          v-if="messages.length === 0"
          class="flex-1 flex flex-col gap-2 justify-center items-center"
        >
          <UIcon name="lucide:message-square-plus" size="52" />
          <h3 class="text-xl font-bold">Nenhuma mensagem ainda</h3>
          <p class="text-muted">Comece uma conversa digitando algo abaixo!</p>
        </div>

        <div
          v-if="messages.length > 0"
          v-for="message in messages"
          :key="message.id"
          class="w-2/3 py-3 px-4 rounded wrap-break-word"
          :class="
            message.sender === 'user' ? 'self-end bg-sky-700' : 'bg-emerald-800'
          "
        >
          {{ message.text }}
          <div
            class="text-sm opacity-70"
            :class="message.sender === 'user' ? 'text-end' : ''"
          >
            {{ formatTime(message.timestamp) }}
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

interface IMessage {
  id: number;
  text: string;
  sender: string;
  timestamp: Date;
}

const messages = ref<IMessage[]>([]);
const messageInput = ref("");
const isTyping = ref(false);

const sendMessage = async () => {
  if (!messageInput.value.trim()) return;

  const userMessage = {
    id: Date.now(),
    text: messageInput.value.trim(),
    sender: "user",
    timestamp: new Date(),
  } as IMessage;

  messages.value.unshift(userMessage);
  messageInput.value = "";

  simulateResponse();
};

const simulateResponse = () => {
  isTyping.value = true;

  setTimeout(() => {
    const responses = [
      "Interessante! Conte-me mais sobre isso.",
      "Entendo seu ponto de vista!",
      "Que legal! Como você chegou a essa conclusão?",
      "Isso faz muito sentido.",
      "Obrigado por compartilhar isso comigo!",
    ];

    const friendMessage = {
      id: Date.now() + 1,
      text: responses[Math.floor(Math.random() * responses.length)],
      sender: "friend",
      timestamp: new Date(),
    } as IMessage;

    messages.value.unshift(friendMessage);
    isTyping.value = false;
  }, 1500);
};

const formatTime = (timestamp: Date) => {
  return timestamp.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

onMounted(() => {
  setTimeout(() => {
    messages.value.unshift({
      id: 1,
      text: "Olá! Bem-vindo ao chat. Digite algo para começarmos a conversar!",
      sender: "friend",
      timestamp: new Date(),
    });
  }, 1000);
});

// chat trocado →
// limpa mensagens do chat antigo →
// requisita ultimas 100 mensagens do chat atual →
//
</script>
