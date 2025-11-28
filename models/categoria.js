const db = require('../config/config');
const Categoria = {};





// Insertar datos en la tabla categorias
Categoria.registrarCategoria = async (datos) => {
    const sql = `
        INSERT INTO public.categorias (id_categoria, nombre_categoria, descripcion_categoria)
        VALUES ($1, $2, $3)
        RETURNING id_categoria, nombre_categoria, descripcion_categoria
    `;
    // Usar one() para retornar el registro insertado
    return db.one(sql, [datos.id_categoria, datos.nombre_categoria, datos.descripcion_categoria]);
};



//OBTENER TODAS LAS CATEGORIAS
Categoria.getAll = () => {
    const sql = 'SELECT * FROM public.categorias';
    return db.manyOrNone(sql);
}




//BUSCAR POR NOMBRE DE LA CATEGORIA
Categoria.buscarPorNombre = async (nombre) => {
  const sql = `
    SELECT * FROM categorias
    WHERE nombre_categoria ILIKE '%$1:value%'
    ORDER BY nombre_categoria ASC
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




//BUSCAR POR ID DE LA CATEGORIA
Categoria.buscarPorId = async (Id) => {
  const sql = `
    SELECT * FROM categorias
    WHERE id_categoria = $1
    ORDER BY id_categoria ASC
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
Categoria.eliminarPorId = async (Id) => {
  const sql = `
    DELETE FROM categorias
    WHERE id_categoria = $1
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
Categoria.actualizarPorId = async (id_categoria, datos) => {
  const {
    nombre_categoria,
    descripcion_categoria,
  } = datos;

  const sql = `
    UPDATE categorias
    SET 
      nombre_categoria = $1,
      descripcion_categoria = $2
    WHERE id_categoria = $3
  `;

  const values = [
    nombre_categoria,
    descripcion_categoria,
    id_categoria,
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







module.exports = Categoria;
