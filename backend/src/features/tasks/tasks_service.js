// tasks feature 데이터 접근(tasks 테이블).
const { randomUUID } = require("crypto");
const db = require("../../shared/db");

async function listByUser(userId) {
  const [rows] = await db.query(
    "SELECT id, text, checked FROM tasks WHERE user_id = ? ORDER BY created_at ASC",
    [userId],
  );
  return rows;
}

async function create(userId, text) {
  const id = randomUUID();
  await db.query(
    "INSERT INTO tasks (id, user_id, text, checked) VALUES (?, ?, ?, 0)",
    [id, userId, text],
  );
  return id;
}

async function toggle(userId, id) {
  await db.query(
    "UPDATE tasks SET checked = 1 - checked WHERE id = ? AND user_id = ?",
    [id, userId],
  );
}

async function remove(userId, id) {
  await db.query("DELETE FROM tasks WHERE id = ? AND user_id = ?", [
    id,
    userId,
  ]);
}

module.exports = { listByUser, create, toggle, remove };
