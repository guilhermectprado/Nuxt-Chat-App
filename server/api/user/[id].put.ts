// server/api/users/[id].put.ts
import { userRepository } from "../../repositories/user.repository";

export default defineEventHandler(async (event) => {
  try {
    const userId = getRouterParam(event, "id");
    const body = await readBody(event);

    if (!userId) {
      throw createError({
        statusCode: 400,
        message: "ID do usuário é obrigatório",
      });
    }

    // Remover campos que não podem ser atualizados
    const { password, email, ...updateData } = body;

    const updatedUser = await userRepository.updateUser(userId, updateData);

    if (!updatedUser) {
      throw createError({
        statusCode: 404,
        message: "Usuário não encontrado",
      });
    }

    return {
      success: true,
      user: updatedUser,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Erro ao atualizar usuário",
    });
  }
});
