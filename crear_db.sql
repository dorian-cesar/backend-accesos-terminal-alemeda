CREATE DATABASE IF NOT EXISTS andenes_alameda CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE andenes_alameda;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol ENUM('operador','administrador','superusuario') DEFAULT 'operador',
  estado ENUM('activo','inactivo') DEFAULT 'activo',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar superusuario con password 'wit123' encriptada con bcrypt
INSERT INTO usuarios (nombre, correo, password, rol, estado)
VALUES (
  'Super Usuario',
  'super@usuario.cl',
  '$2b$10$XVDPaUQO.9GwlxDT/2wLbOysBVEWyAs.gvUNA/q5yAiGsdFZrJdu2',
  'superusuario',
  'activo'
);

-- Tabla para gestión de empresas
CREATE TABLE IF NOT EXISTS empresas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  rut VARCHAR(12) UNIQUE NOT NULL,
  direccion VARCHAR(200),
  telefono VARCHAR(20),
  contacto VARCHAR(100),
  estado ENUM('activa', 'inactiva') DEFAULT 'activa',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Índices para búsquedas rápidas
CREATE INDEX idx_empresa_nombre ON empresas(nombre);
CREATE INDEX idx_empresa_rut ON empresas(rut);
CREATE INDEX idx_empresa_estado ON empresas(estado);

CREATE TABLE IF NOT EXISTS buses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patente VARCHAR(10) UNIQUE NOT NULL,
  tag_uhf VARCHAR(50) UNIQUE NOT NULL DEFAULT 'sin_tag',
  marca VARCHAR(50),
  modelo VARCHAR(50),
  capacidad INT,
  empresa_id INT,
  estado ENUM('activo', 'inactivo') DEFAULT 'activo',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE SET NULL
);

-- Índices para búsquedas rápidas
CREATE INDEX idx_bus_patente ON buses(patente);
CREATE INDEX idx_bus_tag_uhf ON buses(tag_uhf);
CREATE INDEX idx_bus_empresa ON buses(empresa_id);
CREATE INDEX idx_bus_estado ON buses(estado);