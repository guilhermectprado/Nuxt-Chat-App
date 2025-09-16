import { userRepository } from "~~/server/repositories/user.repository";

export default defineEventHandler(async (event) => {
  try {
    const userId = getIdUser(event);
    const user = await userRepository.findById(userId);

    if (!user) {
      throw createError({
        statusCode: 404,
        message: "Usuário não encontrado.",
      });
    }

    return {
      success: true,
      user,
    };
  } catch (error: any) {
    if (error.statusCode && error.statusCode !== 500) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      message: "Erro na busca de usuários",
    });
  }
});
