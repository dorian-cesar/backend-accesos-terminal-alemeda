import * as User from "../models/user.model.js";
import jwt from "jsonwebtoken";

// Crear usuario
export const crearUsuarioController = async (req, res) => {
  try {
    const { nombre, correo, password, rol } = req.body;

    // Validación básica
    if (!nombre || !correo || !password || !rol) {
      return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    const existente = await User.obtenerUsuarioPorCorreo(correo);
    if (existente) {
      return res.status(409).json({ mensaje: "El correo ya está registrado" });
    }

    const id = await User.crearUsuario({ nombre, correo, password, rol });
    res.status(201).json({ mensaje: "Usuario creado", id });
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
