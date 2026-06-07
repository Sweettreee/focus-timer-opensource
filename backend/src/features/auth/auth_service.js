// auth feature 데이터 접근(users 테이블).
const db = require("../../shared/db");

async function findByEmail(email) {
  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows;
}

async function findById(id) {
  const [rows] = await db.query(
    "SELECT id, email, nickname FROM users WHERE id = ?",
    [id],
  );
  return rows[0] || null;
}

async function createUser({ email, nickname, passwordHash }) {
  await db.query(
    "INSERT INTO users (email, password, nickname) VALUES (?, ?, ?)",
    [email, passwordHash, nickname],
  );
}

module.exports = { findByEmail, findById, createUser };
