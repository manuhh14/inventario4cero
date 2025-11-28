const Cliente = require ('../models/cliente');
//const clienteModel = require('../models/cliente');
const clienteController = {};



//REGISTRAR CLIENTE
clienteController.registrarCliente = async (req, res, next) => {
    try {
        const cliente = req.body;
        console.log("Cliente recibido:", cliente);

        if (!cliente.id_cliente ||
            !cliente.nombre_cliente ||
            !cliente.telefono_cliente ||
            !cliente.email_cliente ||
            !cliente.direccion_cliente ||
            !cliente.tipo_cliente) {

                return res.status(400).json({
                    success: false,
                    message: "Falta campos requeridos",
                });
            }

            const nuevoCliente = await Cliente.registrarCliente(cliente);

            return res.status (201).json({
                success: true,
                message:"Cliente registrado correctamente",
                data: nuevoCliente
            });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message:"Error al registrar cliente",
            error: error.message
        });
    }
};





//OBTENER TODOS LOS CLIENTES
clienteController.getAllCliente = async (req, res) => {
     try {
         const clientes = await Cliente.getAll();
         res.status(200).json(clientes);
     } catch (error) {
         console.error(error);
         res.status(500).json({ message:"Error al obtener clientes"});
     }
 };




// BUSCAR POR NOMBRE DEL CLIENTE
 clienteController.buscarPorNombre = async (req, res) => {
   try {
     const { nombre } = req.params;
     console.log('Nombre recibido:', nombre);

     if (!nombre) {
       return res.status(400).json({ success: false, message: 'Nombre requerido' });
     }

     const resultados = await   Cliente.buscarPorNombre(nombre);
    
     if (resultados.length === 0) {
       return res.status(200).json({ 
         success: true, 
         message: "No se encontraron clientes", 
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





//BUSCAR POR ID DEL CLIENTE

 clienteController.buscarPorId = async (req, res) => {
   try {
     const { Id } = req.params;
     console.log('Id recibido:', Id);

     if (!Id) {
       return res.status(400).json({ success: false, message: 'Id requerido' });
     }

     const resultados = await Cliente.buscarPorId(Id);
    
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
 clienteController.eliminarPorId = async (req, res) => {
   try {
     const { Id } = req.params;
     console.log('Id recibido para eliminar:', Id);

     if (!Id) {
       return res.status(400).json({ success: false, message: 'Id requerido para eliminar'});
     }
     const filasEliminadas = await Cliente.eliminarPorId(Id);

     if (filasEliminadas === 0) {
       return res.status(400).json({ success: false, message: 'No se encontró cliente con ese Id'});
     }
     return res.status(200).json({ success: true, message: 'Cliente eliminado correctamente'});
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
 clienteController.actualizarPorId = async (req, res) => {
   const id_cliente = req.params.id;
   const datos = req.body;

   if (!id_cliente) {
     return res.status(400).json({ message: 'El id_cliente es requerido' });
   }

   try {
     const filasActualizadas = await Cliente.actualizarPorId(id_cliente, datos);

     if (filasActualizadas === 0) {
       return res.status(404).json({ message: 'Cliente no encontrado' });
     }

     res.json({ message: 'Cliente actualizado correctamente' });
   } catch (error) {
     console.error('Error en controlador actualizarPorId:', error);
     res.status(500).json({ message: 'Error al actualizar el cliente' });
   }
 };



module.exports = clienteController;
