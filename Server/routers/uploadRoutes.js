// Server/routers/uploadRoutes.js
import express from 'express';
import { getUploadSign } from '../controllers/uploadController.js';
import { roleValidation, validation } from '../middlewares/userMiddleware.js';

const router = express.Router();

// GET /api/upload/sign?filename=xxx.png&contentType=image/png
router.get('/upload/sign', validation, roleValidation('admin'), getUploadSign);

export default router;
