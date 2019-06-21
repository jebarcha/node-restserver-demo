const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', function(req, res) {
    let tipo = req.params.tipo;
    let id = req.params.id;

    if (Object.keys(req.files).length == 0) {
        return res.status(400).json({
            ok: false,
            err: { message: 'No se ha seleccionado ningun archivo' }
        });
    }

    // Validar tipo
    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: { message: 'Los tipos permitidos son ' + tiposValidos.join(', ') }
        });
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    // console.log('nombreArchivo', nombreArchivo);
    let extensionArchivo = nombreCortado[nombreCortado.length - 1];
    // console.log('extensionArchivo', extensionArchivo);

    // validar extensiones de archivo permitidas:
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg', 'bmp'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res
            .status(400)
            .json({ ok: false, err: { message: 'Las extensiones permitidas son ' + extensionesValidas.join(', ') } });
    }

    // Cambiar el nombre al archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err) return res.status(500).json({ ok: false, err });

        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }
        // res.json({ ok: true, message: 'Imagen subida correctamente!' });
    });
});

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borrarArchivo('usuarios', nombreArchivo);
            return res.status(500).json({ ok: false, err });
        }

        if (!usuarioDB) {
            borrarArchivo('usuarios', nombreArchivo);
            return res.status(400).json({ ok: false, err: { message: 'Usuario no existe' } });
        }

        borrarArchivo('usuarios', usuarioDB.img);

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado) => {
            res.json({ ok: true, usuario: usuarioGuardado, img: nombreArchivo });
        });
    });
}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borrarArchivo('productos', nombreArchivo);
            return res.status(500).json({ ok: false, err });
        }

        if (!productoDB) {
            borrarArchivo('productos', nombreArchivo);
            return res.status(400).json({ ok: false, err: { message: 'Producto no existe' } });
        }

        borrarArchivo('productos', productoDB.img);

        productoDB.img = nombreArchivo;
        productoDB.save((err, productoGuardado) => {
            res.json({ ok: true, producto: productoGuardado, img: nombreArchivo });
        });
    });
}

function borrarArchivo(tipo, nombreImagen) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;