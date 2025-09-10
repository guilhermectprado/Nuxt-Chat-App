// server/api/users/friends.get.ts
import { userRepository } from "../../repositories/user.repository";

export default defineEventHandler(async (event) => {
  try {
    const userId = getRouterParam(event, "id");

    if (!userId) {
      throw createError({
        statusCode: 400,
        message: "ID do usuário é obrigatório",
      });
    }

    const friends = await userRepository.getFriends(userId);

    return {
      success: true,
      friends,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Erro ao buscar amigos",
    });
  }
});
