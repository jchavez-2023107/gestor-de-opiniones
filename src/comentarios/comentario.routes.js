import { Router } from "express";
import {
  createComentario,
  updateComentario,
  deleteComentario,
  getComentariosByPublication
} from "./comentario.controller.js";
import { validateJWT } from "../../middlewares/validate.jwt.js";

const router = Router();

// Crear un comentario (requiere autenticación)
router.post("/", validateJWT, createComentario);

// Actualizar un comentario (solo el autor)
router.put("/:id", validateJWT, updateComentario);

// Eliminar un comentario (solo el autor)
router.delete("/:id", validateJWT, deleteComentario);

// Listar comentarios por publicación (puede ser pública)
router.get("/", getComentariosByPublication);

export default router;
