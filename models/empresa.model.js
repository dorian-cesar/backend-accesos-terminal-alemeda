// models/empresa.model.js
import pool from "../config/db.js";

export const crearEmpresa = async (empresa) => {
  const { nombre, rut, direccion, telefono, contacto, estado = 'activa' } = empresa;
  
  const [result] = await pool.query(
    `INSERT INTO empresas (nombre, rut, direccion, telefono, contacto, estado) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [nombre, rut, direccion, telefono, contacto, estado]
  );
  
  return result.insertId;
};

export const obtenerEmpresas = async (incluirInactivas = false) => {
  let query = "SELECT id, nombre, rut, direccion, telefono, contacto, estado, creado_en FROM empresas";
  const params = [];
  
  if (!incluirInactivas) {
    query += " WHERE estado = 'activa'";
  }
  
  query += " ORDER BY nombre ASC";
  
  const [rows] = await pool.query(query, params);
  return rows;
};

export const obtenerEmpresaPorId = async (id, incluirInactivas = false) => {
  let query = "SELECT id, nombre, rut, direccion, telefono, contacto, estado, creado_en FROM empresas WHERE id = ?";
  const params = [id];
  
  if (!incluirInactivas) {
    query += " AND estado = 'activa'";
  }
  
  const [rows] = await pool.query(query, params);
  return rows[0];
};

export const obtenerEmpresaPorRut = async (rut, incluirInactivas = false) => {
  let query = "SELECT * FROM empresas WHERE rut = ?";
  const params = [rut];
  
  if (!incluirInactivas) {
    query += " AND estado = 'activa'";
  }
  
  const [rows] = await pool.query(query, params);
  return rows[0];
};

export const actualizarEmpresa = async (id, camposActualizados) => {
  const camposPermitidos = ['nombre', 'rut', 'direccion', 'telefono', 'contacto', 'estado'];
  const camposParaActualizar = [];
  const valores = [];
  
  for (const [campo, valor] of Object.entries(camposActualizados)) {
    if (camposPermitidos.includes(campo) && valor !== undefined) {
      // Validación específica para el campo estado
      if (campo === 'estado' && !['activa', 'inactiva'].includes(valor)) {
        throw new Error('Estado inválido. Solo se permiten: activa, inactiva');
      }
      
      camposParaActualizar.push(`${campo} = ?`);
      valores.push(valor);
    }
  }
  
  if (camposParaActualizar.length === 0) {
    throw new Error('No hay campos válidos para actualizar');
  }
  
  valores.push(id);
  
  const query = `UPDATE empresas SET ${camposParaActualizar.join(', ')} WHERE id = ?`;
  const [result] = await pool.query(query, valores);
  
  if (result.affectedRows === 0) {
    throw new Error('Empresa no encontrada');
  }
  
  return true;
};

export const cambiarEstadoEmpresa = async (id, nuevoEstado) => {
  return await actualizarEmpresa(id, { estado: nuevoEstado });
};

export const activarEmpresa = async (id) => {
  return await actualizarEmpresa(id, { estado: 'activa' });
};

export const desactivarEmpresa = async (id) => {
  return await actualizarEmpresa(id, { estado: 'inactiva' });
};

export const eliminarEmpresa = async (id) => {
  return await desactivarEmpresa(id);
};