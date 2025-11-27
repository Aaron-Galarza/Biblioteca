import express from 'express';
import { exportDatabaseToCSV } from '../controllers/exports.controller.js';
import { verifyToken, isAdmin, isUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/export-database",  verifyToken, isAdmin, exportDatabaseToCSV);

export default router;