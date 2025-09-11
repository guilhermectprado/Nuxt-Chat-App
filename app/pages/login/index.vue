<template>
  <div class="w-full h-dvh flex flex-col justify-center items-center space-y-6">
    <h1>Login</h1>

    <UForm
      :validate="validate"
      :state="loginForm"
      @submit="onSubmit"
      :loadingAuto="loading"
      class="min-w-64 w-80 space-y-4"
    >
      <UFormField label="E-mail" name="email">
        <UInput
          v-model="loginForm.email"
          icon="material-symbols:mail-outline-rounded"
          size="lg"
          class="w-full"
        />
      </UFormField>

      <UFormField label="Senha" name="password">
        <UInput
          v-model="loginForm.password"
          :type="showPassword ? 'text' : 'password'"
          size="lg"
          icon="material-symbols:password-rounded"
          class="w-full"
          :ui="{ trailing: 'pe-1' }"
        >
          <template #trailing>
            <UButton
              color="neutral"
              variant="link"
              :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              :aria-label="showPassword ? 'Esconder senha' : 'Mostrar senha'"
              :aria-pressed="showPassword"
              aria-controls="senha"
              @click="showPassword = !showPassword"
            />
          </template>
        </UInput>
      </UFormField>

      <UButton
        type="submit"
        :loading="loading"
        label="Entrar"
        size="lg"
        class="w-full flex justify-center"
      />

      <div class="w-full flex justify-end">
        <NuxtLink to="/signup">Cadastrar</NuxtLink>
      </div>

      <UAlert
        v-if="errorMessage"
        :description="errorMessage"
        color="error"
        close
        @update:open="errorMessage = ''"
      />
    </UForm>
  </div>
</template>

<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "@nuxt/ui";
import { useUserStore } from "~/store/useUserStore";

const loginForm = reactive({
  email: "",
  password: "",
});

const showPassword = ref(false);
const loading = ref(false);
const errorMessage = ref<string>("");

const validate = (loginForm: any): FormError[] => {
  const errors = [];

  if (!loginForm.email)
    errors.push({ name: "email", message: "Insira um e-mail." });

  if (!loginForm.password)
    errors.push({ name: "password", message: "Insira uma senha." });

  if (loginForm.password.length < 8)
    errors.push({ name: "password", message: "Mínimo de 8 caracteres." });

  return errors;
};

async function onSubmit(event: FormSubmitEvent<typeof loginForm>) {
  try {
    loading.value = true;
    errorMessage.value = "";

    const response = await $fetch("/api/auth/login", {
      method: "POST",
      body: loginForm,
    });

    if (!response.success) throw response;

    useUserStore().setUser(response.user);
    navigateTo("/");
  } catch (error: any) {
    errorMessage.value = `${error.data.statusCode} - ${error.data.message}`;
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped></style>
