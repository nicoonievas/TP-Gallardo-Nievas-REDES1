const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
require('dotenv').config();


const app = express();
const PORT3 = process.env.PORT3;
app.use(bodyParser.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});


app.get('/listausuarios', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users');
    client.release();
    res.json(result.data);
  } catch (err) {
    console.error('Error al ejecutar la query', err);
    res.status(500).json({ error: 'Error al obtener los registros' });
  }
});


// app.delete('/delete/:id', async (req, res) => {
//   const id = req.params.id;
//   try {
//     const client = await pool.connect();
//     await client.query(`DELETE FROM generated_numbers WHERE id = ${id}`);
//     client.release();
//     res.json({ message: 'Registro eliminado correctamente' });
//   } catch (err) {
//     console.error('Error al ejecutar la query', err);
//     res.status(500).json({ error: 'Error al eliminar el registro' });
//   }
// });


app.listen(PORT3, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT3}`);
});
