<template>
  <div class="flex items-center justify-between">
    <div class="flex gap-1 items-start">
      <UUser
        :name="user?.fullName"
        :description="user?.username"
        :avatar="{
          src: user?.profileImage,
          icon: 'i-lucide-image',
        }"
        size="xl"
      />

      <UButton
        icon="lucide:settings-2"
        variant="ghost"
        color="neutral"
        size="sm"
        @click="openEditProfile"
      />
    </div>

    <div class="flex gap-4">
      <!-- <UColorModeButton /> -->

      <SidebarHeaderInvite />
      <UButton
        :icon="
          props.showComponent === 'friendsList'
            ? 'lucide:arrow-big-left'
            : 'lucide:message-square-plus'
        "
        variant="ghost"
        size="xl"
        color="neutral"
        @click="
          props.showComponent === 'friendsList'
            ? emit('toggle', 'chatsList')
            : emit('toggle', 'friendsList')
        "
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ProfileRoot } from "#components";
import { useUserStore } from "~/store/useUserStore";

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const emit = defineEmits(["toggle"]);

const props = defineProps({
  showComponent: {
    type: String,
    required: true,
  },
});

const openEditProfile = async () => {
  const overlay = useOverlay();

  const modal = overlay.create(ProfileRoot);

  modal.open();
};
</script>

<style scoped></style>
