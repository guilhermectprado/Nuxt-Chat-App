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

      <UPopover>
        <UButton icon="lucide:bell" variant="ghost" color="neutral" size="xl" />

        <template #content>
          <div class="w-80 p-2">
            <ul v-if="status === 'pending'" class="flex flex-col gap-1">
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

            <ul v-if="data" class="flex flex-col gap-1">
              <p v-if="data.count === 0">Nenhum convite pendente.</p>

              <li
                v-else
                v-for="invite in data?.data"
                @key="invite._id"
                class="p-2 rounded hover:bg-neutral-800"
              >
                <div class="flex items-center justify-between gap-1">
                  <UUser
                    :name="invite.fullName"
                    :description="invite.username"
                    :avatar="{
                      src: invite.profileImage,
                      icon: 'i-lucide-image',
                    }"
                    size="xl"
                  />

                  <div class="space-x-2">
                    <UButton
                      icon="lucide:x"
                      size="sm"
                      variant="subtle"
                      color="error"
                      @click="updateInvite(invite._id, 'reject')"
                      :loading="loadingInvites[invite._id]?.reject"
                      :disabled="
                        loadingInvites[invite._id]?.accept ||
                        loadingInvites[invite._id]?.reject
                      "
                    />
                    <UButton
                      icon="lucide:check"
                      size="sm"
                      variant="subtle"
                      @click="updateInvite(invite._id, 'accepted')"
                      :loading="loadingInvites[invite._id]?.accept"
                      :disabled="
                        loadingInvites[invite._id]?.accept ||
                        loadingInvites[invite._id]?.reject
                      "
                    />
                  </div>
                </div>
              </li>
            </ul>

            <div v-if="error">
              <p>{{ (error as any).data.message }}</p>
            </div>
          </div>
        </template>
      </UPopover>

      <UButton
        :icon="
          showComponent === 'friendsList'
            ? 'lucide:arrow-big-left'
            : 'lucide:message-square-plus'
        "
        variant="ghost"
        size="xl"
        color="neutral"
        @click="
          showComponent === 'friendsList'
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

const loadingInvites = ref<
  Record<string, { accept: boolean; reject: boolean }>
>({});

const { data, status, error } = await useFetch("/api/friendship/invite", {
  method: "GET",
  key: "listInvite",
});

const updateInvite = async (userId: string, status: string) => {
  const action = status === "accepted" ? "accept" : "reject";

  try {
    if (!loadingInvites.value[userId]) {
      loadingInvites.value[userId] = { accept: false, reject: false };
    }

    loadingInvites.value[userId][action] = true;

    const response = await $fetch("/api/friendship/update-invite", {
      method: "PATCH",
      body: {
        fromUserId: userId,
        status: status,
      },
    });

    if (!response.success) throw response;

    if (data.value?.data) {
      data.value.data = data.value.data.filter(
        (invite) => invite._id !== userId
      );
    }

    let messageToast = "Pedido de amizade rejeitado.";

    if (status === "accepted") {
      messageToast = "Pedido de amizade aceito.";
      await refreshNuxtData("friends");
    }

    showToast(messageToast, "", "lucide:check-check", "success");
  } catch (error: any) {
    showToast(
      error.data.statusCode,
      error.data.message,
      "material-material-symbols-light:error",
      "error"
    );
  } finally {
    if (loadingInvites.value[userId]) {
      loadingInvites.value[userId][action] = false;
    }
  }
};
</script>

<style scoped></style>
