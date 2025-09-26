<template>
  <UModal title="Buscar usuário">
    <template #body>
      <div class="space-y-4">
        <UInput
          v-model="searchInput"
          icon="lucide:user-search"
          class="w-full"
        />

        <ul v-if="loading" class="flex flex-col gap-1">
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
          <p v-if="data.count === 0">Nenhum usuário encontrado.</p>

          <li
            v-else
            v-for="(searchedUser, index) in data.users"
            :key="index"
            class="p-4 rounded hover:bg-neutral-800"
          >
            <div class="flex items-center justify-between gap-1">
              <UUser
                :name="searchedUser.fullName"
                :description="searchedUser.username"
                :avatar="{
                  src: searchedUser.profileImage,
                  icon: 'i-lucide-image',
                }"
                size="xl"
              />

              <div>
                <UButton
                  v-if="searchedUser.relation === 'reject'"
                  icon="lucide:plus"
                  size="sm"
                  variant="subtle"
                  label="Adicionar"
                  @click="sendInviteToFriend(searchedUser._id)"
                  :loading="loadingInvite[searchedUser._id]"
                />
                <p v-if="searchedUser.relation === 'friends'">Amigo</p>
                <p
                  v-if="searchedUser.relation === 'pending_sent'"
                  class="text-muted text-sm"
                >
                  Solicitação pendente.
                </p>
                <div
                  v-if="searchedUser.relation === 'pending_received'"
                  class="space-x-2"
                >
                  <UButton
                    icon="lucide:x"
                    size="sm"
                    variant="subtle"
                    color="error"
                    @click="updateInvite(searchedUser._id, 'reject')"
                    :loading="loadingUpdateInvites[searchedUser._id]?.reject"
                    :disabled="
                      loadingUpdateInvites[searchedUser._id]?.accept ||
                      loadingUpdateInvites[searchedUser._id]?.reject
                    "
                  />
                  <UButton
                    icon="lucide:check"
                    size="sm"
                    variant="subtle"
                    @click="updateInvite(searchedUser._id, 'accepted')"
                    :loading="loadingUpdateInvites[searchedUser._id]?.accept"
                    :disabled="
                      loadingUpdateInvites[searchedUser._id]?.accept ||
                      loadingUpdateInvites[searchedUser._id]?.reject
                    "
                  />
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
import type { ToastProps } from "@nuxt/ui";
const toast = useToast();
const showToast = (
  title: string,
  description: string,
  icon: string,
  color: ToastProps["color"]
) => {
  toast.add({
    title: title,
    description: description,
    icon: icon,
    color: color,
  });
};

const searchInput = ref<string>("");
const loading = ref<boolean>(false);
const data = ref<any>(undefined);
const error = ref<any>(undefined);

const loadingInvite = ref<Record<string, boolean>>({});
const loadingUpdateInvites = ref<
  Record<string, { accept: boolean; reject: boolean }>
>({});

const searchUsers = async () => {
  try {
    loading.value = true;
    error.value = null;

    const response = await $fetch("/api/user/search", {
      query: { user: searchInput.value },
    });

    data.value = response || [];
  } catch (error: any) {
    data.value = [];
    error.value = `${error.data.statusCode} - ${error.data.message}`;
  } finally {
    loading.value = false;
  }
};

const sendInviteToFriend = async (userId: string) => {
  try {
    loadingInvite.value[userId] = true;

    const response = await $fetch("/api/friendship/invite", {
      method: "POST",
      body: {
        toUserId: userId,
      },
    });

    if (!response.success) throw response;

    const userInvited = data.value.users.find(
      (user: any) => user._id === userId
    );

    userInvited.relation = "pending_sent";
  } catch (error: any) {
    showToast(
      error.data.statusCode,
      error.data.message,
      "material-material-symbols-light:error",
      "error"
    );
  } finally {
    loadingInvite.value[userId] = false;
  }
};

const updateInvite = async (userId: string, status: string) => {
  const action = status === "accepted" ? "accept" : "reject";

  try {
    if (!loadingUpdateInvites.value[userId]) {
      loadingUpdateInvites.value[userId] = { accept: false, reject: false };
    }

    loadingUpdateInvites.value[userId][action] = true;

    const response = await $fetch("/api/friendship/update-invite", {
      method: "PATCH",
      body: {
        fromUserId: userId,
        status: status,
      },
    });

    if (!response.success) throw response;

    const userInvited = data.value.users.find(
      (user: any) => user._id === userId
    );

    if (status === "accepted") {
      userInvited.relation = "friends";
      await refreshNuxtData("friends");
    } else {
      userInvited.relation = "reject";
    }
  } catch (error: any) {
    showToast(
      error.data.statusCode,
      error.data.message,
      "material-material-symbols-light:error",
      "error"
    );
  } finally {
    if (loadingUpdateInvites.value[userId]) {
      loadingUpdateInvites.value[userId][action] = false;
    }
  }
};

const debouncedSearch = useDebounceFn(() => {
  searchUsers();
}, 500);

watch(searchInput, (newValue) => {
  if (!newValue || newValue.length < 2) {
    data.value = [];
    return;
  }
  debouncedSearch();
});
</script>

<style scoped></style>
