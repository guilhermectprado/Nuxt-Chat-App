<template>
  <UModal title="Criar grupo">
    <template #body>
      <UForm
        :validate="validate"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
        @error="onError"
      >
        <UFormField name="imagePreview" class="flex justify-center">
          <UFileUpload
            v-model="state.imagePreview"
            accept="image/*"
            @update:model-value="handleImage"
            class="self-center w-32 h-32"
          />
        </UFormField>

        <UFormField label="Nome do grupo" name="groupName" required>
          <UInput
            v-model="state.groupName"
            icon="lucide:tag"
            class="w-full"
            placeholder="Nome do grupo"
            size="lg"
          />
        </UFormField>

        <UFormField label="Amigos" name="selectedUsers" required>
          <USelectMenu
            v-model="state.selectedUsers"
            :items="listFriendsToSelect"
            icon="i-lucide:users-round"
            class="w-full"
            multiple
            size="lg"
            placeholder="Selecionar amigos"
            :loading="status === 'pending'"
          />
        </UFormField>

        <div class="w-full flex justify-between gap-4">
          <UButton
            variant="ghost"
            label="Cancelar"
            color="neutral"
            @click="emit('close', false)"
          />
          <UButton variant="solid" label="Criar" type="submit" />
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { IFriendshipListResponse } from "~/types/friendship.type";
import type { FormError, FormErrorEvent, FormSubmitEvent } from "@nuxt/ui";
import type { ToastProps } from "@nuxt/ui";
const toast = useToast();

const emit = defineEmits(["close"]);

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

interface UserItem {
  label: string;
  value: string;
  avatar: {
    src: string;
    alt: string;
  };
}

const listFriendsToSelect = ref<UserItem[]>([]);
const imageBase64 = ref<string>("");
const state = reactive({
  imagePreview: undefined,
  groupName: undefined,
  selectedUsers: [],
});

const { data: friends, status } = await useFetch<IFriendshipListResponse>(
  "/api/friendship/list",
  {
    key: "friends",
  }
);

watch(
  () => friends,
  (newStatus) => {
    if (newStatus.value) {
      listFriendsToSelect.value = newStatus.value.data.map((friend) => ({
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

const validate = (state: any): FormError[] => {
  const errors = [];

  if (!state.groupName || state.groupName.trim() === "") {
    errors.push({ name: "groupName", message: "Nome do grupo é obrigatório" });
  }

  if (!state.selectedUsers || state.selectedUsers.length === 0) {
    errors.push({
      name: "selectedUsers",
      message: "Selecione pelo menos um amigo",
    });
  }

  return errors;
};

const handleImage = async (file: File | null | undefined) => {
  if (!file) {
    imageBase64.value = "";
    return;
  }

  if (!file.type.startsWith("image/")) {
    state.imagePreview = undefined;
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

async function onError(event: FormErrorEvent) {
  if (event?.errors?.[0]?.id) {
    const element = document.getElementById(event.errors[0].id);
    element?.focus();
    element?.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

async function onSubmit(event: FormSubmitEvent<typeof state>) {
  let bodyAux = {
    name: event.data.groupName,
    image: imageBase64.value,
    participants: event.data.selectedUsers.map((user: UserItem) => user.value),
    // isPublic: false,
  };

  try {
    const response = await $fetch("/api/chats/group", {
      method: "POST",
      body: bodyAux,
    });

    if (!response.success) throw response;

    showToast(response.message, "", "lucide:check", "success");

    await refreshNuxtData("chats");

    emit("close");
  } catch (error: any) {
    showToast(
      error.data.statusCode,
      error.data.message,
      "material-material-symbols-light:error",
      "error"
    );
  } finally {
  }
}
</script>
