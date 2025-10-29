// routes/public.routes.js
import { Router } from "express";
import { infoServer } from "../controllers/public.controller.js";

const router = Router();
router.get("/", infoServer); // ruta raíz del router

export default router;
