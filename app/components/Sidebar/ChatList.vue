<template>
  <section class="space-y-4">
    <header class="flex justify-between gap-4 items-center">
      <UInput
        v-model="search"
        icon="lucide:user-search"
        class="w-full"
        placeholder="Buscar chat..."
      />

      <!-- <UButton
        icon="lucide:users"
        label="Amigos"
        variant="ghost"
        @click="emit('toggleList', 'friendsList')"
      /> -->
    </header>

    <main class="space-y-4">
      <UTabs
        v-model="typeChats"
        color="neutral"
        variant="link"
        :content="false"
        :items="items"
      />

      <ul v-if="status === 'pending'" class="flex flex-col gap-1">
        <li v-for="index in 5" :key="index">
          <div class="flex items-center gap-2 p-4 rounded">
            <USkeleton class="size-12 rounded-full" />
            <USkeleton class="flex-1 h-12" />
          </div>
        </li>
      </ul>

      <ul v-else-if="fetchedData" class="flex flex-col gap-1">
        <p v-if="fetchedData.count === 0">
          Nenhum chat foi criado até o momento.
        </p>

        <li
          v-else
          v-for="(chat, index) in filteredChats"
          :key="index"
          class="flex items-center gap-2 p-4 rounded cursor-pointer"
          @click="openChat(chat)"
          :class="{
            'bg-primary-100 dark:bg-gray-700': activeChat?._id === chat._id,
            'hover:bg-gray-100 dark:hover:bg-gray-800':
              activeChat?._id !== chat._id,
          }"
        >
          <UAvatar
            :src="
              chat.isGroup
                ? chat.groupRef?.image || '/image.png'
                : chat.participants[0]?.profileImage || '/image.png'
            "
            size="2xl"
          />

          <div class="w-full flex justify-between items-center">
            <div class="mb-1">
              <h1 class="font-medium">
                {{
                  chat.isGroup
                    ? chat.groupRef?.name || "Grupo sem nome."
                    : chat.participants[0]?.fullName || "Usuário sem nome."
                }}
              </h1>
              <p class="text-sm text-muted">
                {{ chat.lastMessageText || "Sem mensagens ainda..." }}
              </p>
            </div>

            <div v-if="chat._id !== activeChat?._id">
              <span
                v-if="hasUnreadMessages(chat._id)"
                class="bg-primary-600 text-white text-xs font-medium px-2 py-1 rounded-full"
              >
                {{ getUnreadCount(chat._id) }}
              </span>
            </div>
          </div>
        </li>
      </ul>

      <div v-else-if="error">
        <p>{{ (error as any).data.message }}</p>
      </div>
    </main>
  </section>
</template>

<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";
import type { IChat, IChatListResponse } from "~/types/chat.type";

const {
  setActiveChat,
  activeChat,
  joinUserChats,
  hasUnreadMessages,
  getUnreadCount,
} = useChatComposable();

const {
  data: fetchedData,
  status,
  error,
  refresh,
} = await useFetch<IChatListResponse>("/api/chats/list", {
  key: "chats",
});

const items = ref<TabsItem[]>([
  {
    label: "Todos",
    value: "all",
  },
  {
    label: "Amigos",
    value: "friends",
  },
  {
    label: "Grupos",
    value: "groups",
  },
]);

const listChats = ref<IChat[]>([]);
const typeChats = ref<string>("");
const search = ref<string>("");

const filteredChats = computed(() => {
  let chats = listChats.value;

  chats = filterByName(chats, search.value);
  chats = filterByType(chats, typeChats.value);

  return chats;
});

const filterByName = (chats: any[], name: string) => {
  if (!name) return chats;

  return chats.filter((chat) =>
    chat.fullName.toLowerCase().includes(name.toLowerCase())
  );
};

const filterByType = (chats: any, type: string) => {
  if (type === "friends")
    return chats.filter((chat: IChat) => chat.isGroup === false);

  if (type === "groups")
    return chats.filter((chat: IChat) => chat.isGroup === true);

  return chats;
};

const openChat = (friend: any) => {
  setActiveChat(friend);
};

watch(
  () => fetchedData,
  (newValue) => {
    if (newValue.value) {
      listChats.value = newValue.value.chats;
      const chatIds = newValue.value.chats.map((chat) => chat._id);
      joinUserChats(chatIds);
    }
  },
  { immediate: true }
);

const { socket } = useSocketComposable();
const {} = useChatComposable();

onMounted(() => {
  if (socket) {
    socket.off("update-chat");

    socket.on("update-chat", (updatedChat) => {
      const chat = listChats.value.find((chat) => chat._id === updatedChat._id);

      if (!chat) return;

      chat.lastMessageSender = updatedChat.lastMessageSender;
      chat.lastMessageText = updatedChat.lastMessageText;
      chat.lastMessageTimestamp = updatedChat.lastMessageTimestamp;
    });
  }
});

onUnmounted(() => {
  if (socket) {
    socket.off("update-chat");
  }
});
</script>

<style scoped></style>
