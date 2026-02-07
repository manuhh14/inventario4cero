const Usuario = require('../models/usuario');
const usuarioController = {};

/**
 * ✅ REGISTRAR USUARIO
 * Valida que todos los campos requeridos por la App estén presentes.
 */
usuarioController.registrarUsuario = async (req, res) => {
    try {
        const usuario = req.body;

        // Validación estricta de campos obligatorios para el APK
        const camposRequeridos = ['nombre_usuario', 'telefono_usuario', 'email_usuario', 'password', 'rol'];
        const faltantes = camposRequeridos.filter(campo => !usuario[campo]);

        if (faltantes.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Faltan campos obligatorios: ${faltantes.join(', ')}`
            });
        }

        const nuevoUsuario = await Usuario.registrarUsuario(usuario);

        return res.status(201).json({
            success: true,
            message: "Usuario registrado correctamente",
            data: nuevoUsuario
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error interno al registrar usuario",
            error: error.message
        });
    }
};

/**
 * ✅ OBTENER TODOS LOS USUARIOS
 */
usuarioController.getAllUsuario = async (req, res) => {
    try {
        const usuarios = await Usuario.getAll();
        return res.status(200).json({
            success: true,
            data: usuarios
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false,
            message: "Error al obtener la lista de usuarios" 
        });
    }
};

/**
 * ✅ BUSCAR POR ID
 * Soporta variaciones de mayúsculas/minúsculas en el parámetro de la URL.
 */
usuarioController.buscarPorId = async (req, res) => {
    try {
        const idBusqueda = req.params.Id || req.params.id;

        if (!idBusqueda) {
            return res.status(400).json({ success: false, message: 'ID de usuario requerido' });
        }

        const resultado = await Usuario.buscarPorId(idBusqueda);

        if (!resultado || (Array.isArray(resultado) && resultado.length === 0)) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        return res.status(200).json({ 
            success: true, 
            data: Array.isArray(resultado) ? resultado[0] : resultado 
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al buscar usuario por ID',
            error: error.message
        });
    }
};

/**
 * ✅ ACTUALIZAR POR ID
 */
usuarioController.actualizarPorId = async (req, res) => {
    try {
        const idActualizar = req.params.id || req.params.Id;
        const datos = req.body;

        if (!idActualizar) {
            return res.status(400).json({ success: false, message: 'ID requerido para actualizar' });
        }

        const filasActualizadas = await Usuario.actualizarPorId(idActualizar, datos);

        if (filasActualizadas === 0) {
            return res.status(404).json({ success: false, message: 'No se encontró el usuario para actualizar' });
        }

        return res.status(200).json({ 
            success: true, 
            message: 'Usuario actualizado correctamente' 
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false,
            message: 'Error al actualizar el usuario' 
        });
    }
};

/**
 * ✅ ELIMINAR POR ID
 */
usuarioController.eliminarPorId = async (req, res) => {
    try {
        const idEliminar = req.params.Id || req.params.id;

        if (!idEliminar) {
            return res.status(400).json({ success: false, message: 'ID requerido para eliminar' });
        }
        
        const filasEliminadas = await Usuario.eliminarPorId(idEliminar);

        if (filasEliminadas === 0) {
            return res.status(404).json({ success: false, message: 'No se encontró el usuario' });
        }
        
        return res.status(200).json({ success: true, message: 'Usuario eliminado correctamente' });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error interno al intentar eliminar',
            error: error.message
        });
    }
};

module.exports = usuarioController;