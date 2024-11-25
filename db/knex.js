import knexConfig from '../knexfile.js';
import knex from 'knex';

const db = knex(knexConfig.development);

export default db;