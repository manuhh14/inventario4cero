const express = require('express');
const router = express.Router();
const db = require('../config/config');

// ===================================================
// ✔ 1. Crear proveedor (POST)
// ===================================================
// Se mantiene la implementación que requiere el id_proveedor manualmente,
// debido a la restricción NOT NULL de la base de datos.
router.post('/crearProveedor', async (req, res) => {
    try {
        // Se extrae id_proveedor del cuerpo de la petición
        const { id_proveedor, nombre_proveedor, telefono_proveedor, email_proveedor, direccion_proveedor } = req.body; 

        const sql = `
            INSERT INTO proveedores (id_proveedor, nombre_proveedor, telefono_proveedor, email_proveedor, direccion_proveedor)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;

        const result = await db.one(sql, [
            id_proveedor, 
            nombre_proveedor,
            telefono_proveedor,
            email_proveedor,
            direccion_proveedor
        ]);

        res.status(201).json({
            success: true,
            message: "Proveedor creado correctamente",
            data: result
        });

    } catch (error) {
        console.error("Error al crear proveedor:", error);
        res.status(500).json({
            success: false,
            message: "Error al crear proveedor",
            error: error.message
        });
    }
});

// ===================================================
// ✔ 2. Buscar proveedor por ID (GET)
// ===================================================
// Esta ruta estaba faltando, causando el error 404.
router.get('/buscarPorId/:id', async (req, res) => {
    try {
        const id_proveedor = req.params.id; // Captura el ID de la URL

        const sql = `
            SELECT id_proveedor, nombre_proveedor, telefono_proveedor, email_proveedor, direccion_proveedor, estado
            FROM proveedores
            WHERE id_proveedor = $1;
        `;

        // Usamos db.oneOrNone para manejar si el proveedor existe o no
        const result = await db.oneOrNone(sql, [id_proveedor]); 

        if (result) {
            res.status(200).json({
                success: true,
                message: "Proveedor encontrado",
                data: result
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Proveedor no encontrado",
                data: {}
            });
        }

    } catch (error) {
        console.error("Error al buscar proveedor:", error);
        res.status(500).json({
            success: false,
            message: "Error en la búsqueda de proveedor",
            error: error.message
        });
    }
});


// ================================
// EXPORTAR RUTAS
// ================================
module.exports = router;