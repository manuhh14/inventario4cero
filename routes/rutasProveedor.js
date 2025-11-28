const express = require('express');
const router = express.Router();
const db = require('../config/config');

// ================================
// ✔ Crear proveedor
// ================================
router.post('/crearProveedor', async (req, res) => {
    try {
        const { nombre_proveedor, telefono_proveedor, email_proveedor, direccion_proveedor } = req.body;

        const sql = `
            INSERT INTO proveedores (nombre_proveedor, telefono_proveedor, email_proveedor, direccion_proveedor)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;

        const result = await db.one(sql, [
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

// ================================
// EXPORTAR RUTAS
// ================================
module.exports = router;
