const pg = require("pg");

const pool = new pg.Pool({
  database: "edspace",
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "toancoder",
});

module.exports = pool;
