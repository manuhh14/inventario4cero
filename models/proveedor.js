const db = require('../config/config');
const Proveedor = {};


//INSERTAR DATOS A LA TABLA PROVEEDORES
Proveedor.registrarProveedor = async (datos) => {
    const sql = `
    INSERT INTO public.proveedores 
        (id_proveedor, 
        nombre_proveedor, 
        contacto_proveedor, 
        telefono_proveedor, 
        email_proveedor, 
        direccion_proveedor, 
        estado)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING 
        id_proveedor,
        nombre_proveedor,
        contacto_proveedor,
        telefono_proveedor,
        email_proveedor,
        direccion_proveedor,
        estado
    `;

    return db.one(sql, [datos.id_proveedor,
                    datos.nombre_proveedor,
                    datos.contacto_proveedor,
                    datos.telefono_proveedor,
                    datos.email_proveedor,
                    datos.direccion_proveedor,
                    datos.estado]);
};



// OBTENER TODOS LOS PROVEEDORES
Proveedor.getAll = () => {
    const sql = 'SELECT * FROM public.proveedores';
    return db.manyOrNone(sql);
}



//BUSCAR POR NOMBRE DEL PROVEEDOR 
Proveedor.buscarPorNombre = async (nombre) => {
  const sql = `
    SELECT * FROM proveedores
    WHERE nombre_proveedor ILIKE '%$1:value%'
    ORDER BY nombre_proveedor ASC
  `;

  try {
    const result = await db.any(sql, [nombre]);
    console.log('Filas obtenidas:', result);
    return result;
  } catch (error) {
    console.error('Error en la consulta:', error.message || error);
    throw error; 
  }
};





//BUSCAR POR ID DEL PROVEEDOR
 Proveedor.buscarPorId = async (Id) => {
   const sql = `
     SELECT * FROM proveedores
     WHERE id_proveedor = $1
     ORDER BY id_proveedor ASC
   `;

   try {
     const result = await db.any(sql, [Id]);
     console.log('Filas obtenidas:', result);
    return result;
   } catch (error) {
     console.error('Error en la consulta:', error.message || error);
     throw error; 
   }
 };




//ELIMINAR POR ID
 Proveedor.eliminarPorId = async (Id) => {
   const sql = `
     DELETE FROM proveedores
     WHERE id_proveedor = $1
   `;

   try {
     const result = await db.result(sql, [Id]);
     console.log(`Filas eliminadas: ${result.rowCount}`);
     return result.rowCount; 
   } catch (error) {
     console.error('Error al eliminar:', error.message || error);
     throw error;
   }
 };




//ACTUALIZAR POR ID
 Proveedor.actualizarPorId = async (id_proveedor, datos) => {
  const {
    nombre_proveedor,
    contacto_proveedor,
    telefono_proveedor,
    email_proveedor,
    direccion_proveedor,
    estado,
  } = datos;

  const sql = `
    UPDATE proveedores
    SET  
       nombre_proveedor = $1, 
       contacto_proveedor = $2, 
       telefono_proveedor = $3, 
       email_proveedor = $4, 
       direccion_proveedor = $5, 
       estado = $6
    WHERE id_proveedor = $7
  `;

  const values = [
    nombre_proveedor,
    contacto_proveedor,
    telefono_proveedor,
    email_proveedor,
    direccion_proveedor,
    estado,
    id_proveedor,
  ];

  try {
    const result = await db.result(sql, values);
    console.log(`Filas actualizadas: ${result.rowCount}`);
    return result.rowCount;
  } catch (error) {
    console.error('Error al actualizar:', error.message || error);
    throw error;
  }
};



module.exports = Proveedor;
