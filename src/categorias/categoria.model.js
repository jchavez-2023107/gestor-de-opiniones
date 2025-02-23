import mongoose from "mongoose";

const categoriaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" }
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Categoria", categoriaSchema);
