<template>
  <section class="space-y-4">
    <header class="flex justify-between gap-4 items-center">
      <UInput v-model="search" icon="lucide:user-search" class="w-full" />

      <UButton
        icon="lucide:users"
        label="Amigos"
        variant="ghost"
        @click="emit('toggleList', 'friendsList')"
      />
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

      <ul v-else-if="data" class="flex flex-col gap-1">
        <p v-if="data.count === 0">Nenhum chat foi criado até o momento.</p>

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

          <div class="mb-1">
            <h1 class="font-medium">
              {{
                chat.isGroup
                  ? chat.groupRef?.name || "Grupo sem nome."
                  : chat.participants[0]?.fullName || "Usuário sem nome."
              }}
            </h1>
            <p class="text-sm text-muted">{{ chat.lastMessageText }}</p>
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

const emit = defineEmits(["toggleList"]);

const { setActiveChat, activeChat } = useChatComposable();

const { data, status, error, refresh } = await useFetch<IChatListResponse>(
  "/api/chats/list",
  {
    key: "chats",
  }
);

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

const typeChats = ref<string>("");
const search = ref<string>("");

const filteredChats = computed(() => {
  let chats = data.value?.chats || [];

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

const { joinUserChats } = useChatComposable();

watch(
  () => data,
  (newValue) => {
    if (newValue.value) {
      const chatIds = newValue.value.chats.map((chat) => chat._id);
      joinUserChats(chatIds);
    }
  },
  { immediate: true }
);
</script>

<style scoped></style>
