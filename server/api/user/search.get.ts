// server/api/users/search.get.ts
import { userRepository } from "../../repositories/user.repository";

export default defineEventHandler(async (event) => {
  try {
    console.log("URL completa:", event.node.req.url);
    console.log("Method:", event.node.req.method);
    console.log("Path:", event._path);

    const query = getQuery(event).user as string;

    console.log("Parâmetro de busca:", query);

    if (!query || query.length < 2) {
      return {
        success: true,
        users: [],
        count: 0,
      };
    }

    const users = await userRepository.searchUsers(query);

    return {
      success: true,
      users,
      count: users.length,
    };
  } catch (error: any) {
    console.error("Erro na busca:", error);

    throw createError({
      statusCode: 500,
      message: "Erro na busca de usuários",
    });
  }
});
