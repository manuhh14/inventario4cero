const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app); 
const cors = require('cors');
const path = require('path');
const fs = require('fs'); 

// 📚 IMPORTACIÓN DE SWAGGER
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

// ====================================================================
// 1. IMPORTACIÓN DE RUTAS
// ====================================================================
const producto = require('./routes/rutasProducto');
const categoria = require('./routes/rutasCategoria');
const proveedor = require('./routes/rutasProveedor');
const cliente = require('./routes/rutasCliente');
const usuario = require('./routes/rutasUsuario');
const venta = require('./routes/rutasVenta');
const estadisticas = require('./routes/rutasEstadisticas');

// ====================================================================
// 2. CONFIGURACIÓN DE SWAGGER
// ====================================================================
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Inventory Master Pro 4.0 - API Documentation',
            version: '1.0.0',
            description: 'Sistema integral de gestión de inventarios con soporte para códigos QR, barras, análisis ABC, reportes en PDF y Auditoría de Seguridad.',
            contact: { name: 'Javier - Desarrollo de Software' },
        },
        servers: [
            { url: 'http://localhost:3000', description: 'Servidor Local (Pruebas)' }
        ],
        components: {
            schemas: {
                Producto: {
                    type: 'object',
                    properties: {
                        id_producto: { type: 'string', example: 'PROD-001' },
                        nombre_producto: { type: 'string', example: 'Llave Hexagonal 1/2' },
                        precio_venta: { type: 'number', example: 85.50 },
                        stock_actual: { type: 'integer', example: 50 },
                        sku: { type: 'string', example: 'SKU-789-ABC' }
                    }
                }
            }
        },
        paths: {
            '/api/productos/getAllProductos': {
                get: {
                    tags: ['Inventario'],
                    summary: 'Lista completa de productos',
                    responses: { 200: { description: 'Éxito' } }
                }
            },
            '/api/productos/registrarProducto': {
                post: {
                    tags: ['Inventario'],
                    summary: 'Registrar un nuevo producto',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        id_producto: { type: 'string' },
                                        nombre_producto: { type: 'string' },
                                        precio_venta: { type: 'number' },
                                        stock_actual: { type: 'integer' },
                                        id_categoria: { type: 'integer' }
                                    }
                                }
                            }
                        }
                    },
                    responses: { 201: { description: 'Creado' } }
                }
            },
            '/api/productos/eliminarPorId/{Id}': {
                delete: {
                    tags: ['Inventario'],
                    summary: 'Eliminar producto por ID',
                    parameters: [{ in: 'path', name: 'Id', required: true, schema: { type: 'string' } }],
                    responses: { 200: { description: 'Eliminado' } }
                }
            },
            '/api/auditoria/ver': {
                get: {
                    tags: ['Seguridad'],
                    summary: 'Ver bitácora de auditoría',
                    responses: { 200: { description: 'OK' } }
                }
            },
            '/api/productos/reporte/pdf': {
                get: {
                    tags: ['Reportes y Documentos'],
                    summary: 'Descargar Reporte PDF',
                    responses: { 200: { description: 'PDF generado' } }
                }
            },
            '/api/productos/abc/{mes}/{anio}': {
                get: {
                    tags: ['Reportes y Documentos'],
                    summary: 'Análisis ABC de Inventario',
                    parameters: [
                        { in: 'path', name: 'mes', required: true, schema: { type: 'integer' } },
                        { in: 'path', name: 'anio', required: true, schema: { type: 'integer' } }
                    ],
                    responses: { 200: { description: 'Análisis exitoso' } }
                }
            },
            '/api/productos/qr/{id}': {
                get: {
                    tags: ['Reportes y Documentos'],
                    summary: 'Generar Código QR',
                    parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
                    responses: { 200: { description: 'Imagen QR' } }
                }
            }
        }
    },
    apis: [], // IMPORTANTE: Dejar vacío para evitar errores de duplicidad con rutasProducto.js
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// ====================================================================
// 3. MIDDLEWARES
// ====================================================================
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// ====================================================================
// 4. RUTA BITÁCORA
// ====================================================================
app.get('/api/auditoria/ver', (req, res) => {
    const rutaLog = path.join(__dirname, 'bitacora_auditoria.log');
    if (fs.existsSync(rutaLog)) {
        const contenido = fs.readFileSync(rutaLog, 'utf8');
        res.send(`<html><body style="background:#121212;color:#00ff41;padding:30px;"><pre>${contenido}</pre></body></html>`);
    } else {
        res.status(404).send("No hay logs.");
    }
});

// ====================================================================
// 5. USO DE RUTAS
// ====================================================================
app.use('/api/productos', producto);
app.use('/api/categorias', categoria);
app.use('/api/proveedores', proveedor);
app.use('/api/clientes', cliente);
app.use('/api/usuarios', usuario);
app.use('/api/ventas', venta);
app.use('/api/estadisticas', estadisticas);

// ====================================================================
// 6. LANZAMIENTO
// ====================================================================
const port = 3000;
server.listen(port, '0.0.0.0', () => {
  console.log(`🚀 API lista en http://localhost:${port}/api-docs`);
});