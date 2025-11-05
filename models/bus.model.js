import pool from "../config/db.js";

export const crearBus = async (bus) => {
  const { patente, tag_uhf, marca, modelo, capacidad, empresa_id, estado } = bus;
  
  const [result] = await pool.query(
    `INSERT INTO buses (patente, tag_uhf, marca, modelo, capacidad, empresa_id, estado) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [patente, tag_uhf || 'sin_tag', marca, modelo, capacidad, empresa_id, estado || 'activo']
  );
  
  return result.insertId;
};

export const obtenerBuses = async () => {
  const [rows] = await pool.query(
    `SELECT b.id, b.patente, b.tag_uhf, b.marca, b.modelo, b.capacidad, 
            b.empresa_id, e.nombre as empresa_nombre, b.estado, b.creado_en 
     FROM buses b 
     LEFT JOIN empresas e ON b.empresa_id = e.id 
     WHERE b.estado != 'eliminado'`
  );
  return rows;
};

export const obtenerBusPorId = async (id) => {
  const [rows] = await pool.query(
    `SELECT b.id, b.patente, b.tag_uhf, b.marca, b.modelo, b.capacidad, 
            b.empresa_id, e.nombre as empresa_nombre, e.rut as empresa_rut, b.estado, b.creado_en 
     FROM buses b 
     LEFT JOIN empresas e ON b.empresa_id = e.id 
     WHERE b.id = ? AND b.estado != 'eliminado'`,
    [id]
  );
  return rows[0];
};

export const obtenerBusPorTagUHF = async (tag_uhf) => {
  const [rows] = await pool.query(
    `SELECT b.*, e.nombre as empresa_nombre, e.rut as empresa_rut 
     FROM buses b 
     LEFT JOIN empresas e ON b.empresa_id = e.id 
     WHERE b.tag_uhf = ? AND b.estado = 'activo'`,
    [tag_uhf]
  );
  return rows[0];
};

export const obtenerBusPorPatente = async (patente) => {
  const [rows] = await pool.query(
    `SELECT b.*, e.nombre as empresa_nombre, e.rut as empresa_rut 
     FROM buses b 
     LEFT JOIN empresas e ON b.empresa_id = e.id 
     WHERE b.patente = ? AND b.estado = 'activo'`,
    [patente]
  );
  return rows[0];
};

export const obtenerBusesPorEmpresa = async (empresa_id) => {
  const [rows] = await pool.query(
    `SELECT b.id, b.patente, b.tag_uhf, b.marca, b.modelo, b.capacidad, b.estado, b.creado_en 
     FROM buses b 
     WHERE b.empresa_id = ? AND b.estado != 'eliminado'`,
    [empresa_id]
  );
  return rows;
};

export const actualizarBus = async (id, camposActualizados) => {
  const camposPermitidos = ['patente', 'tag_uhf', 'marca', 'modelo', 'capacidad', 'empresa_id', 'estado'];
  const camposParaActualizar = [];
  const valores = [];
  
  for (const [campo, valor] of Object.entries(camposActualizados)) {
    if (camposPermitidos.includes(campo) && valor !== undefined) {
      camposParaActualizar.push(`${campo} = ?`);
      valores.push(valor);
    }
  }
  
  if (camposParaActualizar.length === 0) {
    return false;
  }
  
  valores.push(id);
  
  const query = `UPDATE buses SET ${camposParaActualizar.join(', ')} WHERE id = ?`;
  const [result] = await pool.query(query, valores);
  return result.affectedRows > 0;
};

export const cambiarEstadoBus = async (id, nuevoEstado) => {
  const [result] = await pool.query(
    "UPDATE buses SET estado = ? WHERE id = ?",
    [nuevoEstado, id]
  );
  return result.affectedRows > 0;
};