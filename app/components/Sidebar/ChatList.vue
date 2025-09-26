<template>
  <section class="space-y-3">
    <header class="flex flex-col gap-3">
      <UInput
        v-model="search"
        icon="lucide:user-search"
        class="w-full"
        placeholder="Buscar chat..."
      />

      <UTabs
        v-model="typeChats"
        color="neutral"
        variant="link"
        :content="false"
        :items="items"
        class="flex-1 mb-[5px]"
      />
    </header>

    <main>
      <ul v-if="status === 'pending'" class="flex flex-col gap-1">
        <li v-for="index in 5" :key="index">
          <div class="flex items-center gap-4">
            <USkeleton class="h-12 w-12 rounded-full" />
            <div class="grid gap-2">
              <USkeleton class="h-4 flex-1" />
              <USkeleton class="h-4 flex-1" />
            </div>
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
          class="flex items-center justify-between gap- p-4 rounded cursor-pointer"
          @click="openChat(chat)"
          :class="{
            'bg-neutral-700': activeChat?._id === chat._id,
            'hover:bg-neutral-800': activeChat?._id !== chat._id,
          }"
        >
          <UUser
            :name="
              chat.isGroup
                ? chat.name || 'Grupo sem nome.'
                : chat.participants[0]?.fullName || 'Usuário sem nome.'
            "
            :description="chat.lastMessageText || 'Sem mensagens ainda...'"
            :avatar="{
              src: chat.isGroup
                ? chat.image || ''
                : chat.participants[0]?.profileImage || '',
              icon: 'i-lucide-image',
            }"
            size="xl"
          />

          <UBadge
            v-if="
              chat._id !== activeChat?._id &&
              (chat.unreadCounts?.[currentUserId] || 0) > 0
            "
          >
            {{ chat.unreadCounts?.[currentUserId] }}
          </UBadge>
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
import { useUserStore } from "~/store/useUserStore";
import type { IChat, IChatListResponse } from "~/types/chat.type";

const { setActiveChat, activeChat } = useChatComposable();

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
      listChats.value = [...newValue.value.data];
    }
  },
  { immediate: true }
);

const { socket } = useSocketComposable();
const userStore = useUserStore();

const currentUserId = computed(() => {
  return userStore.user?._id || "";
});

onMounted(() => {
  if (socket) {
    socket.off("update-chat");

    socket.on("update-chat", (updatedChat) => {
      const chat = listChats.value.find((chat) => chat._id === updatedChat._id);

      if (!chat) return;

      console.log(updatedChat);

      chat.lastMessageSender = updatedChat.lastMessageSender;
      chat.lastMessageText = updatedChat.lastMessageText;
      chat.lastMessageTimestamp = updatedChat.lastMessageTimestamp;
      chat.unreadCounts = updatedChat.unreadCounts;
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
