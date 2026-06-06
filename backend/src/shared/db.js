const mysql = require("mysql2/promise");
require("dotenv").config();

let pool;

// DB테이블을 생성하고 커넥션 풀을 준비한다. server.js가 listen 전에 await 한다.
async function initSchema() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });
  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`,
  );
  await connection.end();

  pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      nickname VARCHAR(100) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS history (
      id VARCHAR(255) PRIMARY KEY,
      user_id INT,
      duration INT NOT NULL,
      memo TEXT,
      session_date TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id VARCHAR(255) PRIMARY KEY,
      user_id INT NOT NULL,
      text VARCHAR(500) NOT NULL,
      checked TINYINT(1) NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  console.log("DB shema ready");

  return pool;
}

function query(sql, params) {
  if (!pool)
    throw new Error("DB pool not initialized. Call initSchema() first.");
  return pool.query(sql, params);
}

function getPool() {
  return pool;
}

module.exports = { initSchema, query, getPool };
