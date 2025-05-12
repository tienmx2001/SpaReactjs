const sql = require('mssql');
require('dotenv').config();

const config = {
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER, // <-- đã có \SQLEXPRESS trong env
    database: process.env.DB_DATABASE,
    options: {
      encrypt: false, // local dev
      trustServerCertificate: true,
    },
    port: parseInt(process.env.DB_PORT), // optional cho named instance, vẫn nên để
  };
  

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('✅ Connected to SQL Server');
    return pool;
  })
  .catch(err => {
    console.error('❌ Database Connection Failed! :', err);
    throw err;
  });

module.exports = { sql, poolPromise };
