import { Router } from 'express';
import HistoryController from './controllers/history';
import UserController from './controllers/user';

const routes = Router();

routes.get('/history', HistoryController.getAll);

routes.get('/users/:id', UserController.get);
routes.get('/users', UserController.getAll);

export default routes;
