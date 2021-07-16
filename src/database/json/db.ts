import path from 'path';

import { JsonDb } from './json-db';
import { BlockedUsers } from '../models/blocked-users';
import { BlockedGroups } from '../models/blocked-groups';
import { History } from '../models/history';
import { User } from '../models/user';
import { Group } from '../models/groups';
import { UserStats } from '../models/user-stats';
import { CONFIG } from '../../../config';

const dbFolder = path.join(CONFIG.dbFolder);
const historyDbJson = path.join(dbFolder, 'history.json');
const usersDbJson = path.join(dbFolder, 'users.json');
const groupsDbJson = path.join(dbFolder, 'groups.json');
const blockedUsersDbJson = path.join(dbFolder, 'blocked-users.json');
const blockedGroupsDbJson = path.join(dbFolder, 'blocked-groups.json');
const userStatsDbJson = path.join(dbFolder, 'user-stats.json');

export const usersDb = new JsonDb<User>(usersDbJson);
export const blockedUsersDb = new JsonDb<BlockedUsers>(blockedUsersDbJson);
export const blockedGroupsDb = new JsonDb<BlockedGroups>(blockedGroupsDbJson);
export const historyDb = new JsonDb<History>(historyDbJson);
export const groupsDb = new JsonDb<Group>(groupsDbJson);
export const userStatsDb = new JsonDb<UserStats>(userStatsDbJson);
