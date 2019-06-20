const express = require('express');

let { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// ===========================
// Obtener todos los productos
// ===========================
app.get('/productos', verificaToken, (req, res) => {
    // se trae todos los productos
    // populate: usuarios categoria
    // paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true }, 'nombre descripcion precioUni categoria')
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({ ok: false, err });
            }

            Producto.countDocuments({ disponible: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    cuantos: conteo
                });
            });
        });
});

// ===========================
// Obtener un producto por Id
// ===========================
app.get('/productos/:id', verificaToken, (req, res) => {
    // populate: usuarios categoria
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({ ok: false, err });
            }

            if (!productoDB) {
                return res.status(400).json({ ok: false, err: { message: 'ID no existe' } });
            }

            res.json({
                ok: true,
                producto: productoDB
            });
        });
});

// ===========================
// Crear un nuevo producto
// ===========================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({ ok: false, err });
            }

            res.json({
                ok: true,
                productos
            });
        });
});

// ===========================
// Crear un nuevo producto
// ===========================
app.post('/productos', verificaToken, (req, res) => {
    // populate: usuarios categoria
    // grabar el usuario
    // grabar la categoria del listado
    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({ ok: false, err });
        }

        if (!productoDB) {
            return res.status(400).json({ ok: false, err });
        }

        return res.status(200).json({ ok: true, producto: productoDB });
    });
});

// ===========================
// Actualizar un producto
// ===========================
app.put('/productos/:id', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar la categoria del listado
    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({ ok: false, err });
        }

        if (!productoDB) {
            return res.status(400).json({ ok: false, err: { message: 'Producto no encontrado' } });
        }
        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({ ok: false, err });
            }

            if (!productoGuardado) {
                return res.status(400).json({ ok: false, err });
            }

            res.json({
                ok: true,
                producto: productoGuardado
            });
        });
    });
});

// ===========================
// Borrar un producto
// ===========================
app.delete('/productos/:id', verificaToken, (req, res) => {
    // no borrar producto fisicamente sino actualizar el estado: disponible = false
    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({ ok: false, err });
        }

        if (!productoDB) {
            return res.status(400).json({ ok: false, err: { message: 'Producto no encontrado' } });
        }

        productoDB.disponible = false;

        productoDB.save((err, productoBorrado) => {
            if (err) {
                return res.status(500).json({ ok: false, err });
            }

            if (!productoBorrado) {
                return res.status(400).json({ ok: false, err });
            }

            res.json({
                ok: true,
                producto: productoBorrado
            });
        });
    });
});

module.exports = app;