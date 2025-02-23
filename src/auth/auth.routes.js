//Rutas de autenticación
import { Router } from "express";
import { registerUser, loginUser } from "./auth.controller.js";
import { validateJWT } from "../../middlewares/validate.jwt.js";
import { registerValidator } from "../../middlewares/validators.js";

const api = Router();

// Rutas públicas
api.post("/register", registerValidator, registerUser);
api.post("/login", loginUser);

// Ruta de prueba protegida (opcional)
api.get("/test", validateJWT, (req, res) => {
  res.json({ message: "Token válido" });
});

export default api;
