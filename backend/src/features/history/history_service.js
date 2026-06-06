// history feature 데이터 접근(history 테이블).
const { randomUUID } = require("crypto");
const db = require("../../shared/db");

// 단건 생성. id는 서버가 부여(UUID), session_date는 NOW().
async function create(userId, { duration, memo }) {
  const id = randomUUID();
  await db.query(
    "INSERT INTO history (id, user_id, duration, memo, session_date) VALUES (?, ?, ?, ?, NOW())",
    [id, userId, duration, memo ?? null],
  );
  return id;
}

// 최신순 정렬. 컬럼명을 프론트 정본({ id, duration, session_date, memo })과 그대로 일치시킨다.
async function listByUser(userId) {
  const [rows] = await db.query(
    "SELECT id, duration, memo, session_date FROM history WHERE user_id = ? ORDER BY session_date DESC",
    [userId],
  );
  return rows;
}

async function deleteOne(userId, id) {
  const [result] = await db.query(
    "DELETE FROM history WHERE id = ? AND user_id = ?",
    [id, userId],
  );
  return result.affectedRows;
}

module.exports = { create, listByUser, deleteOne };
