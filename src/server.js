const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 3000;
const path = require('path');

//Rutas del archivo JSON para la persistencia de datos
const rutaArchivoArticulos = './articulos.json';

//Middleware de body-parser para manejar diferentes formatos de peticiones y respuestas

//Analiza JSON
app.use(bodyParser.json()); 
//opción 2
//app.use(express().json())

//Analiza formularios con codificación URL
app.use(bodyParser.urlencoded({ extended: true })); 
//Analiza texto plano
app.use(bodyParser.text({ type: 'text/plain' })); 
//Analiza datos sin procesar
app.use(bodyParser.raw({ type: 'application/octet-stream' })); 


const leerArticulos = () => {
    try {
        const data = fs.readFileSync(rutaArchivoArticulos, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

const guardarArticulos = (articulos) => {
    fs.writeFileSync(rutaArchivoArticulos, JSON.stringify(articulos, null, 2), 'utf8');
};

//CRUD de artículos

app.post('/api/articulos', (req, res) => {
    const { nombre, categoria, precio } = req.body;

    if (!nombre || !categoria || !precio) {
        return res.status(400).send({
            error: true,
            codigo: 400,
            mensaje: 'Faltan datos en la solicitud'
        });
    }

    const articulos = leerArticulos();
    const nuevoArticulo = {
        id: articulos.length + 1,
        nombre,
        categoria,
        precio: parseFloat(precio)
    };

    articulos.push(nuevoArticulo);
    guardarArticulos(articulos);

    res.status(201).send({
        error: false,
        codigo: 201,
        mensaje: 'Artículo creado con éxito',
        data: nuevoArticulo
    });
});

app.get('/api/articulos', (req, res) => {
    const articulos = leerArticulos();
    res.status(200).send(
        {
        error: false,
        codigo: 200,
        mensaje: 'Lista de artículos',
        data: articulos
    }
);
});

app.get('/api/articulos/:id', (req, res) => {
    const { id } = req.params;
    const articulos = leerArticulos();
    const articulo = articulos.find(a => a.id === parseInt(id));

    if (!articulo) {
        return res.status(404).send({
            error: true,
            codigo: 404,
            mensaje: 'Artículo no encontrado'
        });
    }

    res.status(200).send({
        error: false,
        codigo: 200,
        mensaje: 'Artículo encontrado',
        data: articulo
    });
});

app.put('/api/articulos/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, categoria, precio } = req.body;

    const articulos = leerArticulos();
    const articuloIndex = articulos.findIndex(a => a.id === parseInt(id));

    if (articuloIndex === -1) {
        return res.status(404).send({
            error: true,
            codigo: 404,
            mensaje: 'Artículo no encontrado'
        });
    }

    articulos[articuloIndex] = {
        id: parseInt(id),
        nombre: nombre || articulos[articuloIndex].nombre,
        categoria: categoria || articulos[articuloIndex].categoria,
        precio: precio !== undefined ? parseFloat(precio) : articulos[articuloIndex].precio
    };

    guardarArticulos(articulos);

    res.status(200).send({
        error: false,
        codigo: 200,
        mensaje: 'Artículo actualizado con éxito',
        data: articulos[articuloIndex]
    });
});

app.delete('/api/articulos/:id', (req, res) => {
    const { id } = req.params;
    const articulos = leerArticulos();
    const articuloIndex = articulos.findIndex(a => a.id === parseInt(id));

    if (articuloIndex === -1) {
        return res.status(404).send({
            error: true,
            codigo: 404,
            mensaje: 'Artículo no encontrado'
        });
    }

    const articuloEliminado = articulos.splice(articuloIndex, 1);
    guardarArticulos(articulos);

    res.status(200).send({
        error: false,
        codigo: 200,
        mensaje: 'Artículo eliminado con éxito',
        data: articuloEliminado[0]
    });
});

// app.use((req, res) => {
//     res.status(404).send({
//         error: true,
//         codigo: 404,
//         mensaje: 'Ruta no encontrada'
//     });
// });

//version 2 con archivo
app.use((req, res) => {
   res.sendFile(path.join(__dirname, 'error404.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
