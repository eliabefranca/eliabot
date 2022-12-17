import path from 'path';
import { Sequelize } from 'sequelize';
const config = require('./config.json');

let databaseCfg = config.production;
if (process.env.NODE_ENV === 'test') {
  databaseCfg = config.test;
} else if (process.env.NODE_ENV === 'development') {
  databaseCfg = config.development;
}

databaseCfg.storage = path.join(__dirname, '..', '..', databaseCfg.storage);

export const database = new Sequelize(databaseCfg);

console.log('Database connected on mode', process.env.NODE_ENV);
console.log('Database path', databaseCfg.storage);
