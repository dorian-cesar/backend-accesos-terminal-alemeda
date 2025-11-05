// controllers/empresa.controller.js
import * as EmpresaService from '../models/empresa.model.js';

export const crearEmpresa = async (req, res) => {
  try {
    const { nombre, rut, direccion, telefono, contacto, estado } = req.body;

    // Validaciones básicas
    if (!nombre || !rut) {
      return res.status(400).json({
        success: false,
        message: 'Nombre y RUT son campos obligatorios'
      });
    }

    // Verificar si ya existe una empresa con el mismo RUT
    const empresaExistente = await EmpresaService.obtenerEmpresaPorRut(rut, true);
    if (empresaExistente) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe una empresa con este RUT'
      });
    }

    const empresaId = await EmpresaService.crearEmpresa({
      nombre,
      rut,
      direccion,
      telefono,
      contacto,
      estado
    });

    res.status(201).json({
      success: true,
      message: 'Empresa creada exitosamente',
      data: { id: empresaId }
    });
  } catch (error) {
    console.error('Error al crear empresa:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const listarEmpresas = async (req, res) => {
  try {
    const { incluirInactivas } = req.query;
    const empresas = await EmpresaService.obtenerEmpresas(incluirInactivas === 'true');

    res.json({
      success: true,
      data: empresas,
      total: empresas.length
    });
  } catch (error) {
    console.error('Error al listar empresas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const obtenerEmpresa = async (req, res) => {
  try {
    const { id } = req.params;
    const { incluirInactivas } = req.query;
    
    const empresa = await EmpresaService.obtenerEmpresaPorId(parseInt(id), incluirInactivas === 'true');

    if (!empresa) {
      return res.status(404).json({
        success: false,
        message: 'Empresa no encontrada'
      });
    }

    res.json({
      success: true,
      data: empresa
    });
  } catch (error) {
    console.error('Error al obtener empresa:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const actualizarEmpresa = async (req, res) => {
  try {
    const { id } = req.params;
    const camposActualizados = req.body;

    if (Object.keys(camposActualizados).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionaron campos para actualizar'
      });
    }

    // Si se está actualizando el RUT, verificar que no exista otra empresa con el mismo RUT
    if (camposActualizados.rut) {
      const empresaExistente = await EmpresaService.obtenerEmpresaPorRut(camposActualizados.rut, true);
      if (empresaExistente && empresaExistente.id !== parseInt(id)) {
        return res.status(409).json({
          success: false,
          message: 'Ya existe otra empresa con este RUT'
        });
      }
    }

    await EmpresaService.actualizarEmpresa(parseInt(id), camposActualizados);

    res.json({
      success: true,
      message: 'Empresa actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar empresa:', error);
    
    if (error.message.includes('Estado inválido') || error.message.includes('No hay campos válidos')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
    if (error.message.includes('no encontrada')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const cambiarEstadoEmpresa = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado || !['activa', 'inactiva'].includes(estado)) {
      return res.status(400).json({
        success: false,
        message: 'Estado inválido. Solo se permiten: activa, inactiva'
      });
    }

    await EmpresaService.cambiarEstadoEmpresa(parseInt(id), estado);

    res.json({
      success: true,
      message: `Empresa ${estado === 'activa' ? 'activada' : 'desactivada'} exitosamente`
    });
  } catch (error) {
    console.error('Error al cambiar estado de empresa:', error);
    
    if (error.message.includes('no encontrada')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const activarEmpresa = async (req, res) => {
  try {
    const { id } = req.params;
    
    await EmpresaService.activarEmpresa(parseInt(id));

    res.json({
      success: true,
      message: 'Empresa activada exitosamente'
    });
  } catch (error) {
    console.error('Error al activar empresa:', error);
    
    if (error.message.includes('no encontrada')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const desactivarEmpresa = async (req, res) => {
  try {
    const { id } = req.params;
    
    await EmpresaService.desactivarEmpresa(parseInt(id));

    res.json({
      success: false,
      message: 'Empresa desactivada exitosamente'
    });
  } catch (error) {
    console.error('Error al desactivar empresa:', error);
    
    if (error.message.includes('no encontrada')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};