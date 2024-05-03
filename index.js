const express = require('express');
const axios = require('axios');
require('dotenv').config();
const bodyParser = require('body-parser');


const app = express();
const PORT = process.env.PORT;

app.use(bodyParser.json());
app.use(express.json());

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;


const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token inválido' });
    }
    req.user = decoded;
    next();
  });
};

//Genera Token
const generateToken = (user) => {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });
};


app.post('/createuser', async (req, res) => {
  // Declara las variables antes de utilizarlas
  const username = "joaquin";
  const password = "1234";
  const nombre = "joaquin";
  const apellido = "gallardo";
  const userdata = {username, password, nombre, apellido};


  // Validar datos provenientes del front
  
  try {
    const response = await axios.post('http://localhost:4002/createuser', userdata);
    res.status(200).json(response.data); 
  } catch (error) {
    res.status(401).json({ error: 'Error al enviar los datos' });
  }
});


app.post('/login', (req, res) => {
  const { username, password } = req.body;
  //Lógica de user y pass
  if (username === 'raul' && password === '1234') {
    const token = generateToken({ username });
    res.json({ token }); //Devuelve token con 1h. de validez
  } else {
    res.status(401).json({ error: 'Credenciales incorrectas' });
  }
});





app.get('/sum', verifyToken, async (req, res) => {
  try {

    const { data: { num1, num2 } } = await axios.get('http://localhost:6001/random');
    const suma = num1 + num2;
    res.json({ suma });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al sumar los números' });
  }
});


app.get('/registros', verifyToken, async (req, res) => {
  try {
    const response = await axios.get('http://localhost:6001/all_registers');
    const registros = response.data;
    res.json({ registros });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los registros' });
  }
});


app.delete('/:id', verifyToken, async (req, res) => {
  const id = req.params.id;
  try {
    await axios.delete(`http://localhost:6001/delete/${id}`);
    res.json({ message: 'Registro eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el registro - PORT 6000' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor de suma corriendo en http://localhost:${PORT}`);
});
