import pool from "../config/db.js";
import bcrypt from "bcryptjs";

export const crearUsuario = async (usuario) => {
  const { nombre, correo, password, rol } = usuario;

  // Hashear password antes de insertar
  const hashedPassword = await bcrypt.hash(password, 10);

  const [result] = await pool.query(
    "INSERT INTO usuarios (nombre, correo, password, rol) VALUES (?, ?, ?, ?)",
    [nombre, correo, hashedPassword, rol]
  );

  return result.insertId;
};

export const obtenerUsuarios = async () => {
  const [rows] = await pool.query(
    "SELECT id, nombre, correo, rol, creado_en FROM usuarios"
  );
  return rows;
};

export const obtenerUsuarioPorCorreo = async (correo) => {
  const [rows] = await pool.query(
    "SELECT * FROM usuarios WHERE correo = ?",
    [correo]
  );
  return rows[0];
};

export const obtenerUsuarioPorId = async (id) => {
  const [rows] = await pool.query(
    "SELECT id, nombre, correo, rol, creado_en FROM usuarios WHERE id = ?",
    [id]
  );
  return rows[0];
};

export const actualizarUsuario = async (id, datosActualizados) => {
  const { nombre, correo, rol } = datosActualizados;
  
  const [result] = await pool.query(
    "UPDATE usuarios SET nombre = ?, correo = ?, rol = ? WHERE id = ?",
    [nombre, correo, rol, id]
  );
  
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

export const actualizarUsuarioCompleto = async (id, datosActualizados) => {
  const { nombre, correo, password, rol } = datosActualizados;
  
  let query = "UPDATE usuarios SET nombre = ?, correo = ?, rol = ?";
  let params = [nombre, correo, rol];
  
  // Si se proporciona una nueva password, incluirla en la actualización
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    query += ", password = ?";
    params.push(hashedPassword);
  }
  
  query += " WHERE id = ?";
  params.push(id);
  
  const [result] = await pool.query(query, params);
  return result.affectedRows > 0;
};

export const eliminarUsuario = async (id) => {
  const [result] = await pool.query("DELETE FROM usuarios WHERE id = ?", [id]);
  return result.affectedRows > 0;
};