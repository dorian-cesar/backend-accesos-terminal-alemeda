// auth.routes.js
import express from "express";
import { login, mostrarLogin, logout } from "../controllers/auth.controller.js";

const router = express.Router();
router.get("/login", mostrarLogin); // Ruta para mostrar el formulario
router.post("/login", login); // Ruta para procesar el login
router.post("/logout", logout);

export default router;