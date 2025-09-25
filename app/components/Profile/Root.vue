<template>
  <UModal title="">
    <template #body>
      <div class="space-y-6">
        <div v-if="!isEnableEdit" class="flex justify-between items-start">
          <div class="flex gap-4 items-start">
            <UAvatar
              :src="userStore.user?.profileImage"
              icon="i-lucide:image"
              size="3xl"
              class="size-32 rounded"
            />

            <h1 class="font-medium flex flex-col text-2xl">
              {{ userStore.user?.fullName }}
              <span class="text-sm text-muted">
                {{ userStore.user?.username }}
              </span>
            </h1>
          </div>

          <UButton
            icon="lucide:pencil"
            label="Editar"
            variant="subtle"
            size="sm"
            class="mt-1"
            @click="isEnableEdit = true"
          />
        </div>

        <UForm
          :validate="validate"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
          @error="onError"
          :disabled="isLoading || !isEnableEdit"
        >
          <UFormField
            v-if="isEnableEdit"
            name="imagePreview"
            class="flex justify-center"
          >
            <UFileUpload
              v-model="state.image"
              accept="image/*"
              @update:model-value="handleImage"
              class="self-center size-32"
            />
          </UFormField>

          <UFormField label="Nome" name="fullName">
            <UInput
              v-model="state.fullName"
              icon="lucide:tag"
              class="w-full"
              placeholder="Nome"
              size="lg"
            />
          </UFormField>

          <UFormField label="Username" name="username">
            <UInput
              v-model="state.username"
              icon="lucide:tag"
              class="w-full"
              placeholder="Username"
              size="lg"
            />
          </UFormField>

          <UFormField label="E-mail" name="email">
            <UInput
              v-model="state.email"
              icon="lucide:mail"
              class="w-full"
              placeholder="E-mail"
              size="lg"
              :disabled="true"
            />
          </UFormField>

          <div class="w-full flex justify-between gap-4" v-if="isEnableEdit">
            <UButton
              variant="ghost"
              label="Cancelar"
              color="neutral"
              :disabled="isLoading"
              @click="cancelEdit"
            />
            <UButton
              variant="solid"
              label="Salvar"
              type="submit"
              :loading="isLoading"
            />
          </div>
        </UForm>

        <p v-if="!isEnableEdit" class="text-sm text-muted">
          Se registrou em
          <span class="">
            {{ formatDateTime(userStore.user?.createdAt || "") }}
          </span>
        </p>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { FormError, FormErrorEvent, FormSubmitEvent } from "@nuxt/ui";
import type { ToastProps } from "@nuxt/ui";
import { useUserStore } from "~/store/useUserStore";
import type { IUserPatchResponse } from "~/types/user.type";
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

const userStore = useUserStore();

const isEnableEdit = ref<boolean>(false);
const isLoading = ref<boolean>(false);

const imageBase64 = ref<string>("");
const state = reactive({
  image: undefined,
  fullName: userStore.user?.fullName || undefined,
  username: userStore.user?.username || undefined,
  email: userStore.user?.email || undefined,
});

const validate = (state: any): FormError[] => {
  const errors = [];

  if (!state.fullName || state.fullName.trim() === "") {
    errors.push({ name: "fullName", message: "Nome é obrigatório" });
  }

  if (!state.username || state.username.trim() === "") {
    errors.push({ name: "username", message: "Username é obrigatório" });
  }

  return errors;
};

const handleImage = async (file: File | null | undefined) => {
  if (!file) {
    imageBase64.value = "";
    return;
  }

  if (!file.type.startsWith("image/")) {
    state.image = undefined;
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
  const { email, image, ...restData } = state;

  const body = {
    ...restData,
    profileImage: imageBase64.value,
  };

  try {
    isLoading.value = true;

    const response = await $fetch<IUserPatchResponse>("/api/profile/update", {
      method: "PATCH",
      body: body,
    });

    if (!response.success) throw response;

    showToast(response.message, "", "lucide:check", "success");

    userStore.updateUser(response.data);
  } catch (error: any) {
    showToast(
      error.data.statusCode,
      error.data.message,
      "material-material-symbols-light:error",
      "error"
    );
  } finally {
    isEnableEdit.value = false;
    isLoading.value = false;
  }
}

const cancelEdit = () => {
  isEnableEdit.value = false;

  state.image = undefined;
  state.fullName = userStore.user?.fullName || undefined;
  state.username = userStore.user?.username || undefined;
  state.email = userStore.user?.email || undefined;

  imageBase64.value = "";
};
</script>
