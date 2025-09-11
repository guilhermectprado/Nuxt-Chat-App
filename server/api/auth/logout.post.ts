export default defineEventHandler(async (event) => {
  try {
    deleteCookie(event, "jwt");

    setResponseStatus(event, 200);

    return {
      success: true,
      message: "Logout realizado com sucesso.",
    };
  } catch (error: any) {
    if (error.statusCode && error.statusCode !== 500) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      message: "Login - Erro no Servidor",
    });
  }
});
