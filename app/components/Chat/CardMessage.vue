<template>
  <div
    class="w-full flex gap-2"
    :class="
      message.sender._id === currentUserId ? 'justify-end' : 'justify-start'
    "
  >
    <UAvatar
      v-if="props.isGroup && message.sender._id !== currentUserId"
      :src="message.sender.profileImage"
      icon="i-lucide:image"
      class="mt-1"
    />

    <div
      class="max-w-2/3 flex flex-col gap-2 py-2 px-3 rounded-lg wrap-break-word shadow-md"
      :class="
        message.sender._id === currentUserId
          ? 'bg-neutral-600 text-white'
          : 'bg-neutral-800 text-white'
      "
    >
      <h1
        v-if="props.isGroup && message.sender._id !== currentUserId"
        class="font-medium text-primary-500"
      >
        {{ message.sender.fullName }}
      </h1>

      <NuxtImg
        v-if="message.image"
        :src="message.image"
        alt="Imagem enviada"
        class="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity rounded mb-1"
        :sizes="'(max-width: 600px) 100vw, 300px'"
        style="aspect-ratio: auto; max-height: 300px; object-fit: cover"
      />

      <p>
        {{ message.text }}
      </p>

      <div class="text-xs text-muted text-end">
        {{ formatTime(message.createdAt) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import { useUserStore } from "~/store/useUserStore";

const userStore = useUserStore();

const props = defineProps({
  isGroup: {
    type: Boolean,
    required: true,
  },
  message: {
    type: {} as PropType<any>,
    required: true,
  },
});

const currentUserId = computed(() => {
  return userStore.user?._id || "";
});
</script>

<style scoped></style>
