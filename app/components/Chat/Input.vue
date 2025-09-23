<template>
  <footer
    class="flex gap-2 items-end border-t border-gray-200 dark:border-gray-700 p-4 rounded-b"
  >
    <div class="flex flex-1 gap-2 items-end">
      <UFileUpload
        v-model="imagePreview"
        accept="image/*"
        :variant="imagePreview ? 'area' : 'button'"
        @update:model-value="handleImage"
      />

      <UTextarea
        v-model="messageInput"
        :rows="1"
        :maxrows="4"
        autoresize
        class="flex-1"
        placeholder="Digite sua mensagem..."
        @keydown.enter.prevent="sendMessage"
      />
    </div>
    <UButton
      icon="lucide:send"
      @click="sendMessage"
      :disabled="!messageInput.trim()"
    />
  </footer>
</template>

<script setup lang="ts">
import type { IMessagePostResponse } from "~/types/message.type";
const { activeChat } = useChatComposable();

const emit = defineEmits(["message-sent"]);

interface IBody {
  image?: string;
  text?: string;
}

const chatId = ref(activeChat.value?._id);
const messageInput = ref<string>("");

const imagePreview = ref<File | null>(null);
const imageBase64 = ref<string>("");

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

const sendMessage = async () => {
  if (!messageInput.value.trim() && !imageBase64.value.trim()) return;

  try {
    let body: IBody = {};

    if (messageInput.value) body.text = messageInput.value;
    if (imagePreview.value) body.image = imageBase64.value;

    const response = await $fetch<IMessagePostResponse>(
      `/api/messages/${chatId.value}/send`,
      {
        method: "POST",
        body: body,
      }
    );

    if (!response.success) throw response;

    messageInput.value = "";
    imagePreview.value = null;
    imageBase64.value = "";
  } catch (error: any) {
    console.log(
      `${error.status || "Erro"} - ${error.message || "Erro desconhecido"}`
    );
  }
};
</script>

<style scoped></style>
