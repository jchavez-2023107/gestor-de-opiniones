/**
 * user.model.js
 *
 * Este modelo define el esquema para los usuarios de la aplicación.
 * Se incluyen únicamente los campos necesarios para:
 * - Registro e inicio de sesión seguro (usando email o username y contraseña).
 * - Edición del perfil (incluyendo cambios en username y contraseña, con verificación de la contraseña actual).
 * 
 * Campos:
 * - name: Nombre del usuario (obligatorio).
 * - surname: Apellido del usuario (obligatorio).
 * - username: Nombre de usuario, único (obligatorio).
 * - email: Correo electrónico, único (obligatorio).
 * - password: Contraseña encriptada (obligatorio); se oculta en las respuestas.
 * - phone: Teléfono del usuario (opcional).
 * - role: Rol del usuario; puede ser "CLIENT_ROLE" o "ADMIN_ROLE" (por defecto CLIENT_ROLE).
 *
 * Además, el esquema genera automáticamente campos de timestamps (createdAt y updatedAt)
 * y omite el campo __v (versionKey).
 */

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    surname: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    phone: { type: String },
    role: { type: String, enum: ["CLIENT_ROLE", "ADMIN_ROLE"], default: "CLIENT_ROLE" }
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("User", userSchema);
