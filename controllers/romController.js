import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAvailableRoms = async (req, res, next) => {
    try {
        const romsDirectory = path.join(__dirname, '../public/roms');
        
        const files = await fs.readdir(romsDirectory);
        
        const roms = files.filter(file => file.endsWith('.smc') || file.endsWith('.sfc'));
        
        res.status(200).json({
            success: true,
            count: roms.length,
            data: roms
        });
    } catch (error) {
        next(error);
    }
};