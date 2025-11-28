const db = require ('../config/config');


//const Producto = require('../models/producto');

const Producto = {};


//OBTENER TODOS LOS PRODUCTOS 

Producto.getAll = () => {
    const sql = 'SELECT * FROM public.productos';
    return db.manyOrNone(sql);
}



//  INSERTAR DATOS A LA TABLA PRODUCTOS




Producto.registrarProducto = async (datos) => {
    const sql = 'INSERT INTO public.productos (id_producto, nombre_producto, descripcion_producto, codigo_barras, sku, precio_compra, precio_venta, precio_total, stock_actual, stock_minimo, stock_maximo, id_categoria, id_proveedor, fecha_creacion, estado, codigo_qr, imagen_producto) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING id_producto';
    return db.manyOrNone(sql, [datos.id_producto, datos.nombre_producto, datos.descripcion_producto, datos.codigo_barras, datos.sku, datos.precio_compra, datos.precio_venta, datos.precio_total, datos.stock_actual, datos.stock_minimo, datos.stock_maximo, datos.id_categoria,datos.id_proveedor, datos.fecha_creacion,datos.estado, datos.codigo_qr, datos.imagen_producto ]);
}



//BUSCAR POR NOMBRE DEL PRODUCTO

Producto.buscarPorNombre = async (nombre) => {
  const sql = `
    SELECT * FROM productos
    WHERE nombre_producto ILIKE '%$1:value%'
    ORDER BY nombre_producto ASC
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


  
//BUSCAR POR ID DEL PRODUCTO

Producto.buscarPorId = async (Id) => {
  const sql = `
    SELECT * FROM productos
    WHERE id_producto = $1
    ORDER BY id_producto ASC
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

Producto.eliminarPorId = async (Id) => {
  const sql = `
    DELETE FROM productos
    WHERE id_producto = $1
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
Producto.actualizarPorId = async (id_producto, datos) => {
  const {
    nombre_producto,
    descripcion_producto,
    codigo_barras,
    sku,
    precio_compra,
    precio_venta,
    precio_total,
    stock_actual,
    stock_minimo,
    stock_maximo,
    id_categoria,
    id_proveedor,
    fecha_creacion,
    estado,
    codigo_qr,
  } = datos;

  const sql = `
    UPDATE productos
    SET 
      nombre_producto = $1,
      descripcion_producto = $2,
      codigo_barras = $3,
      sku = $4,
      precio_compra = $5,
      precio_venta = $6,
      precio_total = $7,
      stock_actual = $8,
      stock_minimo = $9,
      stock_maximo = $10,
      id_categoria = $11,
      id_proveedor = $12,
      fecha_creacion = $13,
      estado = $14,
      codigo_qr = $15
    WHERE id_producto = $16
  `;

  const values = [
    nombre_producto,
    descripcion_producto,
    codigo_barras,
    sku,
    precio_compra,
    precio_venta,
    precio_total,
    stock_actual,
    stock_minimo,
    stock_maximo,
    id_categoria,
    id_proveedor,
    fecha_creacion,
    estado,
    codigo_qr,
    id_producto,
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




             //SUBIR Y ACTUALIZAR IMAGEN

Producto.actualizarImagen = async (id, nombreProducto, imagenProducto) => {
  const sql = `
    UPDATE productos
    SET nombre_producto = $1,
        imagen_producto = $2
    WHERE id_producto = $3;
  `;
  return db.none(sql, [nombreProducto, imagenProducto, id]);
};




module.exports = Producto;


