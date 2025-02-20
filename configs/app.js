//Levantar servidor express (HTTP)

//Modular | + efectiva + legible | trabaja en funciones

"use strict";

//ECModules | ESModules
import express from "express"; //Servidor HTTP
import morgan from "morgan"; //Logs
import helmet from "helmet"; //Seguridad para HTTP
import cors from "cors"; //Acceso al API

//Importamos las rutas de las entidades a trabajar.


//El dotenv
import dotenv from "dotenv";
//import { limiter } from "../middlewares/rate.limit.js";
dotenv.config(); // <-- Asegura que .env se cargue correctamente

//El dotenv
import dotenv from "dotenv";
//import { limiter } from "../middlewares/rate.limit.js";
dotenv.config(); // <-- Asegura que .env se cargue correctamente


//Cuando tengamos rutas.
// ✅ Carga de rutas
const routes = (app) => {

}

//Ejecutamos el servidor
export const initServer = () => {
    //Crear instancia de express
    const app = express(); //Instancia de express
    try {
      //servidor : app.
      configs(app);
      routes(app);
      //puerto en el que corre: 2636.
      app.listen(process.env.PORT);
      //Impresión sobre el puerto en el que corre.
      console.log(`Server running on port ${process.env.PORT}`);
    } catch (err) {
      //Impresión del fallo de inicialización del servidor, impresión del error.
      console.error("Server init failed", err);
      process.exit(1); // Cierra el proceso si hay error
    }
  };
  