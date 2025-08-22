import { Router } from "express";
import authenticateToken from '../middlewares/authenticateToken.js';
import geminiController from "../controllers/geminiController.js";

const geminiRouter = Router();

geminiRouter.get('/diet-tip', authenticateToken, geminiController.generateAndSaveDiet);

export default geminiRouter;