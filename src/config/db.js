const { Pool } = require("pg");

if (!global.pool) {
  global.pool = new Pool({
    user: "yourusername",
    host: "localhost",
    database: "farmhub",
    password: "yourpassword",
    port: 5432,
  });
}

module.exports = global.pool;
