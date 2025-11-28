const promise = require('bluebird');

// Configuración pg-promise
const options = {
  promiseLib: promise,
  query: (e) => {
    console.log('Consulta ejecutada:', e.query);
    console.log('Parámetros:', e.params);
  },
};

const pgpLib = require('pg-promise');
const pgp = pgpLib(options);

const types = pgp.pg.types;
types.setTypeParser(1114, (stringValue) => stringValue);

//URL EXTERNA DE RENDER (con SSL)
const DB_URL = 'postgresql://inventario_666p_user:FH8EPWjRBjl1W4bu1nNSxkiobxAvCpPS@dpg-d4j1q27diees738fj7h0-a.oregon-postgres.render.com/inventario_666p?ssl=true';

const db = pgp(DB_URL);

// Probar conexión
db.connect()
  .then(obj => {
    console.log(' Conectado exitosamente a Render PostgreSQL');
    obj.done();
  })
  .catch(error => {
    console.error(' ERROR al conectar a Render:', error);
  });

module.exports = db;
