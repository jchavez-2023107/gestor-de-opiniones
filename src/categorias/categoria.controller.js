import Categoria from "./categoria.model.js";
import Publicacion from "../publicaciones/publicacion.model.js";

/**
 * Asegura que existan las categorías por defecto:
 * - "categoría predeterminada": para publicaciones sin categoría asignada.
 * - "categoría eliminada": para reasignar publicaciones de categorías eliminadas.
 *
 * Retorna un objeto con ambas categorías.
 */
const ensureDefaultCategorias = async () => {
  // Buscar o crear la categoría normal (predeterminada)
  let defaultNormal = await Categoria.findOne({
    name: { $regex: /^categoría predeterminada$/i },
  });
  if (!defaultNormal) {
    defaultNormal = new Categoria({
      name: "categoría predeterminada",
      description:
        "Categoría por defecto para publicaciones sin categoría asignada",
    });
    await defaultNormal.save();
    console.log(`✅ Created default category: ${defaultNormal.name}`);
  } else {
    console.log(`ℹ️ Default category already exists: ${defaultNormal.name}`);
  }

  // Buscar o crear la categoría de control de eliminación
  let defaultEliminada = await Categoria.findOne({
    name: { $regex: /^categoría eliminada$/i },
  });
  if (!defaultEliminada) {
    defaultEliminada = new Categoria({
      name: "categoría eliminada",
      description:
        "Categoría para reasignar publicaciones de categorías eliminadas",
    });
    await defaultEliminada.save();
    console.log(`✅ Created default category: ${defaultEliminada.name}`);
  } else {
    console.log(`ℹ️ Default category already exists: ${defaultEliminada.name}`);
  }

  return { defaultNormal, defaultEliminada };
};

/**
 * Crear una nueva categoría.
 * Solo el administrador puede crear categorías.
 */
export const createCategoria = async (req, res) => {
  try {
    const { name, description } = req.body;
    // Verificar si ya existe una categoría con el mismo nombre
    const existing = await Categoria.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Category already exists" });
    }
    const categoria = new Categoria({ name, description });
    await categoria.save();
    res
      .status(201)
      .json({ message: "Category created successfully", categoria });
  } catch (error) {
    console.error("Error creating category:", error);
    res
      .status(500)
      .json({ message: "Error creating category", error: error.message });
  }
};

/**
 * Listar todas las categorías.
 */
export const getCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.find();
    res.status(200).json({ categorias });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res
      .status(500)
      .json({ message: "Error fetching categories", error: error.message });
  }
};

/**
 * Actualizar una categoría.
 */
export const updateCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const categoria = await Categoria.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );
    if (!categoria)
      return res.status(404).json({ message: "Category not found" });
    res
      .status(200)
      .json({ message: "Category updated successfully", categoria });
  } catch (error) {
    console.error("Error updating category:", error);
    res
      .status(500)
      .json({ message: "Error updating category", error: error.message });
  }
};

/**
 * Eliminar una categoría.
 * - Al eliminar, se reasignan todas las publicaciones que pertenecían a esta categoría
 *   a la categoría por defecto "categoría eliminada" y se marcan como inactivas (active: false).
 */
export const deleteCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    // Buscar la categoría a eliminar
    const categoriaToDelete = await Categoria.findById(id);
    if (!categoriaToDelete) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Evitar eliminar la categoría por defecto
    if (categoriaToDelete.name.toLowerCase() === "categoría eliminada" ||
        categoriaToDelete.name.toLowerCase() === "categoría predeterminada") {
      return res.status(400).json({ message: "Default categories cannot be deleted" });
    }

    // Buscar o crear la categoría "categoría eliminada"
    let defaultEliminada = await Categoria.findOne({ name: { $regex: /^categoría eliminada$/i } });
    if (!defaultEliminada) {
      defaultEliminada = new Categoria({
        name: "categoría eliminada",
        description: "Categoría para publicaciones de categorías eliminadas"
      });
      await defaultEliminada.save();
    }

    // Reasignar las publicaciones que tenían esta categoría
    // Se marca active: false si así lo deseas
    await Publicacion.updateMany(
      { category: categoriaToDelete._id },
      { category: defaultEliminada._id }
    );

    // Eliminar la categoría original
    await Categoria.findByIdAndDelete(id);

    res.status(200).json({
      message: "Category deleted successfully; associated publications moved to 'categoría eliminada'"
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Error deleting category", error: error.message });
  }
};

/**
 * Función para inicializar (sembrar) las categorías por defecto.
 */
ensureDefaultCategorias();
