const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
require('dotenv').config();


const app = express();
const PORT6 = process.env.PORT6;
app.use(bodyParser.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});


app.post('/validar', async (req, res) => {
    const { username, password } = req.body;
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
    client.release();
    if (result.rows.length > 0) {
        res.status(200).json({ success: true});
      } else {
        res.status(200).json({ success: false});
      }
  } catch (err) {
    console.error('Error al ejecutar la query', err);
    res.status(500).json({ error: 'Error de servidor' });
  }
});


app.listen(PORT6, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT6}`);
});
