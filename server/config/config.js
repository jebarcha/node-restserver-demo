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
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

// ===========================
//  Vencimiento del Token
// ===========================
// 60 segundos * 60 minutos * 24 horas * 30 dias
process.env.CADUCIDAD_TOKEN = '48h'; // 60 * 60 * 24 * 30;

// ===========================
//  SEED de autenticacion
// ===========================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// ===========================
//  Google Client Id
// ===========================
process.env.CLIENT_ID =
    process.env.CLIENT_ID || '817536630738-9jgk9ksor8jljl0b54pqdq8732e6ecrb.apps.googleusercontent.com';