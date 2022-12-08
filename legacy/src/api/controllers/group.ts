import { Request, Response } from 'express';

import { groupsDb } from '@json-db';

class GroupController {
  get(req: Request, res: Response) {
    const { id } = req.params;
    const group = groupsDb.getFirst({ id });

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    return res.json(group);
  }

  getAll(req: Request, res: Response) {
    const users = groupsDb.getData();

    return res.json(users);
  }
}

export default new GroupController();
