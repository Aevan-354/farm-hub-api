require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.PG_LOCAL_USER,
  host: process.env.PG_LOCAL_HOST,
  database: process.env.PG_LOCAL_DATABASE,
  password: process.env.PG_LOCAL_PASSWORD,
  port: process.env.PG_LOCAL_PORT,
});


module.exports = pool;
