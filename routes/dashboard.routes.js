// dashboard.routes.js
import express from "express";
import { mostrarDashboard } from "../controllers/dashboard.controller.js";
import { verificarToken, verificarRol } from "../middleware/auth.middleware.js";

const router = express.Router();

// Solo superusuarios pueden acceder al dashboard
router.get("/", 
  verificarToken, 
  verificarRol(['superusuario']), 
  mostrarDashboard
);

export default router;