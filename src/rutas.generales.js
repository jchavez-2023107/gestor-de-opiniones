"use strict";

// Importación de todas las rutas a unificar
import authRoutes from "../src/auth/auth.routes.js";
import userRoutes from "../src/users/user.routes.js";
import categoriaRoutes from "./categorias/categoria.routes.js";
import publicacionRoutes from "./publicaciones/publicacion.routes.js";

/**
 * Función que recibe la app de Express y registra
 * todas las rutas en una sola llamada.
 */
export const rutasGenerales = (app) => {
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/categorias", categoriaRoutes);
  app.use("/api/publicaciones", publicacionRoutes);
  // app.use("/api/comentarios", comentariosRoutes);
  // etc...
};
