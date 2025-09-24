<template>
  <section class="space-y-3">
    <header class="flex flex-col gap-3">
      <UInput
        v-model="search"
        icon="lucide:user-search"
        class="w-full"
        placeholder="Buscar amigos..."
      />

      <div class="flex gap-3 w-full">
        <UButton
          icon="lucide:user-round-plus"
          label="Novo Contato"
          variant="subtle"
          @click="openSearchUsers"
          class="flex-1 justify-center"
        />
        <UButton
          icon="lucide:users-round"
          label="Novo Grupo"
          variant="subtle"
          @click="openCreateGroup"
          class="flex-1 justify-center"
        />
      </div>

      <USeparator />
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

      <ul v-else-if="data" class="flex flex-col gap-1">
        <p v-if="data.count === 0">Nenhum amigo encontrado.</p>

        <li
          v-else
          v-for="(friend, index) in filteredFriends"
          :key="index"
          @click="createChat(friend)"
          class="flex items-center gap-2 p-4 rounded hover:bg-neutral-800 cursor-pointer"
        >
          <UUser
            :name="friend.fullName"
            :description="friend.username"
            :avatar="{
              src: friend.profileImage,
              icon: 'i-lucide-image',
            }"
            size="xl"
          />
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
import { SidebarCreateGroup, SidebarSearchUser } from "#components";
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

  const modal = overlay.create(SidebarSearchUser);

  modal.open();
};

const openCreateGroup = async () => {
  const overlay = useOverlay();

  const modal = overlay.create(SidebarCreateGroup);

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
