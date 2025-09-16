<template>
  <UModal title="Buscar usuário">
    <template #body>
      <div class="space-y-4">
        <UInput
          v-model="searchInput"
          icon="lucide:user-search"
          class="w-full"
        />

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
          <p v-if="data.count === 0">Nenhum usuário encontrado.</p>

          <li
            v-else
            v-for="(searchedUser, index) in data.users"
            :key="index"
            class=""
          >
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <UAvatar
                  :src="
                    searchedUser.profileImage
                      ? searchedUser.profileImage
                      : '/image.png'
                  "
                  size="2xl"
                />
                <div class="mb-1">
                  <h1 class="font-medium">{{ searchedUser.fullName }}</h1>
                  <p class="text-sm text-muted">{{ searchedUser.username }}</p>
                </div>
              </div>

              <div>
                <UButton
                  v-if="searchedUser.relation === 'none'"
                  icon="lucide:plus"
                  size="sm"
                  variant="subtle"
                  @click="sendInviteToFriend(searchedUser._id)"
                  :loading="loadingInvite[searchedUser._id]"
                />
                <p v-if="searchedUser.relation === 'friends'">Amigo</p>
                <p v-if="searchedUser.relation === 'pending_sent'">
                  Solicitação pendente.
                </p>
                <div v-if="searchedUser.relation === 'pending_received'">
                  <UButton icon="lucide:check" size="sm" variant="subtle" />
                  <UButton icon="lucide:x" size="sm" variant="subtle" />
                </div>
              </div>
            </div>
          </li>
        </ul>

        <div v-if="error">
          <p>{{ (error as any).data.message }}</p>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const searchInput = ref<string>("");
const search = ref<string>("");

const { data, status, error } = await useFetch("/api/user/search", {
  query: computed(() => ({ user: search.value })),
  watch: [search],
});

const debouncedSearch = useDebounceFn((value: string) => {
  search.value = value;
}, 500);

watch(searchInput, (newValue) => {
  if (!searchInput) return;

  debouncedSearch(newValue);
});

const loadingInvite = ref<Record<string, boolean>>({});

const sendInviteToFriend = async (userId: string) => {
  try {
    loadingInvite.value[userId] = true;

    const { error } = useFetch("/api/friendship/invite", {
      method: "POST",
      body: {
        toUserId: userId,
      },
    });

    if (error.value) {
      throw error.value;
    }

    const userInvited = data.value?.users.find((user) => user._id === userId);
    if (userInvited) userInvited.relation = "pending_sent";
  } catch (error: any) {
    let errorMessage = `${error.data.statusCode} - ${error.data.message}`;
    console.log(errorMessage);
  } finally {
    loadingInvite.value[userId] = false;
  }
};
</script>

<style scoped></style>
