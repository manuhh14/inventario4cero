const Categoria = require('../models/categoria');
//const categoriaModel = require('../models/categoria');
const categoriaController = {};



// REGISTRAR CATEGORIA
categoriaController.registrarCategoria = async (req, res, next) => {
    try {
        const categoria = req.body;
        console.log("Categoria recibida:", categoria);

        if (!categoria.id_categoria || 
            !categoria.nombre_categoria || 
            !categoria.descripcion_categoria) {
            return res.status(400).json({
                success: false,
                message: "Faltan campos requeridos",
            });
        }
        const nuevaCategoria = await Categoria.registrarCategoria(categoria);

        return res.status(201).json({
            success: true,
            message: "Categoria registrada correctamente",
            data: nuevaCategoria
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error al registrar categoria",
            error: error.message
        });
    }
};




//OBTENER TODAS LAS CATEGORIAS
categoriaController.getAllCategoria = async (req, res) => {
    try {
        const categorias = await Categoria.getAll();
        res.status(200).json(categorias);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message:"Error al obtener las categorias"});
    }
};




// BUSCAR POR NOMBRE DE LA CATEGORIA
categoriaController.buscarPorNombre = async (req, res) => {
  try {
    const { nombre } = req.params;
    console.log('Nombre recibido:', nombre);

    if (!nombre) {
      return res.status(400).json({ success: false, message: 'Nombre requerido' });
    }

    const resultados = await Categoria.buscarPorNombre(nombre);
    
    if (resultados.length === 0) {
      return res.status(200).json({ 
        success: true, 
        message: "No se encontraron categorias", 
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





//BUSCAR POR ID DE LA CATEGORIA

categoriaController.buscarPorId = async (req, res) => {
  try {
    const { Id } = req.params;
    console.log('Id recibido:', Id);

    if (!Id) {
      return res.status(400).json({ success: false, message: 'Id requerido' });
    }

    const resultados = await Categoria.buscarPorId(Id);
    
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
categoriaController.eliminarPorId = async (req, res) => {
  try {
    const { Id } = req.params;
    console.log('Id recibido para eliminar:', Id);

    if (!Id) {
      return res.status(400).json({ success: false, message: 'Id requerido para eliminar'});
    }
    const filasEliminadas = await Categoria.eliminarPorId(Id);

    if (filasEliminadas === 0) {
      return res.status(400).json({ success: false, message: 'No se encontró categoria con ese Id'});
    }
    return res.status(200).json({ success: true, message: 'Categoria eliminada correctamente'});
  } catch (error) {
    console.error('Error en controlador al eliminar:', error.mesaage);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al eliminar',
      error: errror.message
    });
  }
};




//ACTUALIZAR POR ID

categoriaController.actualizarPorId = async (req, res) => {
  const id_categoria = req.params.id;
  const datos = req.body;

  if (!id_categoria) {
    return res.status(400).json({ message: 'El id_categoria es requerido' });
  }

  try {
    const filasActualizadas = await Categoria.actualizarPorId(id_categoria, datos);

    if (filasActualizadas === 0) {
      return res.status(404).json({ message: 'Categoria no encontrada' });
    }

    res.json({ message: 'Categoria actualizada correctamente' });
  } catch (error) {
    console.error('Error en controlador actualizarPorId:', error);
    res.status(500).json({ message: 'Error al actualizar la categoria' });
  }
};



module.exports = categoriaController;
