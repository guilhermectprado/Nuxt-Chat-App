<template>
  <div class="w-full h-dvh flex flex-col justify-center items-center space-y-6">
    <h1>Cadastrar</h1>

    <UForm
      :validate="validate"
      :state="loginForm"
      @submit="onSubmit"
      :loadingAuto="loading"
      class="min-w-64 w-80 space-y-4"
    >
      <UFormField label="Nome e Sobrenome" name="fullName">
        <UInput
          v-model="loginForm.fullName"
          icon="material-symbols:mail-outline-rounded"
          size="lg"
          class="w-full"
        />
      </UFormField>

      <UFormField label="Nome de usuário" name="username">
        <UInput
          v-model="loginForm.username"
          icon="material-symbols:mail-outline-rounded"
          size="lg"
          class="w-full"
        />
      </UFormField>

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
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              :aria-pressed="showPassword"
              aria-controls="password"
              @click="showPassword = !showPassword"
            />
          </template>
        </UInput>
      </UFormField>

      <UFormField label="Confirme a senha" name="confirmPassword">
        <UInput
          v-model="confirmPassword"
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
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              :aria-pressed="showPassword"
              aria-controls="password"
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

      <UAlert
        v-if="errorMessage"
        :description="errorMessage"
        color="error"
        close
        @update:open="errorMessage = ''"
        :ui="{ close: 'text-white' }"
      />
    </UForm>
  </div>
</template>

<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "@nuxt/ui";

const loginForm = reactive({
  fullName: "",
  username: "",
  email: "",
  password: "",
});

const showPassword = ref(false);
const loading = ref(false);
const errorMessage = ref<string>("");
const confirmPassword = ref<string>("");

const validate = (loginForm: any): FormError[] => {
  const errors = [];

  if (!loginForm.fullName)
    errors.push({ name: "fullName", message: "Insira seu nome e sobrenome." });

  if (!loginForm.username)
    errors.push({ name: "username", message: "Insira um nome de usuário." });

  if (!loginForm.email)
    errors.push({ name: "email", message: "Insira um e-mail." });

  if (!loginForm.password)
    errors.push({ name: "password", message: "Insira uma senha." });

  if (loginForm.password.length < 8)
    errors.push({ name: "password", message: "Mínimo de 8 caracteres." });

  if (confirmPassword.value.length < 8)
    errors.push({ name: "confirmPassword", message: "Confirme a sua senha." });

  if (confirmPassword.value !== loginForm.password)
    errors.push({
      name: "confirmPassword",
      message: "Senha e confirmação de senha são diferentes.",
    });

  return errors;
};

async function onSubmit(event: FormSubmitEvent<typeof loginForm>) {
  try {
    loading.value = true;

    const { data, status } = await useFetch("/api/auth/signup", {
      method: "POST",
      body: loginForm,
    });

    console.log(status);
    console.log(data);
    errorMessage.value = "";
    // navigateTo("/");
  } catch (error: any) {
    console.log(error);
    errorMessage.value = error;
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped></style>
