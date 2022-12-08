import { Request, Response } from 'express';

import { blockedUsersDb, usersDb } from '@json-db';

class UserController {
  get(req: Request, res: Response) {
    const { id } = req.params;
    const user = usersDb.getFirst({ id });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isBlocked = blockedUsersDb.getFirst({ userId: id }) !== null;

    return res.json({ ...user, isBlocked });
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
