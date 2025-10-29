import express from "express";
import { mostrarDashboard } from "../controllers/dashboard.controller.js";
import { verificarToken, verificarSuperUsuario } from "../middleware/auth.middleware.js";

const router = express.Router();

// Solo superusuarios pueden acceder al dashboard
router.get("/", 
  verificarToken, 
  verificarSuperUsuario, 
  mostrarDashboard
);

export default router;