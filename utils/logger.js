const fs = require('fs');
const path = require('path');

const registrarAccion = (usuario, accion, detalles) => {
    // Obtenemos fecha y hora actual
    const ahora = new Date();
    const fechaFormateada = ahora.toLocaleString(); 

    // Creamos la línea de texto que se guardará
    const linea = `[${fechaFormateada}] USUARIO: ${usuario} | ACCIÓN: ${accion} | DETALLES: ${detalles}\n`;

    // Definimos la ruta del archivo (se creará en la raíz del proyecto)
    const rutaArchivo = path.join(__dirname, '../bitacora_auditoria.log');

    // appendFile añade el texto al final del archivo sin borrar lo anterior
    fs.appendFile(rutaArchivo, linea, (err) => {
        if (err) {
            console.error("Error al escribir en la bitácora:", err);
        }
    });
};

module.exports = { registrarAccion };