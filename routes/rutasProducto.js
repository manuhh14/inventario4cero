const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const productoController = require('../controllers/productoController');



// Configuración de Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); //Esta carpeta debe de estar creada
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

const upload = multer({ storage });




// RUTAS

router.get('/getAllProductos', productoController.getAllProductos);
router.post('/registrarProducto', productoController.registrarProducto);
router.get('/buscarPorNombre/:nombre', productoController.buscarPorNombre);
router.get('/buscarPorId/:Id', productoController.buscarPorId);
router.get('/eliminarPorId/:Id',productoController.eliminarPorId)
router.put('/actualizarPorId/:id', productoController.actualizarPorId);
router.put('/actualizarImagen/:id', upload.single('imagen'), productoController.actualizarImagen);




module.exports= router;