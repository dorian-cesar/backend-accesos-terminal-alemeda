import express from "express";
import {
  crearUsuarioController,
  obtenerUsuariosController,
  obtenerUsuarioPorIdController,
  actualizarUsuarioController,
  actualizarPasswordUsuarioController,
  cambiarEstadoUsuarioController
} from "../controllers/user.controller.js";

import { verificarToken, verificarRol } from "../middleware/auth.middleware.js";

const router = express.Router();

// Rutas protegidas - permitir administrador y superusuario
router.post("/", verificarToken, verificarRol(["superusuario", "administrador"]), crearUsuarioController);
router.get("/", verificarToken, verificarRol(["superusuario", "administrador"]), obtenerUsuariosController);
router.get("/:id", verificarToken, verificarRol(["superusuario", "administrador"]), obtenerUsuarioPorIdController);
router.put("/:id", verificarToken, verificarRol(["superusuario", "administrador"]), actualizarUsuarioController);
router.patch("/:id/password", verificarToken, verificarRol(["superusuario", "administrador"]), actualizarPasswordUsuarioController);
router.patch("/:id/estado", verificarToken, verificarRol(["superusuario", "administrador"]), cambiarEstadoUsuarioController);

export default router;