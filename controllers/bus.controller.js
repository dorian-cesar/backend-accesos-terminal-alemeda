import * as Bus from "../models/bus.model.js";
import * as Empresa from "../models/empresa.model.js";

// Crear bus
export const crearBusController = async (req, res) => {
  try {
    const { patente, tag_uhf, marca, modelo, capacidad, empresa_id, estado } = req.body;

    // Validación básica - patente y empresa_id son obligatorios
    if (!patente || !empresa_id) {
      return res.status(400).json({ 
        mensaje: "Patente y empresa son obligatorios" 
      });
    }

    // Validar formato de patente
    const patenteRegex = /^[A-Z0-9]{4,10}$/;
    if (!patenteRegex.test(patente)) {
      return res.status(400).json({ 
        mensaje: "Formato de patente inválido" 
      });
    }

    // Validar que la empresa existe
    const empresaExistente = await Empresa.obtenerEmpresaPorId(empresa_id);
    if (!empresaExistente) {
      return res.status(404).json({ 
        mensaje: "Empresa no encontrada" 
      });
    }

    // Validar estado si se proporciona
    if (estado) {
      const estadosPermitidos = ['activo', 'inactivo'];
      if (!estadosPermitidos.includes(estado)) {
        return res.status(400).json({ 
          mensaje: "Estado no válido", 
          estadosPermitidos 
        });
      }
    }

    // Verificar si la patente ya existe
    const busExistentePatente = await Bus.obtenerBusPorPatente(patente);
    if (busExistentePatente) {
      return res.status(409).json({ 
        mensaje: "La patente ya está registrada" 
      });
    }

    // Si se proporciona tag UHF, verificar que no esté en uso (excepto si es 'sin_tag')
    if (tag_uhf && tag_uhf !== 'sin_tag') {
      const busExistenteTag = await Bus.obtenerBusPorTagUHF(tag_uhf);
      if (busExistenteTag) {
        return res.status(409).json({ 
          mensaje: "El tag UHF ya está registrado" 
        });
      }
    }

    const id = await Bus.crearBus({ 
      patente, 
      tag_uhf, 
      marca, 
      modelo, 
      capacidad, 
      empresa_id,
      estado 
    });

    res.status(201).json({ 
      mensaje: "Bus creado exitosamente", 
      id 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al crear bus" });
  }
};

// Obtener buses con filtros opcionales
export const obtenerBusesController = async (req, res) => {
  try {
    const { patente, tag_uhf, empresa_id, estado, marca, modelo } = req.query;
    
    // Si no hay filtros, obtener todos los buses
    if (!patente && !tag_uhf && !empresa_id && !estado && !marca && !modelo) {
      const buses = await Bus.obtenerBuses();
      return res.json(buses);
    }

    // Aplicar filtros según los parámetros proporcionados
    let buses = await Bus.obtenerBuses();
    
    if (patente) {
      buses = buses.filter(bus => 
        bus.patente.toLowerCase().includes(patente.toLowerCase())
      );
    }
    
    if (tag_uhf && tag_uhf !== 'sin_tag') {
      buses = buses.filter(bus => 
        bus.tag_uhf.toLowerCase().includes(tag_uhf.toLowerCase())
      );
    }
    
    if (empresa_id) {
      buses = buses.filter(bus => 
        bus.empresa_id === parseInt(empresa_id)
      );
    }
    
    if (estado) {
      buses = buses.filter(bus => 
        bus.estado === estado
      );
    }
    
    if (marca) {
      buses = buses.filter(bus => 
        bus.marca && bus.marca.toLowerCase().includes(marca.toLowerCase())
      );
    }
    
    if (modelo) {
      buses = buses.filter(bus => 
        bus.modelo && bus.modelo.toLowerCase().includes(modelo.toLowerCase())
      );
    }

    res.json(buses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener buses" });
  }
};

// Obtener bus por ID
export const obtenerBusPorIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const bus = await Bus.obtenerBusPorId(id);
    
    if (!bus) {
      return res.status(404).json({ mensaje: "Bus no encontrado" });
    }
    
    res.json(bus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener bus" });
  }
};

// Obtener bus por tag UHF
export const obtenerBusPorTagUHFController = async (req, res) => {
  try {
    const { tag_uhf } = req.params;
    const bus = await Bus.obtenerBusPorTagUHF(tag_uhf);
    
    if (!bus) {
      return res.status(404).json({ mensaje: "Bus no encontrado" });
    }
    
    res.json(bus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener bus" });
  }
};

// Obtener bus por patente
export const obtenerBusPorPatenteController = async (req, res) => {
  try {
    const { patente } = req.params;
    const bus = await Bus.obtenerBusPorPatente(patente);
    
    if (!bus) {
      return res.status(404).json({ mensaje: "Bus no encontrado" });
    }
    
    res.json(bus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener bus" });
  }
};

// Obtener buses por empresa con filtros opcionales
export const obtenerBusesPorEmpresaController = async (req, res) => {
  try {
    const { empresa_id } = req.params;
    const { patente, tag_uhf, estado, marca, modelo } = req.query;
    
    let buses = await Bus.obtenerBusesPorEmpresa(empresa_id);
    
    // Aplicar filtros adicionales si se proporcionan
    if (patente) {
      buses = buses.filter(bus => 
        bus.patente.toLowerCase().includes(patente.toLowerCase())
      );
    }
    
    if (tag_uhf && tag_uhf !== 'sin_tag') {
      buses = buses.filter(bus => 
        bus.tag_uhf.toLowerCase().includes(tag_uhf.toLowerCase())
      );
    }
    
    if (estado) {
      buses = buses.filter(bus => 
        bus.estado === estado
      );
    }
    
    if (marca) {
      buses = buses.filter(bus => 
        bus.marca && bus.marca.toLowerCase().includes(marca.toLowerCase())
      );
    }
    
    if (modelo) {
      buses = buses.filter(bus => 
        bus.modelo && bus.modelo.toLowerCase().includes(modelo.toLowerCase())
      );
    }

    res.json(buses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener buses de la empresa" });
  }
};

// Buscar buses por criterios múltiples
export const buscarBusesController = async (req, res) => {
  try {
    const { q, campo } = req.query;
    
    if (!q) {
      return res.status(400).json({ 
        mensaje: "El parámetro de búsqueda 'q' es requerido" 
      });
    }

    const buses = await Bus.obtenerBuses();
    let resultados = [];

    if (campo) {
      // Búsqueda por campo específico
      switch (campo.toLowerCase()) {
        case 'patente':
          resultados = buses.filter(bus => 
            bus.patente.toLowerCase().includes(q.toLowerCase())
          );
          break;
        case 'tag_uhf':
          resultados = buses.filter(bus => 
            bus.tag_uhf.toLowerCase().includes(q.toLowerCase()) && bus.tag_uhf !== 'sin_tag'
          );
          break;
        case 'marca':
          resultados = buses.filter(bus => 
            bus.marca && bus.marca.toLowerCase().includes(q.toLowerCase())
          );
          break;
        case 'modelo':
          resultados = buses.filter(bus => 
            bus.modelo && bus.modelo.toLowerCase().includes(q.toLowerCase())
          );
          break;
        case 'empresa':
          resultados = buses.filter(bus => 
            bus.empresa_nombre && bus.empresa_nombre.toLowerCase().includes(q.toLowerCase())
          );
          break;
        default:
          return res.status(400).json({ 
            mensaje: "Campo de búsqueda no válido. Campos permitidos: patente, tag_uhf, marca, modelo, empresa" 
          });
      }
    } else {
      // Búsqueda general en todos los campos relevantes
      resultados = buses.filter(bus => 
        bus.patente.toLowerCase().includes(q.toLowerCase()) ||
        (bus.tag_uhf !== 'sin_tag' && bus.tag_uhf.toLowerCase().includes(q.toLowerCase())) ||
        (bus.marca && bus.marca.toLowerCase().includes(q.toLowerCase())) ||
        (bus.modelo && bus.modelo.toLowerCase().includes(q.toLowerCase())) ||
        (bus.empresa_nombre && bus.empresa_nombre.toLowerCase().includes(q.toLowerCase()))
      );
    }

    res.json({
      total: resultados.length,
      resultados
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al buscar buses" });
  }
};

// Actualizar bus (campos individuales)
export const actualizarBusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { patente, tag_uhf, marca, modelo, capacidad, empresa_id, estado } = req.body;

    // Verificar que al menos un campo sea proporcionado
    if (!patente && !tag_uhf && !marca && !modelo && !capacidad && !empresa_id && !estado) {
      return res.status(400).json({ 
        mensaje: "Debe proporcionar al menos un campo para actualizar" 
      });
    }

    // Verificar que el bus existe
    const busExistente = await Bus.obtenerBusPorId(id);
    if (!busExistente) {
      return res.status(404).json({ mensaje: "Bus no encontrado" });
    }

    // Si se está actualizando la patente, verificar que no esté en uso
    if (patente && patente !== busExistente.patente) {
      const busConPatente = await Bus.obtenerBusPorPatente(patente);
      if (busConPatente) {
        return res.status(409).json({ 
          mensaje: "La patente ya está en uso por otro bus" 
        });
      }
    }

    // Si se está actualizando el tag UHF, verificar que no esté en uso (excepto si es 'sin_tag')
    if (tag_uhf && tag_uhf !== 'sin_tag' && tag_uhf !== busExistente.tag_uhf) {
      const busConTag = await Bus.obtenerBusPorTagUHF(tag_uhf);
      if (busConTag) {
        return res.status(409).json({ 
          mensaje: "El tag UHF ya está en uso por otro bus" 
        });
      }
    }

    // Si se está actualizando la empresa, verificar que existe
    if (empresa_id && empresa_id !== busExistente.empresa_id) {
      const empresaExistente = await Empresa.obtenerEmpresaPorId(empresa_id);
      if (!empresaExistente) {
        return res.status(404).json({ 
          mensaje: "Empresa no encontrada" 
        });
      }
    }

    // Validar estado si se está actualizando
    if (estado) {
      const estadosPermitidos = ['activo', 'inactivo'];
      if (!estadosPermitidos.includes(estado)) {
        return res.status(400).json({ 
          mensaje: "Estado no válido", 
          estadosPermitidos 
        });
      }
    }

    // Validar capacidad si se está actualizando
    if (capacidad && (capacidad < 1 || capacidad > 100)) {
      return res.status(400).json({ 
        mensaje: "La capacidad debe estar entre 1 y 100" 
      });
    }

    // Preparar campos para actualizar
    const camposActualizados = {};
    if (patente !== undefined) camposActualizados.patente = patente;
    if (tag_uhf !== undefined) camposActualizados.tag_uhf = tag_uhf;
    if (marca !== undefined) camposActualizados.marca = marca;
    if (modelo !== undefined) camposActualizados.modelo = modelo;
    if (capacidad !== undefined) camposActualizados.capacidad = capacidad;
    if (empresa_id !== undefined) camposActualizados.empresa_id = empresa_id;
    if (estado !== undefined) camposActualizados.estado = estado;

    const actualizado = await Bus.actualizarBus(id, camposActualizados);
    
    if (!actualizado) {
      return res.status(400).json({ mensaje: "No se pudo actualizar el bus" });
    }

    res.json({ 
      mensaje: "Bus actualizado correctamente",
      camposActualizados 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al actualizar bus" });
  }
};

// Cambiar estado del bus
export const cambiarEstadoBusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado) {
      return res.status(400).json({ mensaje: "El estado es obligatorio" });
    }

    const estadosPermitidos = ['activo', 'inactivo'];
    if (!estadosPermitidos.includes(estado)) {
      return res.status(400).json({ 
        mensaje: "Estado no válido", 
        estadosPermitidos 
      });
    }

    const busExistente = await Bus.obtenerBusPorId(id);
    if (!busExistente) {
      return res.status(404).json({ mensaje: "Bus no encontrado" });
    }

    const actualizado = await Bus.cambiarEstadoBus(id, estado);
    
    if (!actualizado) {
      return res.status(400).json({ 
        mensaje: "No se pudo cambiar el estado del bus" 
      });
    }

    res.json({ 
      mensaje: `Bus ${estado === 'activo' ? 'activado' : 'desactivado'} correctamente`,
      estado 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al cambiar estado del bus" });
  }
};

// Validar acceso de bus (para integración con sistema UHF)
export const validarAccesoBusController = async (req, res) => {
  try {
    const { tag_uhf } = req.body;

    if (!tag_uhf) {
      return res.status(400).json({ 
        mensaje: "El tag UHF es obligatorio" 
      });
    }

    // No validar buses con tag 'sin_tag'
    if (tag_uhf === 'sin_tag') {
      return res.status(403).json({
        autorizado: false,
        mensaje: "Bus no tiene tag UHF asignado"
      });
    }

    // Buscar bus por tag UHF
    const bus = await Bus.obtenerBusPorTagUHF(tag_uhf);
    
    if (!bus) {
      return res.status(404).json({ 
        autorizado: false,
        mensaje: "Bus no registrado o inactivo" 
      });
    }

    if (bus.estado !== 'activo') {
      return res.status(403).json({
        autorizado: false,
        mensaje: `Bus no está activo (estado: ${bus.estado})`
      });
    }

    res.json({
      autorizado: true,
      mensaje: "Bus autorizado para acceso",
      bus: {
        id: bus.id,
        patente: bus.patente,
        marca: bus.marca,
        modelo: bus.modelo,
        capacidad: bus.capacidad,
        empresa_id: bus.empresa_id,
        empresa_nombre: bus.empresa_nombre
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      autorizado: false,
      mensaje: "Error al validar acceso del bus" 
    });
  }
};