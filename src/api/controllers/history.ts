import { Request, Response } from 'express';

import { historyDb } from '../../main/db';
import { History } from '../../models/history';

class HistoryController {
  getAll(req: Request, res: Response<History[]>) {
    const history = historyDb.getData();

    return res.json(history);
  }
}

export default new HistoryController();
