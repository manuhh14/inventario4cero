const Venta = require('../models/venta');
const ventaController = {};

/**
 * ✅ REGISTRAR VENTA
 * Este es el corazón de tu Punto de Venta. 
 * Valida que lleguen todos los campos que probamos con éxito en OnRender.
 */
ventaController.registrarVenta = async (req, res) => {
    try {
        const venta = req.body;

        // Validación de campos obligatorios según la estructura de la DB
        const camposRequeridos = ['id_venta', 'id_cliente', 'fecha_venta', 'total_ventas', 'estado'];
        const faltantes = camposRequeridos.filter(campo => !venta[campo]);

        if (faltantes.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Faltan campos obligatorios para registrar la venta: ${faltantes.join(', ')}`
            });
        }

        const nuevaVenta = await Venta.registrarVenta(venta);

        return res.status(201).json({
            success: true,
            message: "Venta registrada correctamente",
            data: nuevaVenta
        });

    } catch (error) {
        // Si el error es por ID duplicado, enviamos un mensaje más amigable
        if (error.code === '23505') {
            return res.status(400).json({
                success: false,
                message: "El ID de venta ya existe. Usa un número nuevo."
            });
        }

        return res.status(500).json({
            success: false,
            message: "Error interno al procesar la venta",
            error: error.message
        });
    }
};

/**
 * ✅ OBTENER TODAS LAS VENTAS
 * Devuelve la lista que viste en Postman para llenar el historial de la App.
 */
ventaController.getAllVenta = async (req, res) => {
    try {
        const ventas = await Venta.getAll();
        return res.status(200).json({
            success: true,
            data: ventas
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false,
            message: "No se pudo obtener el historial de ventas" 
        });
    }
};

/**
 * ✅ ELIMINAR VENTA
 * Soporta :Id o :id para borrar registros desde la App.
 */
ventaController.eliminarVenta = async (req, res) => {
    try {
        const idEliminar = req.params.Id || req.params.id;

        if (!idEliminar) {
            return res.status(400).json({ success: false, message: 'Se requiere el ID de la venta' });
        }
        
        const filasEliminadas = await Venta.eliminar(idEliminar);

        if (filasEliminadas === 0) {
            return res.status(404).json({ success: false, message: 'Venta no encontrada' });
        }
        
        return res.status(200).json({ success: true, message: 'Venta eliminada correctamente' });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al intentar eliminar la venta'
        });
    }
};

module.exports = ventaController;