import { useUserStore } from "~/store/useUserStore";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const userStore = useUserStore();
  const publicRoutes = ["/login", "/signup"];
  const isPublicRoute = publicRoutes.includes(to.path);

  if (isPublicRoute && !userStore.isAuthenticated) {
    return;
  }

  if (userStore.isAuthenticated && isPublicRoute) {
    return navigateTo("/");
  }

  try {
    const { data, error } = await useFetch("/api/auth/check");

    if (error.value) {
      throw error.value;
    }

    if (data.value?.user) {
      userStore.setUser(data.value.user);

      if (isPublicRoute) {
        return navigateTo("/");
      }
      return;
    }
  } catch (error: any) {
    console.error("Erro na verificação de autenticação:", error);
    userStore.clearUser();

    if (!isPublicRoute) {
      return navigateTo("/login");
    }
  }
});
