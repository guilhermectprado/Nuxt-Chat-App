import { userRepository } from "../../repositories/user.repository";
import { getIdUser } from "~~/server/utils/getIdUser";

export default defineEventHandler(async (event) => {
  try {
    const userId = getIdUser(event);

    const user = await userRepository.findById(userId);

    if (!user) {
      throw createError({
        statusCode: 401,
        message: "Usuário não encontrado",
      });
    }

    return {
      success: true,
      user,
      isAuthenticated: true,
    };
  } catch (error: any) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      deleteCookie(event, "jwt");
      throw createError({
        statusCode: 401,
        message: "Token inválido ou expirado",
      });
    }

    if (error.statusCode && error.statusCode !== 500) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      message: "Erro interno do servidor",
    });
  }
});
