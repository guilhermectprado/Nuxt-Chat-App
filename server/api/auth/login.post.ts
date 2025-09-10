// export const login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(400).json({ message: "Usuário não encontrado" });
//     }

//     const isPasswordCorrect = await bcrypt.compare(password, user.password);
//     if (!isPasswordCorrect) {
//       return res.status(400).json({ message: "Senha incorreta" });
//     }

//     generateToken(user._id, res);

//     res.status(200).json({
//       _id: user._id,
//       email: user.email,
//       fullName: user.fullName,
//       profileImage: user.profileImage,
//       createdAt: user.createdAt,
//     });
//   } catch (error) {
//     console.log("Erro na Controladora Auth (login)", error.message);
//     res.status(500).json({ message: "Erro Interno do Servidor" });
//   }
// };
