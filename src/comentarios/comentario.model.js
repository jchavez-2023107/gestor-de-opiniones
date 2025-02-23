import mongoose from "mongoose";

/**
 * Modelo de Comentario
 * - publication: Referencia a la publicación (modelo "Publicacion") a la que pertenece el comentario.
 * - user: Referencia al usuario (modelo "User") que crea el comentario.
 * - text: Contenido del comentario.
 *
 * timestamps: true genera createdAt y updatedAt.
 */
const comentarioSchema = new mongoose.Schema(
  {
    publication: { type: mongoose.Schema.Types.ObjectId, ref: "Publicacion", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true }
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Comentario", comentarioSchema);
