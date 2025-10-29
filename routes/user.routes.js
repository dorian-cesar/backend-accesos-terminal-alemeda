import express from "express";
import {
  crearUsuarioController,
  obtenerUsuariosController
} from "../controllers/user.controller.js";

import { verificarToken, verificarRol } from "../middleware/auth.middleware.js";

const router = express.Router();

// Rutas protegidas
router.post("/", verificarToken, verificarRol(["superusuario"]), crearUsuarioController);
router.get("/", verificarToken, verificarRol(["superusuario"]), obtenerUsuariosController);

export default router;
