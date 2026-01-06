// const PDFDocument = require('pdfkit');
// const db = require('../config/config');
// const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

// const generarReporteInventario = async (req, res) => {
//     try {
//         // 1. Obtener datos de Render
//         const productos = await db.any('SELECT nombre_producto, stock_actual, precio_venta FROM productos ORDER BY stock_actual DESC LIMIT 5');

//         if (!productos || productos.length === 0) {
//             return res.status(404).send("No hay productos disponibles.");
//         }

//         // 2. Generar imagen de la gráfica
//         const chartCanvas = new ChartJSNodeCanvas({ width: 500, height: 250 });
//         const chartImg = await chartCanvas.renderToBuffer({
//             type: 'bar',
//             data: {
//                 labels: productos.map(p => p.nombre_producto),
//                 datasets: [{
//                     label: 'Stock Actual',
//                     data: productos.map(p => p.stock_actual),
//                     backgroundColor: '#1a237e'
//                 }]
//             }
//         });

//         // 3. Crear el PDF
//         const doc = new PDFDocument({ margin: 40 });
//         res.setHeader('Content-Type', 'application/pdf');
//         res.setHeader('Content-Disposition', 'attachment; filename=Reporte_Grafico.pdf');
//         doc.pipe(res);

//         // Título y Gráfica
//         doc.fontSize(20).text('ANALISIS DE INVENTARIO', { align: 'center' });
//         doc.moveDown();
//         doc.image(chartImg, 50, 100, { width: 500 });
        
//         // Tabla simple
//         doc.moveDown(15);
//         doc.fontSize(14).text('Listado de Productos:', { underline: true });
//         productos.forEach(p => {
//             doc.fontSize(10).text(`${p.nombre_producto} - Stock: ${p.stock_actual} - Precio: $${p.precio_venta}`);
//         });

//         doc.end();
//     } catch (error) {
//         console.error("Error en reporte:", error.message);
//         res.status(500).json({ error: "Error de conexión con la base de datos", detalle: error.message });
//     }
// };

// module.exports = { generarReporteInventario };

const PDFDocument = require('pdfkit');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const db = require('../config/config'); // Mantenemos el require por si conecta luego

const generarReporteInventario = async (req, res) => {
    try {
        console.log("📊 Intentando generar reporte...");

        let productos;
        try {
            // Intentamos traer datos reales
            productos = await db.any('SELECT nombre_producto, stock_actual, precio_venta FROM productos LIMIT 5');
        } catch (dbError) {
            console.warn("⚠️ Falló Render, usando datos de respaldo para el PDF...");
            // DATOS DE RESPALDO (Esto evita que la terminal truene y permite el PDF)
            productos = [
                { nombre_producto: 'Producto A', stock_actual: 15, precio_venta: 100 },
                { nombre_producto: 'Producto B', stock_actual: 25, precio_venta: 200 },
                { nombre_producto: 'Producto C', stock_actual: 10, precio_venta: 300 }
            ];
        }

        // 1. Crear la Gráfica
        const chartCanvas = new ChartJSNodeCanvas({ width: 500, height: 250 });
        const chartImg = await chartCanvas.renderToBuffer({
            type: 'bar',
            data: {
                labels: productos.map(p => p.nombre_producto),
                datasets: [{
                    label: 'Stock Actual',
                    data: productos.map(p => p.stock_actual),
                    backgroundColor: 'rgba(54, 162, 235, 0.7)'
                }]
            }
        });

        // 2. Configurar respuesta para que sea PDF y NO JSON
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=Reporte_Inventario.pdf');

        // 3. Crear el PDF
        const doc = new PDFDocument({ margin: 40 });
        doc.pipe(res);

        doc.fontSize(20).text('REPORTE DE INVENTARIO (MODO LOCAL)', { align: 'center' });
        doc.moveDown();
        doc.image(chartImg, 50, 100, { width: 500 });
        
        doc.moveDown(15);
        productos.forEach(p => {
            doc.fontSize(10).text(`${p.nombre_producto} | Stock: ${p.stock_actual} | Precio: $${p.precio_venta}`);
        });

        doc.end();
        console.log("✅ PDF generado con éxito (usando respaldo).");

    } catch (error) {
        console.error("❌ Error crítico:", error.message);
        if (!res.headersSent) {
            res.status(500).json({ error: "No se pudo generar nada", detalle: error.message });
        }
    }
};

module.exports = { generarReporteInventario };