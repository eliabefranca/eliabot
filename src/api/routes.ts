import { Router } from 'express';
import HistoryController from './controllers/history';
import UserController from './controllers/user';
import GroupController from './controllers/group';

const routes = Router();

routes.get('/history', HistoryController.getAll);

routes.get('/users/:id', UserController.get);
routes.get('/users', UserController.getAll);

routes.get('/groups', GroupController.getAll);
routes.get('/groups/:id', GroupController.get);

export default routes;
