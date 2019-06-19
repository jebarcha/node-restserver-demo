// ===========================
//  Puerto
// ===========================
process.env.PORT = process.env.PORT || 3000;

// ===========================
//  Entorno
// ===========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ===========================
//  Base de Datos
// ===========================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb://cafe-user:abcd123456@ds053380.mlab.com:53380/cafe';
}

process.env.URLDB = urlDB;