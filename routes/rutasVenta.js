const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/ventaController');

/**
 * ✅ RUTAS DE VENTAS
 * Sincronizadas con el controlador de Ventas optimizado.
 */

// Registrar una nueva transacción desde el APK
router.post('/registrarVenta', ventaController.registrarVenta);

// Obtener el historial completo para la pantalla de "Ventas" de la App
router.get('/getAllVenta', ventaController.getAllVenta);

// Eliminar una venta específica por su ID
// Usamos DELETE por ser el estándar profesional
router.delete('/eliminarVenta/:Id', ventaController.eliminarVenta);

module.exports = router;