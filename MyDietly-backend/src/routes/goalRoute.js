import { Router } from 'express';
import goalController from '../controllers/goalController.js';
const goalRouter = Router();
goalRouter.get('/', goalController.findAll);
export default goalRouter;