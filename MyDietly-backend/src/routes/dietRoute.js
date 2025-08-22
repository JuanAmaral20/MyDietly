import { Router } from 'express';
import authenticateToken from '../middlewares/authenticateToken.js';
import dietController from '../controllers/dietController.js';

const dietRouter = Router();

dietRouter.post('/', authenticateToken, dietController.createDiet);
dietRouter.post('/:dietId/details', authenticateToken, dietController.createDietDetails);

dietRouter.get('/me', authenticateToken, dietController.getCurrentUserDiet);
dietRouter.get('/:dietId', authenticateToken, dietController.getDietById);
dietRouter.get('/:dietId/details', authenticateToken, dietController.getDietDetails);

export default dietRouter;