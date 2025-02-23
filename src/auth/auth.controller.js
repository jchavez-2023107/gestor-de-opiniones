import User from "../users/user.model.js";
import { encrypt, checkPassword } from "../../utils/encrypt.js";
import { generateToken } from "../../utils/jwt.js";

/**
 * 📌 Registrar un nuevo usuario (CLIENT por defecto)
 * - Se valida que el email y username no estén duplicados.
 * - Se encripta la contraseña antes de guardarla.
 * - Se devuelve el usuario sin incluir la contraseña.
 */
export const registerUser = async (req, res) => {
  try {
    const { name, surname, username, email, password, phone } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or Email already taken" });
    }

    // Encriptar la contraseña
    const hashedPassword = await encrypt(password);

    // Crear usuario con CLIENT_ROLE por defecto
    const newUser = new User({
      name,
      surname,
      username,
      email,
      password: hashedPassword,
      phone,
      role: "CLIENT_ROLE",
    });

    await newUser.save();

    // Convertir a objeto y eliminar la contraseña antes de enviar la respuesta
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res
      .status(201)
      .json({ message: "User registered successfully", user: userResponse });
  } catch (error) {
    console.error("❌ Error in registerUser:", error);
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

/**
 * 📌 Iniciar sesión con email o username
 * - Verifica credenciales y genera un token JWT válido por 3 horas.
 * - Incluye "tokenVersion" basado en user.updatedAt para invalidar tokens antiguos al actualizar el perfil.
 */
export const loginUser = async (req, res) => {
  try {
    const { userlogin, password } = req.body;

    // Buscar usuario por username o email
    const user = await User.findOne({
      $or: [{ username: userlogin }, { email: userlogin }],
    }).select("+password");
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Comparar contraseña
    const isValid = await checkPassword(user.password, password);
    if (!isValid)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generar token incluyendo tokenVersion basado en updatedAt
    const token = await generateToken({
      uid: user._id,
      username: user.username,
      role: user.role,
      tokenVersion: user.updatedAt.getTime() // valor numérico basado en updatedAt
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error("❌ Error in loginUser:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

