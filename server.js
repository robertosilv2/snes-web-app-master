import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './routes/apiRoutes.js';

// Configurar variables de entorno
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 1. Middlewares de Seguridad y Utilidad
// NOTA: Para el emulador Wasm, necesitamos ajustar algunas cabeceras de seguridad de Helmet
// para permitir la ejecución de scripts locales y el uso de SharedArrayBuffer (requerido por emuladores).
app.use(helmet({
    contentSecurityPolicy: false, // Relajamos temporalmente CSP para permitir el canvas del emulador
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false
}));
app.use(cors());
app.use(express.json()); // Parseo de JSON para futuras peticiones POST (ej. guardar partidas)

// 2. Servir Archivos Estáticos (Frontend)
// Cualquier petición a la raíz servirá los archivos de la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// 3. Rutas de la API (Backend Logic)
app.use('/api/v1', apiRoutes);

// 4. Middleware de Manejo de Errores Global (Buena práctica de arquitectura)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// Inicialización del Servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 Servidor inicializado con éxito`);
    console.log(`⚙️  Entorno: ${process.env.NODE_ENV}`);
    console.log(`📡 Puerto: ${PORT}`);
    console.log(`=========================================`);
});