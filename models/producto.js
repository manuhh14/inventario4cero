const db = require ('../config/config');

const Producto = {};

//========================================================================================================
//  FUNCIONES CRUD BÁSICAS Y BÚSQUEDA
//========================================================================================================

// OBTENER TODOS LOS PRODUCTOS 
Producto.getAll = () => {
    const sql = 'SELECT * FROM public.productos';
    return db.manyOrNone(sql);
}

// INSERTAR DATOS A LA TABLA PRODUCTOS
// 🛑 CORREGIDO: Usando RETURNING * y db.oneOrNone
Producto.registrarProducto = async (datos) => {
    const sql = 'INSERT INTO public.productos (id_producto, nombre_producto, descripcion_producto, codigo_barras, sku, precio_compra, precio_venta, precio_total, stock_actual, stock_minimo, stock_maximo, id_categoria, id_proveedor, fecha_creacion, estado, codigo_qr, imagen_producto) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *';
    
    return db.oneOrNone(sql, [
        datos.id_producto, 
        datos.nombre_producto, 
        datos.descripcion_producto, 
        datos.codigo_barras, 
        datos.sku, 
        datos.precio_compra, 
        datos.precio_venta, 
        datos.precio_total, 
        datos.stock_actual, 
        datos.stock_minimo, 
        datos.stock_maximo, 
        datos.id_categoria,
        datos.id_proveedor, 
        datos.fecha_creacion,
        datos.estado, 
        datos.codigo_qr, 
        datos.imagen_producto // <--- $17
    ]);
}

// BUSCAR POR NOMBRE DEL PRODUCTO
// 🛑 CORREGIDO: Sintaxis de placeholder segura para ILIKE
Producto.buscarPorNombre = async (nombre) => {
  const sql = `
    SELECT * FROM productos
    WHERE nombre_producto ILIKE '%' || $1 || '%'
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

// BUSCAR POR ID DEL PRODUCTO
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

// ELIMINAR POR ID
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

// ACTUALIZAR POR ID
// 🛑 CORREGIDO: Se agregó 'imagen_producto'
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
    imagen_producto, // 👈 AGREGADO
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
      codigo_qr = $15,
      imagen_producto = $16  -- 👈 AGREGADO
    WHERE id_producto = $17  -- 👈 CAMBIADO DE $16 A $17
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
    imagen_producto, // 👈 AGREGADO
    id_producto,     // 👈 POSICIÓN FINAL
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

// SUBIR Y ACTUALIZAR IMAGEN
Producto.actualizarImagen = async (id, nombreProducto, imagenProducto) => {
  const sql = `
    UPDATE productos
    SET nombre_producto = $1,
        imagen_producto = $2
    WHERE id_producto = $3;
  `;
  return db.none(sql, [nombreProducto, imagenProducto, id]);
};

//========================================================================================================
//  FUNCIONES DE REPORTE Y ANÁLISIS (CLASIFICACIÓN ABC Y GRÁFICAS)
//========================================================================================================

// 1. FUNCION CLASIFICACIÓN ABC (Mensual)
Producto.obtenerABCClasificado = async (mes, anio) => {
    
    const mesNum = parseInt(mes);
    const anioNum = parseInt(anio);
    
    const sql = `
        SELECT 
            p.id_producto,
            p.nombre_producto,
            SUM(dv.cantidad) AS cantidad_vendida,
            SUM(dv.precio_total) AS total_vendido
        FROM ventas v
        INNER JOIN detalle_ventas dv ON v.id_venta = dv.id_venta
        INNER JOIN productos p ON dv.id_producto = p.id_producto
        WHERE EXTRACT(MONTH FROM v.fecha_venta) = $1
          AND EXTRACT(YEAR FROM v.fecha_venta) = $2
        GROUP BY p.id_producto, p.nombre_producto
        ORDER BY total_vendido DESC; 
    `;

    try {
        const datos = await db.any(sql, [mesNum, anioNum]);

        const totalGeneral = datos.reduce((acc, row) => acc + Number(row.total_vendido), 0); 

        if (totalGeneral === 0) {
            return [];
        }

        let acumulado = 0;
        const clasificados = datos.map(row => {
            const porcentaje = (Number(row.total_vendido) / totalGeneral) * 100;
            acumulado += porcentaje;

            let categoria = "";
            if (acumulado <= 80) categoria = "A";
            else if (acumulado <= 95) categoria = "B";
            else categoria = "C";

            return {
                ...row,
                porcentaje: porcentaje.toFixed(2),
                acumulado: acumulado.toFixed(2),
                categoria_abc: categoria 
            };
        });

        return clasificados;

    } catch (error) {
        console.error('Error al obtener clasificación ABC:', error.message || error);
        throw error;
    }
};

// 2. FUNCION TOTAL VENDIDO POR MES (Gráficas de Tendencia)
Producto.obtenerTotalVendidoPorMes = async (anio) => {
    
    const anioNum = parseInt(anio);
    
    const sql = `
        SELECT 
            EXTRACT(MONTH FROM v.fecha_venta) AS mes,
            SUM(dv.precio_total) AS total_vendido
        FROM ventas v
        INNER JOIN detalle_ventas dv ON dv.id_venta = v.id_venta
        WHERE EXTRACT(YEAR FROM v.fecha_venta) = $1
        GROUP BY mes
        ORDER BY mes;
    `;

    try {
        const resultados = await db.any(sql, [anioNum]);
        return resultados;
    } catch (error) {
        console.error('Error al obtener el total vendido por mes:', error.message || error);
        throw error;
    }
};

//---------------------------------------------------------------------------------------------------------------------------

module.exports = Producto;