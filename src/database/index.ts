import path from 'path';
import { Sequelize } from 'sequelize';
const config = require('./config.json');

let databaseCfg = config.production;
if (process.env.NODE_ENV === 'development') {
  databaseCfg = config.development;
}

databaseCfg.storage = path.join(__dirname, '..', '..', databaseCfg.storage);

export const database =
  process.env.NODE_ENV === 'test'
    ? new Sequelize('sqlite::memory:', config.test)
    : new Sequelize(databaseCfg);

if (process.env.NODE_ENV !== 'test') {
  console.log('Database connected on mode', process.env.NODE_ENV);
  console.log('Database path', databaseCfg.storage);
}
