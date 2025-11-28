const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');




// RUTAS

router.post('/registrarUsuario', usuarioController.registrarUsuario);
router.get('/getAllUsuarios', usuarioController.getAllUsuario);
router.get('/buscarPorNombre/:nombre', usuarioController.buscarPorNombre);
router.get('/buscarPorId/:Id', usuarioController.buscarPorId);
router.get('/eliminarPorId/:Id',usuarioController.eliminarPorId);
router.put('/actualizarPorId/:id', usuarioController.actualizarPorId);


module.exports= router;