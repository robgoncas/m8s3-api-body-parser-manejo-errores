Aquí tienes la explicación sobre los conceptos de **análisis de cuerpo** y **códigos de respuesta HTTP** en Express.js:

# Análisis de Cuerpo y Códigos de Respuesta HTTP en Express

En este documento, exploramos diferentes métodos de análisis de cuerpo y el manejo de respuestas HTTP en un entorno Express.js.

## Análisis de Cuerpo

### 1. Analizador de Cuerpo JSON
Se utiliza para analizar los cuerpos de solicitudes con formato JSON y convertirlos en objetos de JavaScript.

```javascript
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

app.post('/api/json', (req, res) => {
    const data = req.body;
    const data = {
        attr1: val1,
        attr2: val2,
    }
    res.send(`Datos recibidos: ${JSON.stringify(data)}`);
});

app.listen(3000, () => console.log('Servidor corriendo en puerto 3000'));
```

### 2. Analizador de Cuerpo Sin Procesar
Deja el cuerpo de la solicitud sin procesar como un `Buffer`. Útil para manejar datos binarios.

```javascript
app.use(bodyParser.raw({ type: 'application/octet-stream' }));

app.post('/api/raw', (req, res) => {
    const rawData = req.body;
    res.send(`Tamaño de los datos recibidos: ${rawData.length} bytes`);
});
```

### 3. Analizador de Cuerpo de Texto
Convierte el cuerpo de la solicitud en una cadena de texto plano.

```javascript
app.use(bodyParser.text({ type: 'text/plain' }));

app.post('/api/text', (req, res) => {
    const textData = req.body;
    res.send(`Texto recibido: ${textData}`);
});
```

### 4. Analizador de Cuerpo URL-encoded
Analiza cuerpos de solicitudes de formularios codificados con URL (comúnmente enviados por formularios HTML). Convierte pares clave-valor en un objeto JavaScript.

```javascript
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/form', (req, res) => {
    const formData = req.body;
    res.send(`Formulario recibido: ${JSON.stringify(formData)}`);
});
```

### Opción Extended
- `extended: true`: Permite el análisis de objetos y arreglos anidados.
- `extended: false`: Solo permite pares clave-valor simples.

## Códigos de Respuesta HTTP

### Respuestas de Éxito (2xx)
- **200 OK**: La solicitud fue exitosa y el servidor devolvió el recurso solicitado.
- **201 Created**: La solicitud fue exitosa y se creó un recurso.

```javascript
app.post('/api/success', (req, res) => {
    res.status(201).send('Recurso creado con éxito');
});
```

### Respuestas de Error del Cliente (4xx)
- **400 Bad Request**: El servidor no pudo procesar la solicitud debido a un error del cliente.
- **404 Not Found**: El recurso solicitado no fue encontrado en el servidor.

```javascript
app.use((req, res) => {
    res.status(404).send({ error: true, codigo: 404, mensaje: 'URL no encontrada' });
});
```

### Respuestas de Error del Servidor (5xx)
- **500 Internal Server Error**: El servidor encontró una condición inesperada.

```javascript
app.use((err, req, res, next) => {
    res.status(500).send({ error: true, codigo: 500, mensaje: 'Error interno del servidor' });
});
```

## Manejo de Errores Personalizados

Define respuestas de error personalizadas para problemas de validación o de rutas.

```javascript
app.post('/api/usuario', (req, res) => {
    const { nombre, apellido } = req.body;

    if (!nombre || !apellido) {
        res.status(400).send({
            error: true,
            codigo: 400,
            mensaje: 'Nombre y apellido son requeridos'
        });
    } else {
        const usuario = { nombre, apellido };
        res.status(200).send({
            error: false,
            codigo: 200,
            mensaje: 'Usuario creado con éxito',
            respuesta: usuario
        });
    }
});
```