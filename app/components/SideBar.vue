<template>
  <section class="flex-1 space-y-4 p-2">
    <div class="flex justify-between items-center gap-4">
      <h1>Chats</h1>
      <UButton
        icon="lucide:user-round-plus"
        label="Adicionar Amigo"
        size="sm"
        variant="ghost"
      />
    </div>

    <UInput v-model="searchInput" icon="lucide:user-search" class="w-full" />

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

const searchInput = ref<string>("");
const search = ref<string>("");

const { data, status, pending } = useAsyncData(
  `search-${search}`,
  async () => {
    return await $fetch("/api/user/search", {
      query: {
        user: search.value,
      },
    });
  },
  {
    watch: [search],
    immediate: true,
  }
);

const debouncedSearch = useDebounceFn((value: string) => {
  search.value = value;
}, 500);

watch(searchInput, (newValue) => {
  debouncedSearch(newValue);
});
</script>

<style scoped></style>
