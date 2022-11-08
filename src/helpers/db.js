const {Pool} = require("pg");

const db = new Pool({
  connectionString: "postgresql://postgres:Posrgres!123@db.wcetkwnsasmhnzwhjixf.supabase.co:5432/postgres?schema=public"
});

module.exports = db;
