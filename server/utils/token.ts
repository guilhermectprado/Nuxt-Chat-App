import jwt from "jsonwebtoken";
import type { H3Event } from "h3";
const config = useRuntimeConfig();

export const generateToken = (userId: string, event: H3Event) => {
  const token = jwt.sign({ userId }, config.JWT_SECRET, {
    expiresIn: "7d",
  });

  setCookie(event, "jwt", token, {
    maxAge: 7 * 24 * 60 * 60,
    httpOnly: true,
    sameSite: "strict",
    // secure: config.NODE_ENV !== "development",
  });

  return token;
};
