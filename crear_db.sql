CREATE DATABASE IF NOT EXISTS andenes_alameda CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE andenes_alameda;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol ENUM('operador','administrador','superusuario') DEFAULT 'operador',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar superusuario con password 'wit123' encriptada con bcrypt
INSERT INTO usuarios (nombre, correo, password, rol)
VALUES (
  'Super Usuario',
  'super@usuario.cl',
  '$2b$10$XVDPaUQO.9GwlxDT/2wLbOysBVEWyAs.gvUNA/q5yAiGsdFZrJdu2',
  'superusuario'
);
