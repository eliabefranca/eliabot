import { Router } from 'express';
import HistoryController from './controllers/history';

const routes = Router();

routes.get('/history', HistoryController.getAll);

export default routes;
