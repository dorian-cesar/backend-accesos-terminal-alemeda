import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Para ES modules - obtener __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

dotenv.config();

// --------------------
// Inicializar app
// --------------------
const app = express();

// --------------------
// Seguridad y middleware
// --------------------
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", "ws://localhost:3000", "https://andenes-alameda.dev-wit.com"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        scriptSrcAttr: ["'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  })
);

// Configurar CORS para acceso externo
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173', // Si usas Vite
    'https://andenes-alameda.dev-wit.com',
    'https://www.andenes-alameda.dev-wit.com'
  ],
  credentials: true
}));

app.use(express.json());
app.use(morgan("dev"));

// Servir archivos estáticos (para favicon y futuros assets)
app.use(express.static(path.join(__dirname, 'public')));

// Ignorar solicitudes de favicon para evitar errores 404
app.get('/favicon.ico', (req, res) => {
  res.status(204).end(); // No Content
});

// --------------------
// Rutas públicas
// --------------------
app.use("/api/auth", authRoutes);

// --------------------
// Rutas protegidas
// --------------------
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);

// --------------------
// Ruta raíz y manejo de errores
// --------------------
app.get("/", (req, res) => {
  res.redirect("/api/auth/login");
});

// Health check para la VM
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    message: "Servidor funcionando correctamente",
    timestamp: new Date().toISOString()
  });
});

// Manejo de rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({ 
    mensaje: "Ruta no encontrada",
    ruta: req.originalUrl 
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error global:', err);
  res.status(500).json({ 
    mensaje: "Error interno del servidor",
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

export default app;