<template>
  <main class="flex-1 overflow-hidden">
    <div
      v-if="status === 'pending'"
      class="h-full flex justify-center items-center"
    >
      <UIcon name="lucide:loader-2" size="32" class="animate-spin" />
    </div>

    <div
      v-else-if="error"
      class="h-full flex flex-col gap-2 justify-center items-center text-red-500"
    >
      <UIcon name="lucide:alert-circle" size="52" />
      <h3 class="text-xl font-bold">Erro ao carregar mensagens</h3>
      <p class="text-muted">{{ error.message }}</p>
      <UButton variant="outline">Tentar novamente</UButton>
    </div>

    <div
      v-else-if="messages.length === 0"
      class="h-full flex flex-col gap-2 justify-center items-center"
    >
      <UIcon name="lucide:message-square-plus" size="52" />
      <h3 class="text-xl font-bold">Nenhuma mensagem ainda</h3>
      <p class="text-muted">Comece uma conversa digitando algo abaixo!</p>
    </div>

    <div v-else class="h-full overflow-y-auto custom-scrollbar" ref="chatBox">
      <template v-for="(group, date) in groupedMessages" :key="date">
        <div class="flex justify-center my-4">
          <div
            class="bg-neutral-800 px-3 py-1 rounded-full text-sm text-neutral-300"
          >
            {{ formatDateChip(date) }}
          </div>
        </div>

        <div class="flex flex-col gap-2 p-4">
          <ChatCardMessage
            v-for="message in group"
            :key="message._id"
            :message="message"
            :is-group="activeChat!.isGroup"
          />
        </div>
      </template>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { IMessage, IMessageGetResponse } from "~/types/message.type";

const { activeChat } = useChatComposable();

const chatBox = useTemplateRef("chatBox");
const messages = ref<IMessage[]>([]);

const groupedMessages = computed(() => {
  const groups: Record<string, IMessage[]> = {};

  messages.value.forEach((message) => {
    const dateKey = new Date(message.createdAt).toDateString();

    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }

    groups[dateKey].push(message);
  });

  return groups;
});

const { data, status, error, refresh } = useAsyncData(
  () => `messages-${activeChat.value?._id}`,
  async () => {
    if (!activeChat.value?._id) return null;

    const response = await $fetch<IMessageGetResponse>(
      `/api/messages/${activeChat.value._id}/list`
    );

    return response;
  },
  {
    watch: [() => activeChat.value?._id],
    immediate: false,
    server: false,
  }
);

const scrollToBottom = () => {
  nextTick(() => {
    if (chatBox.value) {
      chatBox.value.scrollTop = chatBox.value.scrollHeight;
    }
  });
};

watch(
  data,
  (newData) => {
    if (newData?.success && newData?.data) {
      messages.value = [...newData.data];
      scrollToBottom();
    }
  },
  { immediate: true }
);

watch(
  () => activeChat.value,
  () => {
    refresh();
  },
  { immediate: true }
);

watch(
  messages,
  () => {
    scrollToBottom();
  },
  { deep: true }
);
///////////////////////////////

const { socket } = useSocketComposable();

onMounted(() => {
  if (socket) {
    socket.off("new-message");

    socket.on("new-message", async (message) => {
      if (message.chatId === activeChat.value?._id) {
        messages.value = [...messages.value, message];

        if (message.image) {
          await nextTick();

          const img = new Image();
          img.onload = () => {
            scrollToBottom();
          };
          img.src = message.image;
        }
      }
    });
  }
});

onUnmounted(() => {
  if (socket) {
    socket.off("new-message");
  }
});
</script>

<style scoped>
.wrap-break-word {
  word-wrap: break-word;
  word-break: break-word;
  hyphens: auto;
}
</style>
