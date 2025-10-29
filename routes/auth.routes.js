import express from "express";
import { login, mostrarLogin, logout, logoutAPI } from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/login", mostrarLogin);        // GET /api/auth/login → Muestra formulario
router.post("/login", login);              // POST /api/auth/login → Procesa login
router.get("/logout", logout);             // GET /api/auth/logout → Logout con redirección
router.post("/logout", logoutAPI);         // POST /api/auth/logout → Logout API (para fetch)

export default router;