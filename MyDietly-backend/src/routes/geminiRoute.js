import { Router } from "express";
import authenticateToken from '../middlewares/authenticateToken.js';
import geminiController from "../controllers/geminiController.js";

const geminiRouter = Router();

geminiRouter.post('/diet-tip', authenticateToken, geminiController.createMetricsAndGenerateDiet);

export default geminiRouter;