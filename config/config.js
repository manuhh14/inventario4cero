const promise = require('bluebird');
const pgpLib = require('pg-promise');

const pgp = pgpLib({ promiseLib: promise });

const cn = {
    // La URL debe terminar en ?ssl=true
    connectionString: 'postgresql://inventario_666p_user:FH8EPWjRBjl1W4bu1nNSxkiobxAvCpPS@dpg-d4j1q27diees738fj7h0-a.oregon-postgres.render.com/inventario_666p?ssl=true',
    ssl: { rejectUnauthorized: false },
    max: 1, // Solo una conexión para no saturar el plan free
    connectionTimeoutMillis: 10000, // 10 segundos para conectar
    query_timeout: 10000
};

const db = pgp(cn);

// Esto probará la conexión una sola vez al iniciar
db.connect()
    .then(obj => {
        console.log('✅ CONECTADO A RENDER EXITOSAMENTE');
        obj.done(); 
    })
    .catch(error => {
        console.error('❌ ERROR DE CONEXIÓN A BASE DE DATOS:', error.message);
    });

module.exports = db;