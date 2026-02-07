// controllers/estadisticasController.js (Línea 1)
const ProductoModel = require('../models/producto');

const estadisticasController = {};

estadisticasController.obtenerVentasPorMes = async (req, res) => {
    // 1. Obtiene el año de los parámetros de la URL
    const { anio } = req.params; 

    // ** CORRECCIÓN: Manejo de error 400 **
    if (!anio) {
        return res.status(400).json({ 
            success: false, // Debe ser FALSE para un error
            message: 'Error: Se requiere el parámetro del año (/:anio) para la consulta.' 
        });
    }

    try {
        // 2. Llama a la función del Modelo
        const datosVentas = await ProductoModel.obtenerTotalVendidoPorMes(anio);
        
        // 3. Envía la respuesta 200 OK con los datos
        return res.json({
            success: true,
            data: datosVentas
        });
    } catch (error) {
        console.error('Error en controlador (obtenerVentasPorMes):', error);
        
        // 4. Envía la respuesta 500 Internal Server Error
        return res.status(500).json({ 
            success: false, 
            message: 'Error interno al obtener las ventas mensuales desde la base de datos.',
            error: error.message 
        });
    }
};
//------------------------------------------------------------------------------------------------------------
// NUEVA FUNCIÓN: Lógica para obtener y clasificar ventas ABC (Ahora requiere MES y AÑO)
estadisticasController.obtenerVentasABC = async (req, res) => {
    // 🛑 CLAVE: Extraemos MES y AÑO
    const { mes, anio } = req.params; 

    if (!mes || !anio) {
        return res.status(400).json({ success: false, message: 'Se requieren los parámetros de mes y año.' });
    }

    try {
        // 🛑 CLAVE: Llamamos al modelo con AMBOS parámetros
        const datosClasificados = await ProductoModel.obtenerABCClasificado(mes, anio);
        
        // El JSON ya contiene la clave 'categoria_abc' lista para Python
        return res.json({ success: true, data: datosClasificados });
    } catch (error) {
        console.error('Error al obtener ventas ABC:', error);
        return res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};

//------------------------------------------------------------------------------------------------------------
module.exports = estadisticasController;

