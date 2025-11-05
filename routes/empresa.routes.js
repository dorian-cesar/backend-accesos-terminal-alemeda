// routes/empresa.routes.js
import express from 'express';
import {
  crearEmpresa,
  listarEmpresas,
  obtenerEmpresa,
  actualizarEmpresa,
  cambiarEstadoEmpresa,
  activarEmpresa,
  desactivarEmpresa
} from '../controllers/empresa.controller.js';

import { verificarToken, verificarRol } from '../middleware/auth.middleware.js';

const router = express.Router();

// 🔐 Todas las rutas requieren autenticación y rol de administrador o superusuario
const rolesPermitidos = ['superusuario', 'administrador'];

// Rutas para empresas
router.post('/', verificarToken, verificarRol(rolesPermitidos), crearEmpresa);
router.get('/', verificarToken, verificarRol(rolesPermitidos), listarEmpresas);
router.get('/:id', verificarToken, verificarRol(rolesPermitidos), obtenerEmpresa);
router.put('/:id', verificarToken, verificarRol(rolesPermitidos), actualizarEmpresa);
router.patch('/:id/estado', verificarToken, verificarRol(rolesPermitidos), cambiarEstadoEmpresa);
router.patch('/:id/activar', verificarToken, verificarRol(rolesPermitidos), activarEmpresa);
router.patch('/:id/desactivar', verificarToken, verificarRol(rolesPermitidos), desactivarEmpresa);

export default router;