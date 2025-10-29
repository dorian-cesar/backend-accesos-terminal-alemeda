import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verificarToken = (req, res, next) => {
  // Buscar token en múltiples ubicaciones
  let token = req.headers["authorization"]?.split(" ")[1]; // Bearer token
  
  // Si no está en el header, buscar en query string (para redirecciones)
  if (!token && req.query.token) {
    token = req.query.token;
  }

  // Si no está en query, buscar en cookies
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(403).json({ mensaje: "Token no proporcionado" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ mensaje: "Token inválido o expirado" });
    }
    req.usuario = decoded;
    next();
  });
};

export const verificarRol = (rolesPermitidos) => {
  return (req, res, next) => {
    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ mensaje: "Acceso denegado. Rol no autorizado." });
    }
    next();
  };
};

// Middleware específico para superusuario
export const verificarSuperUsuario = (req, res, next) => {
  return verificarRol(['superusuario'])(req, res, next);
};