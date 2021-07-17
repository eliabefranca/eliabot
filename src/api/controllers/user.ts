import { Request, Response } from 'express';

import { usersDb } from '../../database/json/db';

class UserController {
  get(req: Request, res: Response) {
    const { id } = req.params;
    const user = usersDb.getFirst({ id });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(user);
  }

  getAll(req: Request, res: Response) {
    const users = usersDb.getData();

    return res.json(users);
  }

  delete(req: Request, res: Response) {
    const { id } = req.params;
    const user = usersDb.getFirst({ id });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    usersDb.delete(user);

    return res.json(user);
  }

  put(req: Request, res: Response) {
    const { id } = req.params;
    const user = usersDb.getFirst({ id });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    usersDb.update({ id }, req.body);

    const updatedUser = usersDb.getFirst({ id });

    return res.json(updatedUser);
  }
}

export default new UserController();
