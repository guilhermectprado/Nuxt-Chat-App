<template>
  <UPopover>
    <UButton
      icon="lucide:bell"
      variant="ghost"
      color="neutral"
      size="xl"
      class="relative"
    >
      <div
        v-if="countPendingInvite > 0"
        class="absolute -top-2 -right-0.5 size-5 p-2 rounded-full bg-primary-700 flex items-center justify-center"
      >
        {{ countPendingInvite }}
      </div>
    </UButton>

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
            :key="invite._id"
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
</template>

<script setup lang="ts">
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

      data.value.count -= 1;
      countPendingInvite.value -= 1;
    }

    let messageToast = "Pedido de amizade rejeitado.";

    if (status === "accepted") {
      messageToast = "Pedido de amizade aceito.";
      await refreshNuxtData("friends");
    }

    showToast(messageToast, "", "lucide:check", "success");
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

const { socket } = useSocketComposable();

const countPendingInvite = ref<number>(0);

onMounted(() => {
  if (socket) {
    socket.off("new-invite");

    socket.on("new-invite", (invite) => {
      if (data.value) {
        data.value.data.unshift(invite);
        data.value.count += 1;
        countPendingInvite.value += 1;
      }

      showToast(
        "Você tem um novo pedido de amizade.",
        "",
        "lucide:user-plus",
        "success"
      );
    });

    socket.on("new-friend", (message) => {
      showToast(message, "", "lucide:user-round", "success");
    });
  }
});

onUnmounted(() => {
  if (socket) {
    socket.off("new-invite");
  }
});
</script>

<style scoped></style>
