<template>
  <section class="space-y-4">
    <header class="flex justify-between gap-4 items-center">
      <UButton
        icon="lucide:move-left"
        label="Voltar"
        variant="ghost"
        @click="emit('toggleList', 'chatsList')"
      />

      <UInput v-model="search" icon="lucide:user-search" class="w-full" />

      <UButton
        icon="lucide:user-round-plus"
        label="Adicionar"
        variant="ghost"
        @click="openSearchUsers"
      />
    </header>

    <main class="space-y-4">
      <ul v-if="status === 'pending'" class="flex flex-col gap-1">
        <li v-for="index in 5" :key="index">
          <div class="flex items-center gap-2 p-4 rounded">
            <USkeleton class="size-12 rounded-full" />
            <USkeleton class="flex-1 h-12" />
          </div>
        </li>
      </ul>

      <ul v-else-if="data" class="flex flex-col gap-1">
        <p v-if="data.count === 0">Nenhum amigo encontrado.</p>

        <li
          v-else
          v-for="(friend, index) in filteredFriends"
          :key="index"
          @click="createChat(friend)"
          class="flex items-center gap-2 p-4 rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
        >
          <UAvatar
            :src="friend.profileImage ? friend.profileImage : '/image.png'"
            size="2xl"
            :chip="{
              color: friend.isOnline ? 'primary' : 'neutral',
            }"
          />

          <div class="mb-1">
            <h1 class="font-medium">{{ friend.fullName }}</h1>
            <p class="text-sm text-muted">{{ friend.username }}</p>
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
import type { IUser } from "~/types/user.type";
import type { IFriendshipListResponse } from "~/types/friendship.type";
import { FriendSearchUser } from "#components";
import type { IChat, IChatSingleResponse } from "~/types/chat.type";

const emit = defineEmits(["toggleList"]);
const { setActiveChat } = useChatComposable();

const search = ref<string>("");

const { data, status, error, refresh } =
  await useFetch<IFriendshipListResponse>("/api/friendship/list", {
    key: "friends",
  });

const filterByName = (friends: IUser[], name: string) => {
  if (!name) return friends;

  return friends.filter((friend) =>
    friend.fullName.toLowerCase().includes(name.toLowerCase())
  );
};

const filteredFriends = computed(() => {
  let friends = data.value?.friends || [];

  friends = filterByName(friends, search.value);

  return friends;
});

const openSearchUsers = async () => {
  const overlay = useOverlay();

  const modal = overlay.create(FriendSearchUser);

  modal.open();
};

const createChat = async (friend: IUser) => {
  try {
    const response = await $fetch<IChatSingleResponse>("/api/chats/chat", {
      method: "POST",
      body: {
        friendId: friend._id,
      },
    });

    if (!response.success) throw response;

    openChat(response.chat, true);
  } catch (error: any) {
    console.log(`${error.data.statusCode} - ${error.data.message}`);
  }
};

const openChat = async (chat: IChat, refresh = false) => {
  setActiveChat(chat);
  emit("toggleList", "chatsList");

  if (refresh) {
    await refreshNuxtData("chats");
  }
};
</script>

<style scoped></style>
