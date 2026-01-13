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
const DB_URL = 'postgresql://inventario69_user:RXnkZ9JMXbojW7WKP093ZxJLq1uH0CPo@dpg-d5j6c1chg0os73ehjda0-a.oregon-postgres.render.com/inventario69?ssl=true';

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
