const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// ==========================================
// ✅ RUTAS DE USUARIOS
// ==========================================

// Registrar un nuevo usuario
router.post('/registrarUsuario', usuarioController.registrarUsuario);

// Obtener todos los usuarios (Corregido a singular para que coincida con el controlador)
router.get('/getAllUsuarios', usuarioController.getAllUsuario); 

// Buscar un usuario por su ID
router.get('/buscarPorId/:Id', usuarioController.buscarPorId);

// Eliminar un usuario
router.delete('/eliminarPorId/:Id', usuarioController.eliminarPorId);

// Actualizar datos de un usuario
router.put('/actualizarPorId/:id', usuarioController.actualizarPorId);

module.exports = router;