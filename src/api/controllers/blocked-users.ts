import { Request, Response } from 'express';

import { blockedUsersDb } from '@json-db';

class BlockedUsersController {
  get(req: Request, res: Response) {
    const { id } = req.params;
    const blockedUser = blockedUsersDb.getFirst({ id });

    if (!blockedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ ...blockedUser });
  }

  getAll(req: Request, res: Response) {
    const blockedUsers = blockedUsersDb.getData();

    return res.json(blockedUsers);
  }

  delete(req: Request, res: Response) {
    const { id } = req.params;
    const blockedUser = blockedUsersDb.getFirst({ userId: id });

    if (!blockedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    blockedUsersDb.delete(blockedUser);

    return res.json(blockedUser);
  }

  put(req: Request, res: Response) {
    const { id } = req.params;
    const blockedUser = blockedUsersDb.getFirst({ id });

    if (!blockedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    blockedUsersDb.update({ id }, req.body);

    const updatedBlockedUser = blockedUsersDb.getFirst({ id });

    return res.json(updatedBlockedUser);
  }

  post(req: Request, res: Response) {
    const newBlockedUser = req.body;

    blockedUsersDb.updateOrInsert(
      { userId: newBlockedUser.userId },
      newBlockedUser
    );

    res.status(200).json(newBlockedUser);
  }
}

export default new BlockedUsersController();
