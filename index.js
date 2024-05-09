const express = require('express');
const axios = require('axios');
require('dotenv').config();
const bodyParser = require('body-parser');


const app = express();
const PORT = process.env.PORT;

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(express.json());

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/crearUsuario.html');
});

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
  const { username, password, nombre, apellido, rol, estado } = req.body;

// validacion de campos
  if (!username || !password || !nombre || !apellido || !rol || !estado) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    const response = await axios.post('http://localhost:4002/createuser', {
      username,
      password,
      nombre,
      apellido,
      rol,
      estado
    });

    res.status(200).json(response.data); 
    
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json({ error: error.response.data.error });
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
});

app.get('/getusers', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:4003/listausuarios');
    const registros = response.data;
    res.json({ registros });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los registros' });
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







app.listen(PORT, () => {
  console.log(`Servidor de suma corriendo en http://localhost:${PORT}`);
});


// app.get('/sum', verifyToken, async (req, res) => {
//   try {

//     const { data: { num1, num2 } } = await axios.get('http://localhost:6001/random');
//     const suma = num1 + num2;
//     res.json({ suma });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error al sumar los números' });
//   }
// });


// app.get('/registros', verifyToken, async (req, res) => {
//   try {
//     const response = await axios.get('http://localhost:6001/all_registers');
//     const registros = response.data;
//     res.json({ registros });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error al obtener los registros' });
//   }
// });


// app.delete('/:id', verifyToken, async (req, res) => {
//   const id = req.params.id;
//   try {
//     await axios.delete(`http://localhost:6001/delete/${id}`);
//     res.json({ message: 'Registro eliminado correctamente' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error al eliminar el registro - PORT 6000' });
//   }
// });