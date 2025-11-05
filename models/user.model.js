import pool from "../config/db.js";
import bcrypt from "bcryptjs";

export const crearUsuario = async (usuario) => {
  const { nombre, correo, password, rol } = usuario;

  // Hashear password antes de insertar
  const hashedPassword = await bcrypt.hash(password, 10);

  const [result] = await pool.query(
    "INSERT INTO usuarios (nombre, correo, password, rol, estado) VALUES (?, ?, ?, ?, 'activo')",
    [nombre, correo, hashedPassword, rol]
  );

  return result.insertId;
};

export const obtenerUsuarios = async () => {
  const [rows] = await pool.query(
    "SELECT id, nombre, correo, rol, estado, creado_en FROM usuarios WHERE estado != 'eliminado'"
  );
  return rows;
};

export const obtenerUsuarioPorCorreo = async (correo) => {
  const [rows] = await pool.query(
    "SELECT * FROM usuarios WHERE correo = ? AND estado != 'eliminado'",
    [correo]
  );
  return rows[0];
};

export const obtenerUsuarioPorId = async (id) => {
  const [rows] = await pool.query(
    "SELECT id, nombre, correo, rol, estado, creado_en FROM usuarios WHERE id = ? AND estado != 'eliminado'",
    [id]
  );
  return rows[0];
};

export const actualizarUsuario = async (id, camposActualizados) => {
  const camposPermitidos = ['nombre', 'correo', 'rol', 'estado'];
  const camposParaActualizar = [];
  const valores = [];
  
  // Construir dinámicamente la consulta UPDATE
  for (const [campo, valor] of Object.entries(camposActualizados)) {
    if (camposPermitidos.includes(campo) && valor !== undefined) {
      camposParaActualizar.push(`${campo} = ?`);
      valores.push(valor);
    }
  }
  
  // Si no hay campos para actualizar, retornar false
  if (camposParaActualizar.length === 0) {
    return false;
  }
  
  valores.push(id);
  
  const query = `UPDATE usuarios SET ${camposParaActualizar.join(', ')} WHERE id = ?`;
  
  const [result] = await pool.query(query, valores);
  return result.affectedRows > 0;
};

export const actualizarPasswordUsuario = async (id, nuevaPassword) => {
  const hashedPassword = await bcrypt.hash(nuevaPassword, 10);
  
  const [result] = await pool.query(
    "UPDATE usuarios SET password = ? WHERE id = ?",
    [hashedPassword, id]
  );
  
  return result.affectedRows > 0;
};

export const cambiarEstadoUsuario = async (id, nuevoEstado) => {
  const [result] = await pool.query(
    "UPDATE usuarios SET estado = ? WHERE id = ?",
    [nuevoEstado, id]
  );
  
  return result.affectedRows > 0;
};