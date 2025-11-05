import express from "express";
import {
  crearBusController,
  obtenerBusesController,
  obtenerBusPorIdController,
  obtenerBusPorTagUHFController,
  obtenerBusPorPatenteController,
  actualizarBusController,
  cambiarEstadoBusController,
  validarAccesoBusController
} from "../controllers/bus.controller.js";

import { verificarToken, verificarRol } from "../middleware/auth.middleware.js";

const router = express.Router();

// Rutas protegidas - permitir administrador y superusuario
router.post("/", verificarToken, verificarRol(["superusuario", "administrador"]), crearBusController);
router.get("/", verificarToken, verificarRol(["superusuario", "administrador", "operador"]), obtenerBusesController);
router.get("/:id", verificarToken, verificarRol(["superusuario", "administrador", "operador"]), obtenerBusPorIdController);
router.get("/tag/:tag_uhf", verificarToken, verificarRol(["superusuario", "administrador", "operador"]), obtenerBusPorTagUHFController);
router.get("/patente/:patente", verificarToken, verificarRol(["superusuario", "administrador", "operador"]), obtenerBusPorPatenteController);
router.put("/:id", verificarToken, verificarRol(["superusuario", "administrador"]), actualizarBusController);
router.patch("/:id/estado", verificarToken, verificarRol(["superusuario", "administrador"]), cambiarEstadoBusController);

// Ruta para validación de acceso (puede ser usada por el sistema UHF)
router.post("/validar-acceso", verificarToken, validarAccesoBusController);

export default router;