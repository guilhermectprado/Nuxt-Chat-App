<template>
  <UModal title="Criar grupo">
    <template #body>
      <div class="flex flex-col gap-6">
        <div class="flex flex-col gap-4">
          <UFileUpload
            v-model="imagePreview"
            accept="image/*"
            @update:model-value="handleImage"
            class="self-center w-32 h-32"
          />
          <UInput
            v-model="groupName"
            icon="lucide:tag"
            class="w-full"
            placeholder="Nome do grupo"
            size="lg"
          />
          <USelectMenu
            v-model="selectedUsers"
            :items="listFriendsToSelect"
            class="flex-1"
            multiple
            size="lg"
            placeholder="Selecionar usuários"
          />
        </div>

        <div class="w-full flex justify-between gap-4">
          <UButton variant="ghost" label="Cancelar" color="neutral" />
          <UButton variant="solid" label="Criar" />
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { IFriendshipListResponse } from "~/types/friendship.type";

interface UserItem {
  label: string;
  value: string;
  avatar: {
    src: string;
    alt: string;
  };
}

const listFriendsToSelect = ref<UserItem[]>([]);

const imagePreview = ref<File | null>(null);
const imageBase64 = ref<string>("");
const groupName = ref<string>("");
const selectedUsers = ref<UserItem[]>([]);

const handleImage = async (file: File | null | undefined) => {
  if (!file) {
    imageBase64.value = "";
    return;
  }

  if (!file.type.startsWith("image/")) {
    imagePreview.value = null;
    return;
  }

  const reader = new FileReader();

  reader.onloadend = () => {
    imageBase64.value = reader.result as string;
  };

  reader.onerror = () => {
    console.error("Erro ao ler arquivo");
  };

  reader.readAsDataURL(file);
};

const {
  data: friends,
  status,
  error,
  refresh,
} = await useFetch<IFriendshipListResponse>("/api/friendship/list", {
  key: "friends",
});

watch(
  () => friends,
  (newStatus) => {
    if (newStatus.value) {
      listFriendsToSelect.value = newStatus.value.friends.map((friend) => ({
        label: friend.fullName,
        value: friend._id,
        avatar: {
          src: friend.profileImage,
          alt: friend.fullName,
        },
      }));
    }
  },
  { immediate: true }
);
</script>
