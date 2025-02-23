import Comentario from "./comentario.model.js";

/**
 * Crear un nuevo comentario
 * - Requiere en el body: publication (id de la publicación) y text (contenido del comentario)
 * - El usuario se toma de req.user (obtenido mediante validateJWT)
 */
export const createComentario = async (req, res) => {
  try {
    const { publication, text } = req.body;
    if (!publication || !text) {
      return res.status(400).json({ message: "Publication and text are required" });
    }
    const newComentario = new Comentario({
      publication,
      text,
      user: req.user.id
    });
    await newComentario.save();
    // Populamos los datos del usuario y de la publicación para la respuesta
    const comentarioPopulated = await Comentario.findById(newComentario._id)
      .populate("user", "username email")
      .populate("publication", "title");
    res.status(201).json({ message: "Comment created successfully", comentario: comentarioPopulated });
  } catch (error) {
    console.error("❌ Error creating comment:", error);
    res.status(500).json({ message: "Error creating comment", error: error.message });
  }
};

/**
 * Actualizar un comentario
 * - Solo el autor del comentario puede editarlo.
 * - Se permite actualizar únicamente el contenido (text).
 */
export const updateComentario = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: "Text is required" });
    }
    const comentario = await Comentario.findById(id);
    if (!comentario) {
      return res.status(404).json({ message: "Comment not found" });
    }
    // Verificar que el comentario pertenezca al usuario autenticado
    if (comentario.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not the author of this comment" });
    }
    comentario.text = text;
    await comentario.save();
    const comentarioPopulated = await Comentario.findById(id)
      .populate("user", "username email")
      .populate("publication", "title");
    res.status(200).json({ message: "Comment updated successfully", comentario: comentarioPopulated });
  } catch (error) {
    console.error("❌ Error updating comment:", error);
    res.status(500).json({ message: "Error updating comment", error: error.message });
  }
};

/**
 * Eliminar un comentario
 * - Solo el autor del comentario puede eliminarlo.
 */
export const deleteComentario = async (req, res) => {
  try {
    const { id } = req.params;
    const comentario = await Comentario.findById(id);
    if (!comentario) {
      return res.status(404).json({ message: "Comment not found" });
    }
    // Verificar que el comentario pertenezca al usuario autenticado
    if (comentario.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not the author of this comment" });
    }
    await comentario.deleteOne();
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting comment:", error);
    res.status(500).json({ message: "Error deleting comment", error: error.message });
  }
};

/**
 * Listar comentarios de una publicación
 * - Se puede usar ?publication=<id> para filtrar.
 */
export const getComentariosByPublication = async (req, res) => {
  try {
    const { publication } = req.query;
    if (!publication) {
      return res.status(400).json({ message: "Publication id is required as query parameter" });
    }
    const comentarios = await Comentario.find({ publication })
      .populate("user", "username email")
      .sort({ createdAt: -1 });
    res.status(200).json({ comentarios });
  } catch (error) {
    console.error("❌ Error fetching comments:", error);
    res.status(500).json({ message: "Error fetching comments", error: error.message });
  }
};
