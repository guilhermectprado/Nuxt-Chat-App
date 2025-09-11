export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie("access_token");

  if (!token.value && to.path !== "/login" && to.path !== "/signup") {
    return navigateTo("/login");
  }

  if (token.value && (to.path === "/login" || to.path === "/signup")) {
    return navigateTo("/");
  }
});
