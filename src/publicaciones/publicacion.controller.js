import Publicacion from "../publicaciones/publicacion.model.js";
import Categoria from "../categorias/categoria.model.js";

/**
 * Crear una nueva publicación
 * - Requiere que el usuario envíe title, content, category (id), y el token (req.user).
 */
export const createPublicacion = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    // Verificar que la categoría exista
    const cat = await Categoria.findById(category);
    if (!cat) {
      return res.status(400).json({ message: "Category does not exist" });
    }

    // Crear la publicación
    const newPub = new Publicacion({
      title,
      content,
      category: cat._id,
      user: req.user.id, // El id del usuario autenticado
    });
    await newPub.save();

    // Hacer una segunda consulta para populate
    const pubPopulated = await Publicacion.findById(newPub._id)
      .populate("category", "name description")
      .populate("user", "username email");

    res.status(201).json({
      message: "Publication created successfully",
      publication: pubPopulated,
    });
  } catch (error) {
    console.error("❌ Error creating publication:", error);
    res
      .status(500)
      .json({ message: "Error creating publication", error: error.message });
  }
};

/**
 * Listar todas las publicaciones (o filtrar por categoría, opcionalmente)
 */
export const getAllPublicaciones = async (req, res) => {
  try {
    // Opcional: Filtrar por categoría con ?category=xxx
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }
    const publicaciones = await Publicacion.find(filter)
      .populate("category", "name")
      .populate("user", "username email")
      .sort({ createdAt: -1 });
    res.status(200).json({ publicaciones });
  } catch (error) {
    console.error("❌ Error getting publications:", error);
    res
      .status(500)
      .json({ message: "Error getting publications", error: error.message });
  }
};

/**
 * Obtener una publicación por su ID
 */
export const getPublicacionById = async (req, res) => {
  try {
    const { id } = req.params;
    const publicacion = await Publicacion.findById(id)
      .populate("category", "name")
      .populate("user", "username email");
    if (!publicacion) {
      return res.status(404).json({ message: "Publication not found" });
    }
    res.status(200).json({ publicacion });
  } catch (error) {
    console.error("❌ Error getting publication:", error);
    res
      .status(500)
      .json({ message: "Error getting publication", error: error.message });
  }
};

/**
 * Actualizar una publicación (solo el dueño puede hacerlo)
 */
export const updatePublicacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category } = req.body;

    // Buscar la publicación
    const pub = await Publicacion.findById(id);
    if (!pub) {
      return res.status(404).json({ message: "Publication not found" });
    }
    // Verificar que la publicación pertenezca al usuario autenticado
    if (pub.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not the owner of this publication" });
    }
    // Opcional: verificar que la categoría exista si se envía un nuevo category
    if (category) {
      const cat = await Categoria.findById(category);
      if (!cat) {
        return res.status(400).json({ message: "Category does not exist" });
      }
      pub.category = cat._id;
    }
    if (title) pub.title = title;
    if (content) pub.content = content;

    await pub.save();
    res.status(200).json({
      message: "Publication updated successfully",
      publication: pub,
    });
  } catch (error) {
    console.error("❌ Error updating publication:", error);
    res
      .status(500)
      .json({ message: "Error updating publication", error: error.message });
  }
};

/**
 * Eliminar una publicación (solo el dueño puede hacerlo)
 */
export const deletePublicacion = async (req, res) => {
  try {
    const { id } = req.params;
    const pub = await Publicacion.findById(id);
    if (!pub) {
      return res.status(404).json({ message: "Publication not found" });
    }
    // Verificar que la publicación pertenezca al usuario autenticado
    if (pub.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not the owner of this publication" });
    }
    await pub.deleteOne();
    res.status(200).json({ message: "Publication deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting publication:", error);
    res
      .status(500)
      .json({ message: "Error deleting publication", error: error.message });
  }
};
