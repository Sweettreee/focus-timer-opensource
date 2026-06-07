const { randomUUID } = require('crypto');
const db = require('../../shared/db');

// 프론트 정본(canonical) 형태와 일치: { id, duration(분), memo, session_date }
async function listByUser(userId) {
  const [rows] = await db.query(
    'SELECT id, duration, memo, session_date FROM history WHERE user_id = ? ORDER BY session_date DESC',
    [userId]
  );
  return rows;
}

async function createOne(userId, { duration, memo }) {
  const id = randomUUID();
  await db.query(
    'INSERT INTO history (id, user_id, duration, memo, session_date) VALUES (?, ?, ?, ?, ?)',
    [id, userId, Math.trunc(Number(duration)) || 0, memo ?? null, new Date()]
  );
  return id;
}

async function deleteOne(userId, id) {
  const [result] = await db.query(
    'DELETE FROM history WHERE id = ? AND user_id = ?',
    [id, userId]
  );
  return result.affectedRows;
}

module.exports = { listByUser, createOne, deleteOne };
