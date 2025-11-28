//const productoModels = require('../models/producto');
const Producto = require('../models/producto');
const productoController = {};
// PARA GENERAR Y GUARDAR QE
const qrcode = require('qrcode');
const fs = require ('fs');
const path = require('path');
//PARA GENERAR CODIGO DE BARRAS
const bwipjs = require ('bwip-js');


//OBTENER TODOS LOS PRODUCTOS
productoController.getAllProductos = async (req, res) => {
    try {
        const productos = await Producto.getAll();
        res.status(200).json(productos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message:"Error al obtener los productos"});
    }
};



// //REGISTRAR PRODUCTOS
// productoController.registrarProducto = async (req, res, next) => {
//     try {
//        const producto = req.body;
//         console.log("Producto registrado:", producto); 
        
//         if (!producto.id_producto || 
//             !producto.nombre_producto || 
//             !producto.descripcion_producto || 
//             !producto.codigo_barras || 
//             !producto.sku || 
//             !producto.precio_compra || 
//             !producto.precio_venta || 
//             !producto.precio_total || 
//             !producto.stock_actual || 
//             !producto.stock_minimo || 
//             !producto.stock_maximo || 
//             !producto.id_categoria || 
//             !producto.id_proveedor || 
//             !producto.fecha_creacion || 
//             !producto.estado || 
//             !producto.codigo_qr ) {
    
//             return res.status(400).json({
//                 success: false,
//                 message: "Faltan campos requeridos",
//             });
//         }

//         const nuevoProducto = await Producto.registrarProducto(req.body);

//          return res.status(201).json({
//             success: true,
//             message: "Producto registrado correctamente",
//             data: nuevoProducto
//         });

//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             success: false,
//             message: "Error al registrar producto",
//             error: error.message
//         });
//     }
// };


//BUSCAR POR NOMBRE DEL PRODUCTO

productoController.buscarPorNombre = async (req, res) => {
  try {
    const { nombre } = req.params;
    console.log('Nombre recibido:', nombre);

    if (!nombre) {
      return res.status(400).json({ success: false, message: 'Nombre requerido' });
    }

    const resultados = await Producto.buscarPorNombre(nombre);
    
    if (resultados.length === 0) {
      return res.status(200).json({ 
        success: true, 
        message: "No se encontraron productos", 
        data: [] 
      });
    }

    return res.status(200).json({ success: true, data: resultados });

  } catch (error) {
    console.error('Error en controlador:', error.message);
    return res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor',
      error: error.message 
    });
  }
};




//BUSCAR POR ID DEL PRODUCTO

productoController.buscarPorId = async (req, res) => {
  try {
    const { Id } = req.params;
    console.log('Id recibido:', Id);

    if (!Id) {
      return res.status(400).json({ success: false, message: 'Id requerido' });
    }

    const resultados = await Producto.buscarPorId(Id);
    
    if (resultados.length === 0) {
      return res.status(200).json({ 
        success: true, 
        message: "No se encontró Id", 
        data: [] 
      });
    }

    return res.status(200).json({ success: true, data: resultados });

  } catch (error) {
    console.error('Error en controlador:', error.message);
    return res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor',
      error: error.message 
    });
  }
};




//ELIMINAR POR ID
productoController.eliminarPorId = async (req, res) => {
  try {
    const { Id } = req.params;
    console.log('Id recibido para eliminar:', Id);

    if (!Id) {
      return res.status(400).json({ success: false, message: 'Id requerido para eliminar'});
    }
    const filasEliminadas = await Producto.eliminarPorId(Id);

    if (filasEliminadas === 0) {
      return res.status(400).json({ success: false, message: 'No se encontró producto con ese Id'});
    }
    return res.status(200).json({ success: true, message: 'Producto eliminado correctamente'});
  } catch (error) {
    console.error('Error en controlador al eliminar:', error.mesaage);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al eliminar',
      error: error.message
    });
  }
};




//ACTUALIZAR POR ID

productoController.actualizarPorId = async (req, res) => {
  const id_producto = req.params.id;
  const datos = req.body;

  if (!id_producto) {
    return res.status(400).json({ message: 'El id_producto es requerido' });
  }

  try {
    const filasActualizadas = await Producto.actualizarPorId(id_producto, datos);

    if (filasActualizadas === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto actualizado correctamente' });
  } catch (error) {
    console.error('Error en controlador actualizarPorId:', error);
    res.status(500).json({ message: 'Error al actualizar el producto' });
  }
};




//SUBIR Y ACTUALIZAR IMAGEN 

//const { Pool } = require('pg');
//const pool = new Pool({ /* tu configuración de conexión */ });

productoController.actualizarImagen = async (req, res) => {
  try {
    const id = req.params.id;
    const nombreProducto = req.body.nombreProducto; 

    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ninguna imagen' });
    }
    if (!nombreProducto) {
      return res.status(400).json({ error: 'Falta el nombre del producto' });
    }

    const nombreArchivo = req.file.filename;

    await Producto.actualizarImagen(id, nombreProducto, nombreArchivo);

    res.json({ mensaje: 'Producto e imagen actualizados correctamente' });
  } catch (error) {
    console.error('Error al actualizar imagen:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};




//GENERAR Y GUARDAR QR
const generarYGuardarQR = async (idProducto) => {
  try {
    console.log('Valor recibido para generar QR:', idProducto);

    if (!idProducto || (typeof idProducto !== 'string' && typeof idProducto !== 'number')) {
      throw new Error('El id_producto es inválido para generar QR');
    }

    const qrFolder = path.join(__dirname, '../public/codes');
    const qrPath = path.join(qrFolder, `qr-${idProducto}.png`);

    await fs.promises.mkdir(qrFolder, { recursive:true});
    await qrcode.toFile(qrPath, String(idProducto));

    return `/public/qrcodes/qr-${idProducto}.png`;
  } catch (error) {
    throw new Error(`Error generando QR: ${error.message}`);
  }
};




// //REGISTRAR PRODUCTO Y GENERAR QR 
// productoController.registrarProducto = async (req, res, next) => {
//     try {
//         const producto = req.body;


//         console.log('Producto recibido:', producto);
//         console.log('ID producto para QR:', producto.id_producto);

        
//         // Eliminar codigo_qr de la validación (ahora lo generamos)
//         const requiredFields = [
//             'id_producto', 'nombre_producto', 'descripcion_producto',
//             'codigo_barras', 'sku', 'precio_compra', 'precio_venta',
//             'precio_total', 'stock_actual', 'stock_minimo', 'stock_maximo',
//             'id_categoria', 'id_proveedor', 'fecha_creacion', 'estado'
//         ];

//         const missingFields = requiredFields.filter(field => !producto[field]);
//         if (missingFields.length > 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: `Faltan campos: ${missingFields.join(', ')}`
//             });
//         }

//         // Generar QR REGISTRANDO EL PRODUCTO
//         producto.codigo_qr = await generarYGuardarQR(producto.id_producto);

//         const nuevoProducto = await Producto.registrarProducto(producto);

//         return res.status(201).json({
//             success: true,
//             message: "Producto registrado correctamente",
//             data: nuevoProducto
//         });

//     } catch (error) {
//         console.error('Error completo:', error);
//         return res.status(500).json({
//             success: false,
//             message: error.message.includes('QR') 
//                    ? 'Error al generar QR' 
//                    : 'Error al registrar producto',
//             error: error.message
//         });
//     }
// };




/*GENERAR CODIGO DE BARRAS (AL REGISTRAR UN PRODUCTO EN AUTOMÁTICO GENERA EL CODIGO QR Y EL CODIGO DE BARRAS 
GUARDANDO UNA IMAGEN POR CADA UNO EN LA CARPETA PUBLIC HAY 2 CARPETAS MAS UNA EN DONDE SE GUARDA EL CODIGO QR Y OTRA EN DONDE SE GUARDA EL CODIGO DE BARRAS)*/

const generarYGuardarCodigoBarras = async (codigoBarras) => {
  try {
    if (!codigoBarras || (typeof codigoBarras !== 'string' && typeof codigoBarras !== 'number')) {
      throw new Error('El código de barras es inválido');
    }
  
    const barcodesFolder = path.join(__dirname, '../public/barcodes');
    const barcodeFile = path.join(barcodesFolder, `barcode-${codigoBarras}.png`);

    await fs.promises.mkdir(barcodesFolder, { recursive: true });

    // Generar el código de barras como PNG
    const pngBuffer = await bwipjs.toBuffer({
      bcid: 'code128',            // Tipo de código de barras
      text: String(codigoBarras), // Texto a codificar
      scale: 3,                   // Escala de la imagen
      height: 10,                 // Altura de barras en mm
      includetext: true,          // Incluir texto debajo
      textxalign: 'center',       // Alineación del texto
    });

    // Guardar el buffer como archivo PNG
    await fs.promises.writeFile(barcodeFile, pngBuffer);

    // Retornar la ruta relativa para guardar en la base de datos o usar en frontend
    return `/public/barcodes/barcode-${codigoBarras}.png`;

  } catch (error) {
    throw new Error(`Error generando código de barras: ${error.message}`);
  }
};


productoController.registrarProducto = async (req, res, next) => {
    try {
        const producto = req.body;

        console.log('Producto recibido:', producto);
        console.log('ID producto para QR:', producto.id_producto);

        const requiredFields = [
            'id_producto', 'nombre_producto', 'descripcion_producto',
            'codigo_barras', 'sku', 'precio_compra', 'precio_venta',
            'precio_total', 'stock_actual', 'stock_minimo', 'stock_maximo',
            'id_categoria', 'id_proveedor', 'fecha_creacion', 'estado'
        ];

        const missingFields = requiredFields.filter(field => !producto[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Faltan campos: ${missingFields.join(', ')}`
            });
        }

        // Generar QR
        producto.codigo_qr = await generarYGuardarQR(producto.id_producto);

        // Generar código de barras y guardar la ruta en un nuevo campo
        producto.codigo_barras_img = await generarYGuardarCodigoBarras(producto.codigo_barras);

        // Ahora puedes guardar el producto incluyendo la ruta del código de barras
        const nuevoProducto = await Producto.registrarProducto(producto);

        return res.status(201).json({
            success: true,
            message: "Producto registrado correctamente",
            data: nuevoProducto
        });

    } catch (error) {
        console.error('Error completo:', error);
        return res.status(500).json({
            success: false,
            message: error.message.includes('código de barras')
                   ? 'Error al generar código de barras'
                   : error.message.includes('QR')
                   ? 'Error al generar QR'
                   : 'Error al registrar producto',
            error: error.message
        });
    }
};




module.exports = productoController;