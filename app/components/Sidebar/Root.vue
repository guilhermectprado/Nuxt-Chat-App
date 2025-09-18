<template>
  <aside class="space-y-4 p-4 border-e border-indigo-400">
    <ChatList v-show="showComponent === 'chatsList'" @toggleList="toggleList" />

    <FriendList
      v-show="showComponent === 'friendsList'"
      @toggleList="toggleList"
    />
  </aside>
</template>

<script setup lang="ts">
const showComponent = ref<string>("chatsList");

const toggleList = (toggle: string) => {
  showComponent.value = toggle;
};
</script>

<style scoped></style>
