const Producto = require('../models/producto');
const qrcode = require('qrcode');
const fs = require('fs');
const path = require('path');
const bwipjs = require('bwip-js');

// 🛡️ IMPORTACIÓN DEL LOGGER (Auditoría)
const logger = require('../utils/logger');

const productoController = {};

/**
 * 🛠️ FUNCIONES AUXILIARES (Generación de archivos)
 */

const generarYGuardarQR = async (idProducto) => {
    try {
        const qrFolder = path.join(__dirname, '../uploads/qrcodes');
        const qrPath = path.join(qrFolder, `qr-${idProducto}.png`);
        await fs.promises.mkdir(qrFolder, { recursive: true });
        await qrcode.toFile(qrPath, String(idProducto));
        return `/uploads/qrcodes/qr-${idProducto}.png`;
    } catch (error) {
        throw new Error(`Error generando QR: ${error.message}`);
    }
};

const generarYGuardarCodigoBarras = async (codigoBarras) => {
    try {
        const barcodesFolder = path.join(__dirname, '../uploads/barcodes');
        const barcodeFile = path.join(barcodesFolder, `barcode-${codigoBarras}.png`);
        await fs.promises.mkdir(barcodesFolder, { recursive: true });

        const pngBuffer = await bwipjs.toBuffer({
            bcid: 'code128',
            text: String(codigoBarras),
            scale: 3,
            height: 10,
            includetext: true,
            textxalign: 'center',
        });

        await fs.promises.writeFile(barcodeFile, pngBuffer);
        return `/uploads/barcodes/barcode-${codigoBarras}.png`;
    } catch (error) {
        throw new Error(`Error generando código de barras: ${error.message}`);
    }
};

/**
 * 🚀 CONTROLADORES DE RUTA
 */

productoController.getAllProductos = async (req, res) => {
    try {
        const productos = await Producto.getAll();
        return res.status(200).json({ success: true, data: productos });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error al obtener productos" });
    }
};

// Registro con Auditoría
productoController.registrarProducto = async (req, res) => {
    try {
        const producto = req.body;
        const requiredFields = [
            'id_producto', 'nombre_producto', 'codigo_barras', 'sku', 
            'precio_venta', 'stock_actual', 'id_categoria', 'estado'
        ];

        const missingFields = requiredFields.filter(field => !producto[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Faltan campos obligatorios: ${missingFields.join(', ')}`
            });
        }

        producto.codigo_qr = await generarYGuardarQR(producto.id_producto);
        producto.imagen_producto = await generarYGuardarCodigoBarras(producto.codigo_barras);

        const nuevoProducto = await Producto.registrarProducto(producto);

        // 🛡️ LOG: Registro de nuevo producto
        logger.registrarAccion('Javier_Admin', 'INSERT', `Producto creado: ${producto.nombre_producto} (ID: ${producto.id_producto})`);

        return res.status(201).json({
            success: true,
            message: "Producto registrado con éxito (QR y Barras generados)",
            data: nuevoProducto
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error al registrar producto", error: error.message });
    }
};

productoController.buscarPorId = async (req, res) => {
    try {
        const id = req.params.Id || req.params.id;
        const resultado = await Producto.buscarPorId(id);
        if (!resultado || resultado.length === 0) {
            return res.status(404).json({ success: false, message: "Producto no encontrado" });
        }
        return res.status(200).json({ success: true, data: resultado[0] });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Actualización con Auditoría
productoController.actualizarImagen = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombreProducto } = req.body;

        if (!req.file || !nombreProducto) {
            return res.status(400).json({ success: false, message: 'Falta imagen o nombre del producto' });
        }

        await Producto.actualizarImagen(id, nombreProducto, req.file.filename);

        // 🛡️ LOG: Actualización de imagen
        logger.registrarAccion('Javier_Admin', 'UPDATE_IMAGE', `Nueva imagen para: ${nombreProducto} (ID: ${id})`);

        return res.json({ success: true, message: 'Imagen actualizada correctamente' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error al actualizar imagen' });
    }
};

productoController.obtenerABCClasificado = async (req, res) => {
    const { mes, anio } = req.params;
    try {
        if (!mes || !anio) return res.status(400).json({ success: false, message: "Mes y Año requeridos" });
        
        const result = await Producto.obtenerABCClasificado(mes, anio);
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error en clasificación ABC" });
    }
};

// Eliminación con Auditoría
productoController.eliminarPorId = async (req, res) => {
    try {
        const id = req.params.Id || req.params.id;
        const filas = await Producto.eliminarPorId(id);
        
        if (filas === 0) return res.status(404).json({ success: false, message: 'ID no encontrado' });

        // 🛡️ LOG: Eliminación de producto
        logger.registrarAccion('Javier_Admin', 'DELETE', `Producto eliminado permanentemente. ID afectado: ${id}`);

        return res.status(200).json({ success: true, message: 'Producto eliminado' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error al eliminar' });
    }
};

module.exports = productoController;