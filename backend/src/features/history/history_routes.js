const express = require("express");
const router = express.Router();
const historyController = require("./history_controller");
const authMiddleware = require("../../shared/authMiddleware");

// 모두 JWT 보호 — 세션 기록은 로그인 전용
// GET /api/history — 사용자 세션 목록
router.get("/", authMiddleware, historyController.listHistory);

// POST /api/history — 세션 단건 생성(서버가 id·session_date 부여)
router.post("/", authMiddleware, historyController.createHistory);

// DELETE /api/history/:id — 세션 삭제
router.delete("/:id", authMiddleware, historyController.deleteHistory);

module.exports = router;
