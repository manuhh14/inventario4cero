const Proveedor = require('../models/proveedor');
const proveedorController = {};



// REGISTRAR PROVEEDOR
proveedorController.registrarProveedor = async (req, res, next) => {
    try {
        const proveedor = req.body;
        console.log("Proveedor recibido:", proveedor);

        if (!proveedor.id_proveedor ||
            !proveedor.nombre_proveedor ||
            !proveedor.contacto_proveedor ||
            !proveedor.telefono_proveedor ||
            !proveedor.email_proveedor ||
            !proveedor.direccion_proveedor ||
            !proveedor.estado) {
                return res.status(400).json({
                    success: false,
                    message: "Faltan campos requeridos",
                });
            }
        const nuevoProveedor = await Proveedor.registrarProveedor(proveedor);

        return res.status(201).json({
            success: true,
            message: "Proveedor registrado correctamente",
            data: nuevoProveedor
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error al registrar proveedor",
            error: error.message
        });
    }
};



// OBTENER TODOS LOS PROVEEDORES
proveedorController.getAllProveedor = async (req, res) => {
    try {
        const proveedores = await Proveedor.getAll();
        res.status(200).json(proveedores);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener los proveedores"});
    }
};



//BUSCAR POR NOMBRE DEL PROVEEDOR
proveedorController.buscarPorNombre = async (req, res) => {
  try {
    const { nombre } = req.params;
    console.log('Nombre recibido:', nombre);

    if (!nombre) {
      return res.status(400).json({ success: false, message: 'Nombre requerido' });
    }

    const resultados = await Proveedor.buscarPorNombre(nombre);
    
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
    



//BUSCAR POR ID DEL PROVEEDOR

proveedorController.buscarPorId = async (req, res) => {
    try {
     const { Id } = req.params;
     console.log('Id recibido:', Id);

     if (!Id) {
       return res.status(400).json({ success: false, message: 'Id requerido' });
     }

     const resultados = await Proveedor.buscarPorId(Id);
  
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
 proveedorController.eliminarPorId = async (req, res) => {
   try {
     const { Id } = req.params;
     console.log('Id recibido para eliminar:', Id);

     if (!Id) {
       return res.status(400).json({ success: false, message: 'Id requerido para eliminar'});
     }
     const filasEliminadas = await Proveedor.eliminarPorId(Id);

     if (filasEliminadas === 0) {
       return res.status(400).json({ success: false, message: 'No se encontró proveedor con ese Id'});
     }
     return res.status(200).json({ success: true, message: 'Proveedor eliminado correctamente'});
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

 proveedorController.actualizarPorId = async (req, res) => {
   const id_proveedor = req.params.id;
   const datos = req.body;

   if (!id_proveedor) {
     return res.status(400).json({ message: 'El id_proveedor es requerido' });
   }

   try {
     const filasActualizadas = await Proveedor.actualizarPorId(id_proveedor, datos);

     if (filasActualizadas === 0) {
       return res.status(404).json({ message: 'Proveedor no encontrado' });
     }

     res.json({ message: 'Proveedor actualizado correctamente' });
   } catch (error) {
     console.error('Error en controlador actualizarPorId:', error);
     res.status(500).json({ message: 'Error al actualizar el proveedor' });
   }
 };



module.exports = proveedorController;
