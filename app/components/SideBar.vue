<template>
  <section class="flex-1 space-y-4 p-2">
    <div class="flex justify-between items-center gap-4">
      <h1>Chats</h1>
      <UButton icon="lucide:plus" label="Adicionar" />
    </div>

    <UTabs color="neutral" variant="link" :content="false" :items="items" />

    <ul class="flex flex-col gap-4">
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

    <UInput v-model="search" />
    {{ search }}
    {{ data }}
    {{ status }}
  </section>
</template>

<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";

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

const search = ref<string>("teste");

const { data, status, pending } = useAsyncData(
  "search-key",
  async () => {
    return await $fetch("/api/user/search", {
      query: {
        // ✅ CORRETO - usa "query" não "params"
        user: search.value,
      },
    });
  },
  {
    watch: [search],
    immediate: true,
  }
);
</script>

<style scoped></style>
