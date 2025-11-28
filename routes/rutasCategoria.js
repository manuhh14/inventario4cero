const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');




// RUTAS

router.post('/registrarCategoria', categoriaController.registrarCategoria);
router.get('/getAllCategoria', categoriaController.getAllCategoria);
router.get('/buscarPorNombre/:nombre', categoriaController.buscarPorNombre);
router.get('/buscarPorId/:Id', categoriaController.buscarPorId);
router.get('/eliminarPorId/:Id',categoriaController.eliminarPorId);
router.put('/actualizarPorId/:id', categoriaController.actualizarPorId);


module.exports= router;