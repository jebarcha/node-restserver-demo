const express = require('express');

let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let Categoria = require('../models/categoria');

let app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// ============================
// Mostrar todas las categorias
// ============================
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({}).populate('usuario', 'nombre email').sort('descripcion').exec((err, categorias) => {
        if (err) {
            return res.status(500).json({ ok: false, err });
        }

        res.json({
            ok: true,
            categorias
        });
    });
});

// ============================
// Mostrar una categoria por ID
// ============================
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({ ok: false, err });
        }

        if (!categoriaDB) {
            return res.status(400).json({ ok: false, err: { message: 'El ID no es correcto' } });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// ============================
// Crear nueva categoria
// ============================
app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body;

    console.log('my body: ', body);
    console.log('req: ', req);

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({ ok: false, err });
        }

        if (!categoriaDB) {
            return res.status(400).json({ ok: false, err });
        }

        return res.status(200).json({ ok: true, categoria: categoriaDB });
    });
});

// ============================
// Modificar una categoria
// ============================
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findOneAndUpdate(id, descCategoria, { new: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({ ok: false, err });
        }

        if (!categoriaDB) {
            return res.status(400).json({ ok: false, err });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// ============================
// Borrar una categoria
// ============================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err) {
            res.status(400).json({ ok: false, err });
            return;
        }

        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoria Borrada'
        });
    });
});

module.exports = app;