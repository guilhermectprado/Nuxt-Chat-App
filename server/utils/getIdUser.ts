import jwt from "jsonwebtoken";
import type { H3Event } from "h3";
const config = useRuntimeConfig();

export const getIdUser = (event: H3Event) => {
  const token = getCookie(event, "jwt");

  if (!token) {
    throw createError({
      statusCode: 401,
      message: "Token não fornecido",
    });
  }

  const decoded = jwt.verify(token, config.JWT_SECRET) as {
    userId: string;
  };

  return decoded.userId;
};
