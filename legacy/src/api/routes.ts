import { Router } from 'express';
import UserController from './controllers/user';
import GroupController from './controllers/group';
import BlockedUsersController from './controllers/blocked-users';

const routes = Router();

routes.get('/users/:id', UserController.get);
routes.get('/users', UserController.getAll);
routes.delete('/users/:id', UserController.delete);
routes.put('/users/:id', UserController.put);

routes.delete('/blocked-users/:id', BlockedUsersController.delete);
routes.post('/blocked-users', BlockedUsersController.post);

routes.get('/groups', GroupController.getAll);
routes.get('/groups/:id', GroupController.get);

export default routes;
