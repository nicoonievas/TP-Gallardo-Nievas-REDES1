const express = require('express');
const { Pool } = require('pg');
const axios = require('axios');
require('dotenv').config();
const bodyParser = require('body-parser');


const app = express();
const PORT4 = process.env.PORT4;

app.use(express.json());
app.use(bodyParser.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.put('/estado/:id', async (req, res) => {
  const idUsuario = req.params.id;
  const estado = req.body.estado;
  
  try { 
    const client = await pool.connect();
    await client.query('UPDATE users SET estado = $1 WHERE id = $2', [estado, idUsuario] );
    client.release();
    res.status(200).json({ message: "Usuario modificado con exito" });
  } catch (error) {
    console.error('Error en la ejecución de la query', error);
    res.status(500).json({ error: 'Error de servidor' });
  }

});

app.listen(PORT4, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT4}`);
});