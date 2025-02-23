"use strict";

import jwt from "jsonwebtoken";
import User from "../src/users/user.model.js";

export const validateJWT = async (req, res, next) => {
  try {
    const secretKey = process.env.SECRET_KEY;
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });
    }

    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, secretKey);

    // Cargar el usuario de la base de datos para obtener el valor actual de updatedAt
    const user = await User.findById(decoded.uid);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    // Comparar tokenVersion del token con el timestamp actual de updatedAt del usuario
    const currentVersion = user.updatedAt.getTime();
    if (decoded.tokenVersion < currentVersion) {
      return res
        .status(401)
        .json({ message: "Token is outdated, please re-login" });
    }

    // Inyectar en la solicitud el usuario autenticado
    req.user = {
      id: decoded.uid,
      username: decoded.username,
      role: decoded.role,
    };

    next();
  } catch (err) {
    console.error("❌ JWT Error:", err);
    return res.status(401).json({ message: "Invalid credentials" });
  }
};
