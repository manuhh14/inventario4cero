const pgp = require('pg-promise')();
const connectionString = 'postgresql://inventario_666p_user:FH8EPWjRBjl1W4bu1nNSxkiobxAvCpPS@dpg-d4j1q27diees738fj7h0-a.oregon-postgres.render.com/inventario_666p?ssl=true';
const db = pgp(connectionString);

console.log("intentando conectar...");

db.connect()
    .then(obj => {
        console.log("✅ ¡ÉXITO! La base de datos está activa y te dejó entrar.");
        obj.done(); // cerrar conexión
        process.exit();
    })
    .catch(error => {
        console.error("❌ ERROR DETECTADO:");
        console.error("Código de error:", error.code);
        console.error("Mensaje:", error.message);
        process.exit();
    });