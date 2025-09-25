<template>
  <aside
    class="flex flex-col justify-between p-4 gap-4 border-e border-indigo-400"
  >
    <header class="flex items-center justify-between">
      <div class="flex gap-1 items-center">
        <UUser
          :name="userStore.user?.fullName"
          :description="userStore.user?.username"
          :avatar="{
            src: userStore.user?.profileImage,
            icon: 'i-lucide-image',
          }"
          size="xl"
        />
      </div>

      <div class="flex gap-4">
        <UColorModeButton />

        <UButton
          :icon="
            showComponent === 'friendsList'
              ? 'lucide:arrow-big-left'
              : 'lucide:message-square-plus'
          "
          variant="ghost"
          color="neutral"
          @click="
            showComponent === 'friendsList'
              ? toggleList('chatsList')
              : toggleList('friendsList')
          "
        />
        <!-- <UButton icon="lucide:settings-2" variant="ghost" color="neutral" /> -->
      </div>
    </header>

    <main class="flex-1">
      <SidebarChatList v-show="showComponent === 'chatsList'" />

      <SidebarFriendList
        v-show="showComponent === 'friendsList'"
        @toggleList="toggleList"
      />
    </main>

    <footer class="flex justify-center">
      <UButton
        @click="logout"
        variant="subtle"
        icon="lucide:log-out"
        color="neutral"
        label="Sair"
      />
    </footer>
  </aside>
</template>

<script setup lang="ts">
import { useUserStore } from "~/store/useUserStore";

const userStore = useUserStore();

const logout = async () => {
  try {
    const response = await $fetch("/api/auth/logout", {
      method: "POST",
    });

    if (!response.success) throw response;

    userStore.clearUser();
    navigateTo("/login");
  } catch (error: any) {
    console.error(`${error.data.statusCode} - ${error.data.message}`);
  }
};

const showComponent = ref<string>("chatsList");

const toggleList = (toggle: string) => {
  showComponent.value = toggle;
};
</script>

<style scoped></style>
