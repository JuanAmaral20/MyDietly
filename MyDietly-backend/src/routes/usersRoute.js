import { Router } from 'express';
import UsersController from '../controllers/usersController.js';
import authenticateToken from '../middlewares/authenticateToken.js';

const usersRouter = Router();

usersRouter.post('/', UsersController.createUser);
usersRouter.post('/login', UsersController.login);
usersRouter.post('/metrics', authenticateToken, UsersController.createMetrics);

export default usersRouter;