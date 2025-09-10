// server/api/users/search.get.ts
import { userRepository } from "../../repositories/user.repository";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event).q as string;

    if (!query || query.length < 2) {
      throw createError({
        statusCode: 400,
        message: "Query deve ter pelo menos 2 caracteres",
      });
    }

    const users = await userRepository.searchUsers(query);

    return {
      success: true,
      users,
      count: users.length,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Erro na busca de usuários",
    });
  }
});
