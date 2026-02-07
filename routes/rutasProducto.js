const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const productoController = require('../controllers/productoController');
const reporteController = require('../controllers/reporteController');
const qrController = require('../controllers/qrController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, 'uploads/'); },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});
const upload = multer({ storage });

// RUTAS
router.post('/registrarProducto', productoController.registrarProducto);
router.get('/getAllProductos', productoController.getAllProductos);
router.get('/buscarPorId/:Id', productoController.buscarPorId);
router.put('/actualizarImagen/:id', upload.single('imagen'), productoController.actualizarImagen);
router.delete('/eliminarPorId/:Id', productoController.eliminarPorId);

// REPORTES E INTELIGENCIA
router.get('/abc/:mes/:anio', productoController.obtenerABCClasificado);
router.get('/reporte/pdf', reporteController.generarReporteInventario);
router.get('/qr/:id', qrController.generarQRProducto);

module.exports = router;