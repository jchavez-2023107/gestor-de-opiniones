// configs/app.js
"use strict";

import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import { limiter } from "../middlewares/rate.limit.js"; // Opcional

// Importamos la función que registra TODAS las rutas
import { rutasGenerales } from "../src/rutas.generales.js";

/**
 * Función para configurar middlewares globales.
 */
function configs(app) {
  app.use(morgan("dev")); // Logs de peticiones HTTP
  app.use(helmet()); // Seguridad de cabeceras
  app.use(cors()); // Permitir CORS
  app.use(express.json()); // Parsear JSON en requests
  app.use(express.urlencoded({ extended: true })); // Para x-www-form-urlencoded

  // (Opcional) Rate limiting
  // app.use(limiter);
}

/**
 * Función para cargar las rutas (rutasGenerales).
 */
function loadRoutes(app) {
  rutasGenerales(app);
}

/**
 * Middleware final para manejo de errores (opcional).
 * Captura errores que se envíen con next() y responde en JSON.
 */
function errorHandler(err, req, res, next) {
  if (Array.isArray(err?.errors)) {
    return res.status(400).json({ errors: err.errors });
  }
  console.error("❌ Error capturado:", err);
  return res.status(500).json({ message: "Internal Server Error" });
}

/**
 * Función que inicializa el servidor.
 */
export const initServer = () => {
  const app = express();

  try {
    // 1) Configuramos middlewares globales
    configs(app);

    // 2) Cargamos las rutas
    loadRoutes(app);

    // 3) Middleware final de errores (después de montar rutas)
    app.use(errorHandler);

    // 4) Iniciamos el servidor en el puerto definido en .env o 2636
    const port = process.env.PORT || 2636;
    app.listen(port, () => {
      console.log(`✅ Server running on port ${port}`);
    });
  } catch (err) {
    console.error("❌ Server init failed:", err);
    process.exit(1);
  }
};
