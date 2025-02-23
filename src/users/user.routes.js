import { Router } from "express";
import {
  getUserProfile,
  updateUserProfile,
  updatePassword,
} from "./user.controller.js";

// Middleware para verificar JWT
import { validateJWT } from "../../middlewares/validate.jwt.js";

// Middleware para verificar que la contraseña sea Strong
import { updatePasswordValidator } from "../../middlewares/validators.js";

const router = Router();

/**
 * Rutas de perfil de usuario (solo accesibles con token válido)
 */

// 1) Obtener perfil
router.get("/profile", validateJWT, getUserProfile);

// 2) Actualizar perfil (name, surname, username, phone)
//    - Requiere currentPassword si se cambia el username
router.put("/profile", validateJWT, updateUserProfile);

// 3) Actualizar contraseña (requiere currentPassword y newPassword)
router.put(
  "/profile/password",
  validateJWT,
  updatePasswordValidator,
  updatePassword
);

export default router;
