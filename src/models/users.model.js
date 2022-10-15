const db = require("../helpers/db");

const table = "users";

exports.insertUser = (data) => {
  const sql = `INSERT INTO ${table} ("email", "password") VALUES ($1, $2) RETURNING *`;
  const params = [data.email, data.password];
  return db.query(sql, params);
};
