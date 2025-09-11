<template>
  <div class="w-full h-dvh flex flex-col justify-center items-center space-y-6">
    <UForm
      :validate="validate"
      :state="loginForm"
      @submit="onSubmit"
      :loadingAuto="loading"
      class="min-w-64 w-80 space-y-4"
    >
      <UFormField label="E-mail" name="email" required>
        <UInput
          v-model="loginForm.email"
          icon="material-symbols:mail-outline-rounded"
          size="lg"
          class="w-full"
        />
      </UFormField>

      <UFormField label="Senha" name="senha" required>
        <UInput
          v-model="loginForm.senha"
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

      <div class="w-full flex justify-end">
        <NuxtLink to="/signup">Cadastrar</NuxtLink>
      </div>

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
  email: "",
  senha: "",
});

const showPassword = ref(false);
const loading = ref(false);
const errorMessage = ref<string>("");

const validate = (loginForm: any): FormError[] => {
  const errors = [];

  if (!loginForm.email)
    errors.push({ name: "email", message: "Insira um e-mail." });

  if (!loginForm.senha)
    errors.push({ name: "senha", message: "Insira uma senha." });

  if (loginForm.senha.length < 8)
    errors.push({ name: "senha", message: "Mínimo de 8 caracteres." });

  return errors;
};

async function onSubmit(event: FormSubmitEvent<typeof loginForm>) {
  try {
    loading.value = true;

    const { data, status } = await useFetch("/api/auth/login", {
      method: "POST",
      body: loginForm,
    });

    errorMessage.value = "";
    navigateTo("/");
  } catch (error: any) {
    console.log(error);
    errorMessage.value = error;
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped></style>
