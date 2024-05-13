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
  res.sendFile(__dirname + '/public/panelControl.html');
});

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
console.log(authHeader);
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

const verifyRol = (req, res, next) => {
  let rol = req.username;
  if (rol !== 'admin') {
    return res.status(403).json({ error: 'Rol no autorizado' });
  }
  next();
}

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

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const response = await axios.post('http://localhost:4006/validar', { username, password });

    if (response.data.success) {
      const token = generateToken({ username });
      console.log(token);
      res.status(200).json({ token });
    } else {
      res.status(200).json({ error: 'Credenciales incorrectas' });
    }
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json({ error: error.response.data.error });
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
});



app.get('/getusers', verifyToken, async (req, res) => {
  try {
    const response = await axios.get('http://localhost:4003/listausuarios');
    let registros = response.data;
    res.json({ registros });
    return registros;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los registros' });
  }
});

app.get('/getusers/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const response = await axios.get(`http://localhost:4003/listausuarios/${id}`);
    let registros = response.data;
    res.json({ registros });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los registros' });
  }
});

app.put('/estado/:id', async (req, res) => {
  const idUsuario = req.params.id;
  try {
    const responseusuario = await axios.get(`http://localhost:4003/listausuarios/${idUsuario}`);
    
    let estado= responseusuario.data.estado;
    if (estado == true) {
      estado = false;
    } else {
      estado = true;
    }

    const response  = await axios.put(`http://localhost:4004/estado/${idUsuario}`, { estado });
    res.status(200).json(response.data)
    // res.json({ response });
 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al modificar el estado' });
  }
});


app.get('/roles', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:4003/roles');
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los roles' });
  }
});



app.put('/roles/:id', async (req, res) => {
  const userId = req.params.id;
  const { rol } = req.body;
  try {
    const response = await axios.put(`http://localhost:4002/roles/${userId}`, { rol });
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cambiar el rol' });
  }
})


app.get('/translate/:text', verifyToken, verifyRol('admin'), async (req, res) => {
  const text = req.params.text;
  try {
    const translated = await axios.get(`http://localhost:4005/translate/${encodeURIComponent(text)}`);
  
    res.json(translated.data);


  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la traducción' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor de suma corriendo en http://localhost:${PORT}`);
});