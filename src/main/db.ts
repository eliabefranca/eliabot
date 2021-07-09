import path from 'path';

import { JsonDb } from '../database/json/json-db';
import { BlockedUsers } from '../models/blocked-users';
import { History } from '../models/history';
import { User } from '../models/user';

const dbFolder = path.join(__dirname, '..', '..', 'db');
const historyDbJson = path.join(dbFolder, 'history.json');
const usersDbJson = path.join(dbFolder, 'users.json');
const blockedUsersDbJson = path.join(dbFolder, 'blocked-users.json');

export const usersDb = new JsonDb<User>(usersDbJson);
export const blockedUsersDb = new JsonDb<BlockedUsers>(blockedUsersDbJson);
export const historyDb = new JsonDb<History>(historyDbJson);
