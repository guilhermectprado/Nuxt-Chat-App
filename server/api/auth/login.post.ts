import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { userRepository } from "../../repositories/user.repository";
const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  try {
    const { email, password } = await readBody(event);

    const user = await userRepository.findByEmail(email, true);

    if (!user) {
      throw createError({
        statusCode: 404,
        message: "Usuário não encontrado.",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw createError({
        statusCode: 400,
        message: "Senha incorreta.",
      });
    }

    const userId = user._id;
    const token = jwt.sign({ userId }, config.JWT_SECRET, {
      expiresIn: "7d",
    });

    setCookie(event, "jwt", token, {
      maxAge: 7 * 24 * 60 * 60,
      httpOnly: true,
      sameSite: "strict",
      secure: config.NODE_ENV !== "development",
      path: "/",
    });

    setResponseStatus(event, 200);

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
    };
  } catch (error: any) {
    if (error.statusCode && error.statusCode !== 500) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      message: "Login - Erro no Servidor",
    });
  }
});
