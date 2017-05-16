// This file doesn't run with babel, so we don't get import/export
const dotenv = require('dotenv')

const envFromRealEnvironment = process.env.NODE_ENV || 'development';
const path = `.env.${ envFromRealEnvironment }`;

dotenv.config({ path, silent: envFromRealEnvironment === 'production' });

module.exports = process.env.DATABASE_URL
