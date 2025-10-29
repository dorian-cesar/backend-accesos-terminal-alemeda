import express from "express";
import {
  crearUsuarioController,
  obtenerUsuariosController
} from "../controllers/user.controller.js";

import { verificarToken, verificarRol } from "../middleware/auth.middleware.js";

const router = express.Router();

// Rutas protegidas - permitir administrador y superusuario
router.post("/", verificarToken, verificarRol(["superusuario", "administrador"]), crearUsuarioController);
router.get("/", verificarToken, verificarRol(["superusuario", "administrador"]), obtenerUsuariosController);

export default router;