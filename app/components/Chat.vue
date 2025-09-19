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
            :src="activeChat.participants[0]?.profileImage || '/image.png'"
            size="md"
            :chip="{
              color: activeChat.participants[0]?.isOnline
                ? 'primary'
                : 'neutral',
            }"
          />
          <div>
            <h1 class="font-medium">
              {{ activeChat.participants[0]?.fullName }}
              <span class="text-muted text-sm font-normal">
                {{ activeChat.participants[0]?.username }}
              </span>
            </h1>
            <p class="text-sm text-muted">
              {{ activeChat.participants[0]?.isOnline ? "Online" : "Offline" }}
            </p>
          </div>
        </div>
      </header>

      <div class="flex-1 overflow-y-auto flex flex-col gap-3 scroll-smooth">
        <div
          v-if="status === 'pending'"
          class="flex-1 flex justify-center items-center"
        >
          <UIcon name="lucide:loader-2" size="32" class="animate-spin" />
        </div>

        <div
          v-else-if="error"
          class="flex-1 flex flex-col gap-2 justify-center items-center text-red-500"
        >
          <UIcon name="lucide:alert-circle" size="52" />
          <h3 class="text-xl font-bold">Erro ao carregar mensagens</h3>
          <p class="text-muted">{{ error.message }}</p>
          <UButton variant="outline">Tentar novamente</UButton>
        </div>

        <div
          v-else-if="messages.length === 0"
          class="flex-1 flex flex-col gap-2 justify-center items-center"
        >
          <UIcon name="lucide:message-square-plus" size="52" />
          <h3 class="text-xl font-bold">Nenhuma mensagem ainda</h3>
          <p class="text-muted">Comece uma conversa digitando algo abaixo!</p>
        </div>

        <div v-else class="h-[710px] flex flex-col gap-2 overflow-y-auto">
          <template v-for="(group, date) in groupedMessages" :key="date">
            <div class="flex justify-center my-4">
              <div
                class="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm text-gray-600 dark:text-gray-300"
              >
                {{ formatDateChip(date) }}
              </div>
            </div>

            <div class="flex flex-col gap-2 p-4">
              <div
                v-for="message in group"
                :key="message._id"
                class="w-2/3 py-3 px-4 rounded-lg wrap-break-word transition-colors"
                :class="
                  message.sender._id === currentUserId
                    ? 'bg-emerald-800  self-end text-white'
                    : 'bg-sky-800  self-start text-white'
                "
              >
                <div class="mb-2">
                  {{ message.text }}
                </div>

                <div
                  class="text-xs opacity-75"
                  :class="
                    message.sender._id === currentUserId
                      ? 'text-end'
                      : 'text-start'
                  "
                >
                  {{ formatTime(message.createdAt) }}
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>

      <footer
        ref="chatBox"
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
import { useUserStore } from "~/store/useUserStore";
import type {
  IMessage,
  IMessageGetResponse,
  IMessagePostResponse,
} from "~/types/message.type";

const { activeChat } = useActiveChat();
const userStore = useUserStore();

const chatBox = useTemplateRef("chatBox");
const chatId = ref(activeChat.value?._id);
const messages = ref<IMessage[]>([]);
const messageInput = ref<string>("");
const image = ref<string>("");

const currentUserId = computed(() => {
  return userStore.user?._id || "";
});

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

interface IBody {
  image?: string;
  text?: string;
}

const sendMessage = async () => {
  if (!messageInput.value.trim() && !image.value.trim()) return;

  try {
    let body: IBody = {};

    if (image.value) body.image = image.value;
    if (messageInput.value) body.text = messageInput.value;

    const response = await $fetch<IMessagePostResponse>(
      `/api/messages/${chatId.value}/send`,
      {
        method: "POST",
        body: body,
      }
    );

    if (!response.success) throw response;

    messages.value.push(response.data);
    messageInput.value = "";
    image.value = "";
  } catch (error: any) {
    console.log(
      `${error.status || "Erro"} - ${error.message || "Erro desconhecido"}`
    );
  }
};

const { data, status, error, refresh } = useAsyncData(
  () => `messages-${chatId.value}`,
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

watch(
  data,
  (newData) => {
    if (newData?.success && newData?.data) {
      messages.value = newData.data;
    }
  },
  { immediate: true }
);

watch(
  () => activeChat.value?._id,
  (newId) => {
    chatId.value = newId;
    chatBox.value?.scrollIntoView({ behavior: "smooth" });
  }
);

onMounted(() => {
  console.log("aa");
});
</script>

<style scoped>
.wrap-break-word {
  word-wrap: break-word;
  word-break: break-word;
  hyphens: auto;
}
</style>
