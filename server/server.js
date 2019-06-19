require('./config/config');
var colors = require('colors');
const express = require('express');
const app = express();
const mongoose = require('mongoose');

// Configuraion de rutas:
app.use(require('./routes/index'));

/// mongoose.connect('mongodb://localhost:27017/cafe', { useNewUrlParser: true, useCreateIndex: true }, (err, res) => {
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true }, (err, res) => {
    if (err) {
        throw err;
    }
    console.log('Base de datos ONLINE'.green);
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', 3000);
});