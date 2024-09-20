const express = require('express');
const app = express();
const {interactuar, entrenar, restaurar} = require('./chatbotAI.js');
const path = require('path');

app.use(express.static(__dirname + "/src"));

app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/index.html'));
})

app.post('/enviar', async(req, res) => {
    const mensaje = req.body.mensaje;
    let resultado = await interactuar(mensaje);
    let objeto = {
      respuesta: resultado.answer,
      sentimiento: resultado.sentiment  
    }
    res.json(JSON.stringify(objeto));
})

app.post('/entrenar', async(req, res) => {
    const mensaje = req.body.mensaje;
    const respuesta = req.body.respuesta;
    let resultado = await entrenar(mensaje, respuesta);
    let objeto = {
        respuesta: resultado
    }
    res.json(JSON.stringify(objeto))
})

app.post('/restaurar', async(req, res) => {
    restaurar();
    res.json(JSON.stringify({respuesta: 'Restauración completa'}));
})

app.listen(3000, () => console.log("CONECTADO"));