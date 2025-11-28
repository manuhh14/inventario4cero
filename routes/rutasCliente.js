const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');




// RUTAS

router.post('/registrarCliente', clienteController.registrarCliente);
router.get('/getAllCliente', clienteController.getAllCliente);
router.get('/buscarPorNombre/:nombre', clienteController.buscarPorNombre);
router.get('/buscarPorId/:Id', clienteController.buscarPorId);
router.get('/eliminarPorId/:Id',clienteController.eliminarPorId);
router.put('/actualizarPorId/:id', clienteController.actualizarPorId);


module.exports= router;