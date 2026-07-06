import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './routes/apiRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(helmet({
    contentSecurityPolicy: false,     crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false
}));
app.use(cors());
app.use(express.json()); 
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1', apiRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 Servidor inicializado con éxito`);
    console.log(`⚙️  Entorno: ${process.env.NODE_ENV}`);
    console.log(`📡 Puerto: ${PORT}`);
    console.log(`=========================================`);
});