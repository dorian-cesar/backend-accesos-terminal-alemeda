import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import publicRoutes from "./routes/public.routes.js";

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
        connectSrc: ["'self'", "ws://localhost:3000"],
        scriptSrc: ["'self'", "'unsafe-inline'"], // ← AGREGADO: Permite scripts inline
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  })
);

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
// app.set("view engine", "ejs"); // ← COMENTADO: Ya no usas EJS

// --------------------
// Rutas públicas
// --------------------
app.use("/info-server", publicRoutes);
app.use("/api/auth", authRoutes);

// --------------------
// Rutas protegidas
// --------------------
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);

// --------------------
// Ruta raíz
// --------------------
app.get("/", (req, res) => {
  res.redirect("/api/auth/login");
});

export default app;