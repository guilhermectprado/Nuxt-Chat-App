<template>
  <section class="flex-1 space-y-4 p-2">
    <div class="flex justify-between items-center gap-4">
      <h1>Chats</h1>
      <UButton
        icon="lucide:user-round-plus"
        label="Adicionar Amigo"
        size="sm"
        variant="ghost"
        @click="openSearchUsers"
      />
    </div>

    <UInput v-model="search" icon="lucide:user-search" class="w-full" />

    <UTabs color="neutral" variant="link" :content="false" :items="items" />

    <ul v-if="status === 'pending'" class="flex flex-col gap-4">
      <li v-for="index in 5" :key="index">
        <div class="flex items-center gap-4">
          <USkeleton class="h-12 w-12 rounded-full" />

          <div class="grid gap-2">
            <USkeleton class="h-4 w-[250px]" />
            <USkeleton class="h-4 w-[200px]" />
          </div>
        </div>
      </li>
    </ul>

    <ul v-else-if="data" class="flex flex-col gap-4">
      <p v-if="data.count === 0">Nenhum amigo encontrado.</p>

      <li v-else v-for="(friend, index) in data.friends" :key="index">
        <div class="flex items-center gap-2">
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

    <div v-if="error">
      <p>{{ (error as any).data.message }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";
import { SearchUser } from "#components";

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

const { data, status, error } = await useFetch("/api/friendship/list");

const search = ref<string>("");

const openSearchUsers = async () => {
  const overlay = useOverlay();

  const modal = overlay.create(SearchUser);

  modal.open();
};
</script>

<style scoped></style>
