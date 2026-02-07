const QRCode = require('qrcode');

const generarQRProducto = async (req, res) => {
    try {
        const { id } = req.params;
        // Creamos un JSON con la información básica para que el escáner lo lea
        const datosQR = JSON.stringify({
            id_producto: id,
            vínculo: `http://localhost:3000/api/productos/buscarPorId/${id}`,
            fecha_generacion: new Date().toLocaleDateString()
        });

        // Generamos el QR como una imagen Base64 para mostrarla directamente
        const qrImagen = await QRCode.toDataURL(datosQR);

        // Enviamos una página HTML simple para visualizarlo o el Base64
        res.attachment(`etiqueta_producto_${id}.html`);
        res.type('html');
        res.send(`
            <div style="text-align:center; font-family:Arial;">
                <h2>Código QR del Producto: ${id}</h2>
                <img src="${qrImagen}" alt="QR Code" style="border: 2px solid #000; padding: 10px;"/>
                <p>Escanea para ver detalles en el sistema</p>
                <button onclick="window.print()">Imprimir Etiqueta</button>
            </div>
        `);
    } catch (error) {
        res.status(500).json({ message: 'Error al generar el código QR' });
    }
};

module.exports = { generarQRProducto };