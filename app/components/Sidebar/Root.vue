<template>
  <aside
    class="flex flex-col justify-between p-4 gap-4 border-e border-indigo-400"
  >
    <header class="flex items-center justify-between">
      <div class="flex gap-1 items-center">
        <UAvatar src="/image.png" size="2xl" />

        <div class="flex flex-col">
          <div class="font-medium">
            {{ userStore.user?.fullName }}
          </div>
          <div class="text-muted text-xs">
            {{ userStore.user?.username }}
          </div>
        </div>
      </div>

      <UButton
        icon="lucide:settings-2"
        label="Configurações"
        variant="ghost"
        color="neutral"
      />
    </header>

    <main class="flex-1">
      <SidebarChatList
        v-show="showComponent === 'chatsList'"
        @toggleList="toggleList"
      />

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
    console.log(`${error.data.statusCode} - ${error.data.message}`);
  }
};

const showComponent = ref<string>("chatsList");

const toggleList = (toggle: string) => {
  showComponent.value = toggle;
};
</script>

<style scoped></style>
