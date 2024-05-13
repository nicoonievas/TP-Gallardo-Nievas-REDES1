
const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT5 = process.env.PORT5;



app.get('/translate/:text', async (req, res) => {
    const text = req.params.text;
    try {
      const response = await axios.get(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|es`);
      const responsetranslated = response.data.responseData.translatedText;
      
      res.json(responsetranslated);
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener la traducción' });
    }
  });
  

  
app.listen(PORT5, () => {
    console.log(`Servidor de traduccion corriendo en http://localhost:${PORT5}`);
  });