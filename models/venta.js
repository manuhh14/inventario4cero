const db = require('../config/config');
const Venta = {};



// Insertar datos en la tabla ventas
  Venta.registrarVenta = async (datos) => {
       const sql = `
     INSERT INTO public.ventas
        (id_venta, 
        id_cliente, 
        fecha_venta, 
        total_ventas, 
        estado)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING 
         id_venta, 
         id_cliente, 
         fecha_venta, 
         total_ventas, 
         estado
 `;

         return db.one(sql, [
             datos.id_venta,
             datos.id_cliente,
             datos.fecha_venta,
             datos.total_ventas,
             datos.estado
         ]);
      };





//OBTENER TODAS LAS VENTAS
    Venta.getAll = () => {
        const sql = 'SELECT * FROM public.ventas';
        return db.manyOrNone(sql);
    }




// //BUSCAR POR NOMBRE DEL USUARIO
//   Usuario.buscarPorNombre = async (nombre) => {
//     const sql = `
//       SELECT * FROM usuarios
//       WHERE nombre_usuario ILIKE '%$1:value%'
//       ORDER BY nombre_usuario ASC
//     `;

//     try {
//       const result = await db.any(sql, [nombre]);
//       console.log('Filas obtenidas:', result);
//       return result;
//     } catch (error) {
//       console.error('Error en la consulta:', error.message || error);
//       throw error; 
//     }
//   };




// //BUSCAR POR ID DEL CLIENTE
//   Usuario.buscarPorId = async (Id) => {
//     const sql = `
//       SELECT * FROM usuarios
//       WHERE id_usuario = $1
//       ORDER BY id_usuario ASC
//     `;

//     try {
//       const result = await db.any(sql, [Id]);
//       console.log('Filas obtenidas:', result);
//       return result;
//     } catch (error) {
//       console.error('Error en la consulta:', error.message || error);
//       throw error; 
//     }
//   };




// //ELIMINAR POR ID
//   Usuario.eliminarPorId = async (Id) => {
//     const sql = `
//       DELETE FROM usuarios
//       WHERE id_usuario = $1
//     `;

//     try {
//       const result = await db.result(sql, [Id]);
//       console.log(`Filas eliminadas: ${result.rowCount}`);
//       return result.rowCount; 
//     } catch (error) {
//       console.error('Error al eliminar:', error.message || error);
//       throw error;
//     }
//   };




// //ACTUALIZAR POR ID
//   Usuario.actualizarPorId = async (id_usuario, datos) => {
//     const {
//       nombre_usuario,
//       telefono_usuario,
//       email_usuario,
//       password,
//       rol
//     } = datos;

//     const sql = `
//       UPDATE usuarios
//       SET 
//         nombre_usuario = $1,
//         telefono_usuario = $2,
//         email_usuario = $3,
//         password = $4,
//         rol = $5
//       WHERE id_usuario = $6
//     `;

//     const values = [
//       nombre_usuario,
//       telefono_usuario,
//       email_usuario,
//       password,
//       rol,
//       id_usuario,
//     ];

//     try {
//       const result = await db.result(sql, values);
//       console.log(`Filas actualizadas: ${result.rowCount}`);
//       return result.rowCount    } catch (error) {
//       console.error('Error al actualizar:', error.message || error);
//       throw error;
//     }
//   };




module.exports = Venta;
