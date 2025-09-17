<template>
  <aside class="space-y-4 p-4 border-e border-indigo-400">
    <header class="flex justify-between items-center gap-4">
      <h1>Chats</h1>
      <UButton
        icon="lucide:user-round-plus"
        label="Adicionar Amigo"
        size="sm"
        variant="ghost"
        @click="openSearchUsers"
      />
    </header>

    <section class="space-y-4">
      <UInput v-model="search" icon="lucide:user-search" class="w-full" />

      <UTabs color="neutral" variant="link" :content="false" :items="items" />

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

        <li v-else v-for="(friend, index) in filteredFriends" :key="index">
          <div
            class="flex items-center gap-2 p-4 rounded"
            @click="openChat(friend)"
            :class="{
              'bg-primary-100 dark:bg-gray-700': activeChat?._id === friend._id,
              'hover:bg-gray-100 dark:hover:bg-gray-800':
                activeChat?._id !== friend._id,
            }"
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
          </div>
        </li>
      </ul>

      <div v-else-if="error">
        <p>{{ (error as any).data.message }}</p>
      </div>
    </section>
  </aside>
</template>

<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";
import { SidebarSearchUser } from "#components";
import type { IUser } from "~/types/user.type";
import type { IFriendshipListResponse } from "~/types/friendship.type";
const { setActiveChat, activeChat } = useActiveChat();

const items = ref<TabsItem[]>([
  {
    label: "Tudo",
  },
  {
    label: "Amigos",
  },
  {
    label: "Grupos",
  },
]);

const search = ref<string>("");

// Isso é lista de amigos e não de chat!
const { data, status, error, refresh } =
  await useFetch<IFriendshipListResponse>("/api/friendship/list");

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

  const modal = overlay.create(SidebarSearchUser);

  modal.open({
    onFriendshipUpdated: refresh,
  });
};

const openChat = (friend: any) => {
  setActiveChat(friend);
};
</script>

<style scoped></style>
