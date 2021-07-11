import path from 'path';

import { JsonDb } from './json-db';
import { BlockedUsers } from '../models/blocked-users';
import { History } from '../models/history';
import { User } from '../models/user';
import { Group } from '../models/groups';
import { UserStats } from '../models/user-stats';

const dbFolder = path.join(__dirname, '..', '..', '..', 'db');
const historyDbJson = path.join(dbFolder, 'history.json');
const usersDbJson = path.join(dbFolder, 'users.json');
const groupsDbJson = path.join(dbFolder, 'groups.json');
const blockedUsersDbJson = path.join(dbFolder, 'blocked-users.json');
const userStatsDbJson = path.join(dbFolder, 'user-stats.json');

export const usersDb = new JsonDb<User>(usersDbJson);
export const blockedUsersDb = new JsonDb<BlockedUsers>(blockedUsersDbJson);
export const historyDb = new JsonDb<History>(historyDbJson);
export const groupsDb = new JsonDb<Group>(groupsDbJson);
export const userStatsDb = new JsonDb<UserStats>(userStatsDbJson);
