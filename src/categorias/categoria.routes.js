import { Router } from "express";
import {
  createCategoria,
  getCategorias,
  updateCategoria,
  deleteCategoria,
} from "./categoria.controller.js";
import { validateJWT } from "../../middlewares/validate.jwt.js";
import { authorizeRoles } from "../../middlewares/authorizeRoles.js";

const router = Router();

// Solo el administrador (ADMIN_ROLE) puede gestionar categorías
router.post("/", validateJWT, authorizeRoles("ADMIN_ROLE"), createCategoria);
router.get("/", validateJWT, authorizeRoles("ADMIN_ROLE"), getCategorias);
router.put("/:id", validateJWT, authorizeRoles("ADMIN_ROLE"), updateCategoria);
router.delete(
  "/:id",
  validateJWT,
  authorizeRoles("ADMIN_ROLE"),
  deleteCategoria
);

export default router;
