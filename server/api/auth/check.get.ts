import jwt from "jsonwebtoken";
import { userRepository } from "../../repositories/user.repository";

const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  try {
    const token = getCookie(event, "jwt");

    if (!token) {
      throw createError({
        statusCode: 401,
        message: "Token não encontrado",
      });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) as { userId: string };

    const user = await userRepository.findById(decoded.userId);

    if (!user) {
      throw createError({
        statusCode: 401,
        message: "Usuário não encontrado",
      });
    }

    return {
      success: true,
      user: {
        email: user.email,
        fullName: user.fullName,
        username: user.username,
        profileImage: user.profileImage,
        friends: user.friends,
        friendRequests: user.friendRequests,
        groups: user.groups,
        isOnline: user.isOnline,
        lastSeen: user.lastSeen,
      },
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
