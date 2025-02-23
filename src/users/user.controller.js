import User from "./user.model.js"; // <-- Importamos desde el mismo folder
import { encrypt, checkPassword } from "../../utils/encrypt.js";
import { generateToken } from "../../utils/jwt.js";

/**
 * 📌 Registrar un nuevo usuario (CLIENT por defecto)
 * Campos requeridos: name, surname, username, email, password, (phone opcional)
 */
export const registerUser = async (req, res) => {
  try {
    const { name, surname, username, email, password, phone } = req.body;

    // Verificar si el email o username ya existen
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or Email already taken" });
    }

    // Encriptar la contraseña
    const hashedPassword = await encrypt(password);

    // Crear nuevo usuario con CLIENT_ROLE por defecto
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

    // Recuperar el usuario sin la contraseña para enviarlo en la respuesta
    const savedUser = await User.findById(newUser._id).select("-password");

    res
      .status(201)
      .json({ message: "User registered successfully", user: savedUser });
  } catch (error) {
    console.error("❌ Error in registerUser:", error);
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

/**
 * 📌 Iniciar sesión (Login)
 * Permite autenticarse usando email o username junto con la contraseña.
 */
export const loginUser = async (req, res) => {
  try {
    const { userlogin, password } = req.body;
    // Buscar al usuario por username o email
    const user = await User.findOne({
      $or: [{ username: userlogin }, { email: userlogin }],
    }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Verificar contraseña
    const isValid = await checkPassword(user.password, password);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generar token JWT
    const token = await generateToken({
      uid: user._id,
      username: user.username,
      role: user.role,
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error("❌ Error in loginUser:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

/**
 * 📌 Obtener perfil del usuario autenticado (Self)
 */
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("❌ Error in getUserProfile:", error);
    res.status(500).json({ message: "Error retrieving user profile" });
  }
};

/**
 * 📌 Actualizar perfil del usuario (Self)
 * Permite actualizar datos personales: name, surname, username y phone.
 * - No se permiten cambios en email ni en rol.
 * - Si se intenta cambiar el username, se requiere enviar currentPassword para verificar la identidad.
 */
/**
 * 📌 Actualizar perfil del usuario (Self)
 * Permite actualizar datos personales: name, surname, username y phone.
 * - No se permiten cambios en email ni en rol.
 * - Si se intenta cambiar el username, se requiere enviar currentPassword para verificar la identidad.
 */
export const updateUserProfile = async (req, res) => {
  try {
    let { name, surname, username, phone, currentPassword } = req.body;

    // Buscar el usuario e incluir la contraseña para validación
    const user = await User.findById(req.user.id).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Si se envía username y es distinto al que ya tiene en la BD...
    if (username && username !== user.username) {
      // 1. Exigir currentPassword
      if (!currentPassword) {
        return res
          .status(400)
          .json({ message: "Current password is required to change username" });
      }

      // 2. Verificar que la contraseña actual sea correcta
      const isMatch = await checkPassword(user.password, currentPassword);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }

      // 3. Verificar que el username nuevo no exista en otro usuario
      const usernameExists = await User.findOne({
        username,
        _id: { $ne: user._id },
      });
      if (usernameExists) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // 4. Asignar el nuevo username
      user.username = username;
    }

    // Actualizar otros campos (solo si se envían)
    if (name) {
      user.name = name;
    }
    if (surname) {
      user.surname = surname;
    }
    if (phone) {
      user.phone = phone;
    }

    // Guardar cambios en la BD
    await user.save();

    // Recuperar el usuario sin la contraseña
    const updatedUser = await User.findById(user._id).select("-password");
    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("❌ Error in updateUserProfile:", error);
    res
      .status(500)
      .json({ message: "Error updating profile", error: error.message });
  }
};

/**
 * 📌 Actualizar contraseña (Endpoint especial)
 * - Se requiere enviar currentPassword y newPassword.
 * - Se verifica que currentPassword sea correcta.
 * - Se encripta y actualiza el newPassword.
 */
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verificar la contraseña actual
    const isMatch = await checkPassword(user.password, currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Verificar que la nueva contraseña sea diferente a la actual (en texto plano)
    if (currentPassword === newPassword) {
      return res.status(400).json({
        message: "The new password must be different from the current password",
      });
    }

    // Encriptar y actualizar la nueva contraseña
    user.password = await encrypt(newPassword);
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("❌ Error updating password:", error);
    res
      .status(500)
      .json({ message: "Error updating password", error: error.message });
  }
};

/**
 * 📌 Agregar usuarios por defecto (con contraseñas encriptadas)
 * Se ejecuta al iniciar el proyecto para garantizar que haya al menos un usuario ADMIN.
 */
const agregarUsuariosPorDefecto = async () => {
  try {
    const usuariosExistentes = await User.countDocuments();
    if (usuariosExistentes === 0) {
      const hashedAdminPassword = await encrypt("12345678Aa!");
      const hashedClientPassword = await encrypt("12345678Aa!");
      const usuariosPorDefecto = [
        {
          name: "Marla",
          surname: "Pérez",
          username: "mperez",
          email: "mperez@gmail.com",
          password: hashedAdminPassword,
          phone: "55986458",
          role: "ADMIN_ROLE",
        },
        {
          name: "Mardoqueo",
          surname: "PieGrande",
          username: "mpiegrande",
          email: "mpiegrande@gmail.com",
          password: hashedClientPassword,
          phone: "55986458",
          role: "CLIENT_ROLE",
        },
      ];
      await User.insertMany(usuariosPorDefecto);
      console.log("✅ Se crearon los usuarios por defecto (ADMIN y CLIENT)");
    } else {
      console.log(
        "ℹ️ Ya existen usuarios en la base de datos, no se crearon usuarios por defecto"
      );
    }
  } catch (error) {
    console.error("❌ Error al agregar usuarios por defecto:", error);
  }
};
agregarUsuariosPorDefecto();
