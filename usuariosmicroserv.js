const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
require('dotenv').config();


const app = express();
const PORT2 = process.env.PORT2;
app.use(bodyParser.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

(async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(10) NOT NULL,
        password VARCHAR(15) NOT NULL,
        nombre VARCHAR(15) NOT NULL,
        apellido VARCHAR(15) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
  } catch (err) {
    console.error('Error creando la tabla', err);
  } finally {
    client.release();
  }
})();

app.post('/createuser', async (req, res) => {
  const datacliente = req.body;

  const username = datacliente.username;
  const password = datacliente.password;
  const nombre = datacliente.nombre;
  const apellido = datacliente.apellido;
  const rol = datacliente.rol;
  const estado = datacliente.estado;
  const createdAt = new Date(); // Genera la fecha actual


  try {
    const client = await pool.connect();
    await client.query('INSERT INTO users (username, password, nombre, apellido, rol, estado, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)', [username, password, nombre, apellido, rol, estado, createdAt]);
    client.release();
    res.status(200).json({ message: "Usuario creado con éxito" });
    // res.json({ message: "Usuario creado con éxito" });
  } catch (err) {
    console.error('Error en la ejecución de la query', err);
    res.status(500).json({ error: 'Error de servidor' });
  }
});



app.get('/all_registers', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM generated_numbers');
    client.release();
    res.json(result.rows);
  } catch (err) {
    console.error('Error al ejecutar la query', err);
    res.status(500).json({ error: 'Error al obtener los registros' });
  }
});


app.delete('/delete/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const client = await pool.connect();
    await client.query(`DELETE FROM generated_numbers WHERE id = ${id}`);
    client.release();
    res.json({ message: 'Registro eliminado correctamente' });
  } catch (err) {
    console.error('Error al ejecutar la query', err);
    res.status(500).json({ error: 'Error al eliminar el registro' });
  }
});


app.listen(PORT2, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT2}`);
});
