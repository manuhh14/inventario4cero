const express = require('express');
const router = express.Router();
const estadisticasController = require('../controllers/estadisticasController'); // Importa el nuevo controlador

// RUTA PARA GRÁFICAS: Total Vendido por Año (Esta es correcta)
router.get('/ventas-mensuales/:anio', estadisticasController.obtenerVentasPorMes);

// NUEVA RUTA: Análisis ABC (Debe incluir el MES)
router.get('/ventas-abc/:mes/:anio', estadisticasController.obtenerVentasABC);

module.exports = router;    