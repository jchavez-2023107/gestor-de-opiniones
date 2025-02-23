// rutasGenerales.js
"use strict";

// Importa aquí todas las rutas que quieras unificar
import authRoutes from "../src/auth/auth.routes.js";
import userRoutes from "../src/users/user.routes.js";
// ... y así con más rutas (publicaciones, comentarios, categorías, etc.)

/**
 * Función que recibe la app de Express y registra
 * todas las rutas en una sola llamada.
 */
export const rutasGenerales = (app) => {
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  // app.use("/api/publicaciones", publicacionesRoutes);
  // app.use("/api/comentarios", comentariosRoutes);
  // etc...
};
