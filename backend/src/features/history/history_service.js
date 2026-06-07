const db = require('../../shared/db');

async function upsertMany(userId, sessions) {
  for (const s of sessions) {

    if (s == null || s.id == null) continue;

    const raw = s.session_date ?? s.timestamp;
    const date = raw ? new Date(raw) : new Date();
    if (Number.isNaN(date.getTime())) continue;

    const minutes = Math.trunc(Number(s.duration ?? s.minutes ?? 0)) || 0;
    const memo = s.memo ?? s.label ?? null;

    await db.query(
      'INSERT IGNORE INTO history (id, user_id, duration, memo, session_date) VALUES (?, ?, ?, ?, ?)',
      [String(s.id), userId, minutes, memo, date]
    );
  }
}

async function listByUser(userId) {
  const [rows] = await db.query(
    'SELECT id, duration AS minutes, memo, session_date AS timestamp FROM history WHERE user_id = ? ORDER BY session_date DESC',
    [userId]
  );
  return rows;
}

async function deleteOne(userId, id) {
  const [result] = await db.query(
    'DELETE FROM history WHERE id = ? AND user_id = ?',
    [id, userId]
  );
  return result.affectedRows;
}

module.exports = { upsertMany, listByUser, deleteOne };
