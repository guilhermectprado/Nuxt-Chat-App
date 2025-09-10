import type { H3Event } from "h3";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

export default defineEventHandler(async (event: H3Event) => {
  const token =
    getCookie(event, "jwt") ||
    getHeader(event, "authorization")?.replace("Bearer ", "");

  if (!token) {
    throw createError({
      statusCode: 401,
      message: "Não autorizado - Token não fornecido",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      throw createError({
        statusCode: 404,
        message: "Usuário não encontrado",
      });
    }

    event.context.user = user;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw createError({
        statusCode: 401,
        message: "Token inválido",
      });
    }

    if (error instanceof jwt.TokenExpiredError) {
      throw createError({
        statusCode: 401,
        message: "Token expirado",
      });
    }

    // Se já é um erro com statusCode, repassar
    if (typeof error === "object" && error !== null && "statusCode" in error) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      message: "Erro interno do servidor",
    });
  }
});
