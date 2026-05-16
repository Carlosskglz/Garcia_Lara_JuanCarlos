const express = require('express');
const mysql = require('mysql2');
const app = express();
const PORT = process.env.PORT || 3000;

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Pomelo24+', 
    database: 'pnt_practica1', 
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
const db = pool.promise();

app.use(express.json()); 
app.use(express.static('public')); 

app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en el puerto: ${PORT}`);
    console.log('Para salir presiona Ctrl + C');
});