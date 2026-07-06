import express from 'express';
import { getAvailableRoms } from '../controllers/romController.js';

const router = express.Router();

// Endpoint: GET /api/v1/roms
router.get('/roms', getAvailableRoms);

export default router;