import mongoose from "mongoose";

/**
 * Modelo de Publicación
 * - title: Título de la publicación
 * - content: Texto principal de la publicación
 * - category: Referencia a una categoría existente (Modelo "Categoria")
 * - user: Referencia al usuario (Modelo "User") que creó la publicación
 * 
 * timestamps: true => Crea createdAt y updatedAt
 */
const publicacionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Categoria", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Publicacion", publicacionSchema);