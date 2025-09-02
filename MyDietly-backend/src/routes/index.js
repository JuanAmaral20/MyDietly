// src/routes/index.js
import { Router } from 'express';
import usersRouter from './usersRoute.js'; 
import dietRouter from './dietRoute.js';
import geminiRouter from './geminiRoute.js';
import goalRouter from './goalRoute.js';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/diets', dietRouter);
routes.use('/goals', goalRouter);
routes.use('/gemini', geminiRouter);

export default routes;