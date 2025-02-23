import { Router } from "express";
import {
  createPublicacion,
  getAllPublicaciones,
  getPublicacionById,
  updatePublicacion,
  deletePublicacion
} from "./publicacion.controller.js";
import { validateJWT } from "../../middlewares/validate.jwt.js";

const router = Router();

/**
 * Rutas de Publicaciones
 */

// Crear publicación (requiere autenticación)
router.post("/", validateJWT, createPublicacion);

// Listar todas las publicaciones
router.get("/", getAllPublicaciones);

// Obtener una publicación por ID
router.get("/:id", getPublicacionById);

// Actualizar una publicación (solo dueño)
router.put("/:id", validateJWT, updatePublicacion);

// Eliminar una publicación (solo dueño)
router.delete("/:id", validateJWT, deletePublicacion);

export default router;
