// export const signup = async (req, res) => {
//   const { email, fullName, password } = req.body;

//   try {
//     if (!fullName || !email || !password) {
//       return res
//         .status(400)
//         .json({ message: "Todos os campos são obrigatórios" });
//     }

//     const emailExist = await User.findOne({ email });
//     if (emailExist) {
//       return res.status(400).json({ message: "E-mail já cadastrado" });
//     }

//     if (password.length < 8) {
//       return res
//         .status(400)
//         .json({ message: "Senha deve conter ao menos 8 caracteres" });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const newUser = new User({
//       email,
//       fullName,
//       password: hashedPassword,
//     });

//     if (newUser) {
//       generateToken(newUser._id, res);

//       await newUser.save();

//       res.status(201).json({
//         _id: newUser._id,
//         email: newUser.email,
//         fullName: newUser.fullName,
//         profileImage: newUser.profileImage,
//         createdAt: newUser.createdAt,
//       });
//     } else {
//       res.status(400).json({ message: "Dados Inválidos" });
//     }
//   } catch (error) {
//     console.log("Erro na Controladora Auth (signup)", error.message);
//     res.status(500).json({ message: "Erro Interno do Servidor" });
//   }
// };

// server/api/auth/signup.post.ts
import { userRepository } from "../../repositories/user.repository";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const { email, password, fullName, username } = body;

    // Verificar se usuário já existe
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

    // Criar usuário
    const user = await userRepository.createUser({
      email,
      password, // Você deve hash a password antes!
      fullName,
      username,
    });

    return {
      success: true,
      user,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Erro ao criar usuário",
    });
  }
});
