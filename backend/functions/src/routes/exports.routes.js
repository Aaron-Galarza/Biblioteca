import express from 'express';
import { exportDatabaseToCSV } from '../controllers/exports.controller.js';

const router = express.Router();

// Ruta para exportar TODA la base de datos
router.get("/export-database", exportDatabaseToCSV);

export default router;