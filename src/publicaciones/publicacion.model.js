import mongoose from "mongoose";

const publicacionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    // Referencia a la categoría; se asume que existe el modelo "Categoria"
    categoria: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categoria",
      required: true,
    },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Publicacion", publicacionSchema);
