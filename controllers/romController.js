import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolviendo __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAvailableRoms = async (req, res, next) => {
    try {
        // Ruta absoluta a la carpeta de ROMs
        const romsDirectory = path.join(__dirname, '../public/roms');
        
        // Leemos el directorio de forma asíncrona
        const files = await fs.readdir(romsDirectory);
        
        // Filtramos solo archivos de Super Nintendo (.smc o .sfc)
        const roms = files.filter(file => file.endsWith('.smc') || file.endsWith('.sfc'));
        
        res.status(200).json({
            success: true,
            count: roms.length,
            data: roms
        });
    } catch (error) {
        // Pasamos el error al middleware de manejo de errores
        next(error);
    }
};