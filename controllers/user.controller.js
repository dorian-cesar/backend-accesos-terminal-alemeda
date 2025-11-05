import * as User from "../models/user.model.js";

// Crear usuario
export const crearUsuarioController = async (req, res) => {
  try {
    const { nombre, correo, password, rol } = req.body;

    // Validación básica
    if (!nombre || !correo || !password || !rol) {
      return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      return res.status(400).json({ mensaje: "Formato de correo inválido" });
    }

    // Validar roles permitidos según la base de datos
    const rolesPermitidos = ['operador', 'administrador'];
    if (!rolesPermitidos.includes(rol)) {
      return res.status(400).json({ 
        mensaje: "Rol no válido", 
        rolesPermitidos 
      });
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      return res.status(400).json({ mensaje: "La contraseña debe tener al menos 6 caracteres" });
    }

    const existente = await User.obtenerUsuarioPorCorreo(correo);
    if (existente) {
      return res.status(409).json({ mensaje: "El correo ya está registrado" });
    }

    const id = await User.crearUsuario({ nombre, correo, password, rol });
    res.status(201).json({ 
      mensaje: "Usuario creado exitosamente", 
      id 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al crear usuario" });
  }
};

// Obtener todos los usuarios
export const obtenerUsuariosController = async (req, res) => {
  try {
    const usuarios = await User.obtenerUsuarios();
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener usuarios" });
  }
};

// Obtener usuario por ID
export const obtenerUsuarioPorIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await User.obtenerUsuarioPorId(id);
    
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    
    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener usuario" });
  }
};

// Actualizar usuario (campos individuales)
export const actualizarUsuarioController = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, correo, rol, estado } = req.body;

    // Verificar que al menos un campo sea proporcionado
    if (!nombre && !correo && !rol && !estado) {
      return res.status(400).json({ 
        mensaje: "Debe proporcionar al menos un campo para actualizar (nombre, correo, rol o estado)" 
      });
    }

    // Verificar que el usuario existe
    const usuarioExistente = await User.obtenerUsuarioPorId(id);
    if (!usuarioExistente) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    // Si se está actualizando el correo, verificar que no esté en uso
    if (correo && correo !== usuarioExistente.correo) {
      const usuarioConCorreo = await User.obtenerUsuarioPorCorreo(correo);
      if (usuarioConCorreo) {
        return res.status(409).json({ mensaje: "El correo ya está en uso por otro usuario" });
      }
    }

    // Validar rol si se está actualizando
    if (rol) {
      const rolesPermitidos = ['operador', 'administrador'];
      if (!rolesPermitidos.includes(rol)) {
        return res.status(400).json({ 
          mensaje: "Rol no válido", 
          rolesPermitidos 
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

    // Preparar campos para actualizar
    const camposActualizados = {};
    if (nombre !== undefined) camposActualizados.nombre = nombre;
    if (correo !== undefined) camposActualizados.correo = correo;
    if (rol !== undefined) camposActualizados.rol = rol;
    if (estado !== undefined) camposActualizados.estado = estado;

    const actualizado = await User.actualizarUsuario(id, camposActualizados);
    
    if (!actualizado) {
      return res.status(400).json({ mensaje: "No se pudo actualizar el usuario" });
    }

    res.json({ 
      mensaje: "Usuario actualizado correctamente",
      camposActualizados 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al actualizar usuario" });
  }
};

// Actualizar contraseña
export const actualizarPasswordUsuarioController = async (req, res) => {
  try {
    const { id } = req.params;
    const { nuevaPassword } = req.body;

    if (!nuevaPassword) {
      return res.status(400).json({ mensaje: "La nueva contraseña es obligatoria" });
    }

    if (nuevaPassword.length < 6) {
      return res.status(400).json({ mensaje: "La contraseña debe tener al menos 6 caracteres" });
    }

    const usuarioExistente = await User.obtenerUsuarioPorId(id);
    if (!usuarioExistente) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    const actualizado = await User.actualizarPasswordUsuario(id, nuevaPassword);
    
    if (!actualizado) {
      return res.status(400).json({ mensaje: "No se pudo actualizar la contraseña" });
    }

    res.json({ mensaje: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al actualizar contraseña" });
  }
};

// Cambiar estado del usuario (activar/desactivar)
export const cambiarEstadoUsuarioController = async (req, res) => {
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

    const usuarioExistente = await User.obtenerUsuarioPorId(id);
    if (!usuarioExistente) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    // No permitir desactivar al superusuario por defecto
    if (usuarioExistente.correo === 'super@usuario.cl' && estado === 'inactivo') {
      return res.status(403).json({ mensaje: "No se puede desactivar el superusuario del sistema" });
    }

    const actualizado = await User.cambiarEstadoUsuario(id, estado);
    
    if (!actualizado) {
      return res.status(400).json({ mensaje: "No se pudo cambiar el estado del usuario" });
    }

    res.json({ 
      mensaje: `Usuario ${estado === 'activo' ? 'activado' : 'desactivado'} correctamente`,
      estado 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al cambiar estado del usuario" });
  }
};