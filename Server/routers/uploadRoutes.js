// Server/routers/uploadRoutes.js
import express from 'express';
import { getUploadSign } from '../controllers/uploadController.js';

const router = express.Router();

// GET /api/upload/sign?filename=xxx.png&contentType=image/png
router.get('/upload/sign', getUploadSign);

export default router;
