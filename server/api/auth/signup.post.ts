import bcrypt from "bcryptjs";
import { userRepository } from "../../repositories/user.repository";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const { email, password, fullName, username } = body;

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw createError({
        statusCode: 409,
        message: "Email já cadastrado",
      });
    }

    const existingUsername = await userRepository.findByUsername(username);
    if (existingUsername) {
      throw createError({
        statusCode: 409,
        message: "Username já está em uso",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await userRepository.createUser({
      email,
      password: hashedPassword,
      fullName,
      username,
    });

    setResponseStatus(event, 201);

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
      message: "Erro ao criar usuário",
    });
  }
});
