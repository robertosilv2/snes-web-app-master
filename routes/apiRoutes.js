import express from 'express';
import { getAvailableRoms } from '../controllers/romController.js';

const router = express.Router();

router.get('/roms', getAvailableRoms);

export default router;