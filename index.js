// index.js
"use strict";

import dotenv from "dotenv";
dotenv.config(); // Se cargan variables de entorno

import { connect } from "./configs/mongo.js";
import { initServer } from "./configs/app.js";

// Conexión a MongoDB
connect();

// Inicializar el servidor Express
initServer();