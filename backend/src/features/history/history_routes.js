const express = require("express");
const router = express.Router();

const historyController = require("./history_controller");
const authMiddleware = require("../../shared/authMiddleware");

// GET /api/history — 로그인 사용자의 세션 목록 조회
router.get("/", authMiddleware, historyController.listHistory);

// POST /api/history — 세션 1건 저장 후 최신 목록 반환
router.post("/", authMiddleware, historyController.createHistory);

// DELETE /api/history/:id — 세션 삭제 후 최신 목록 반환
router.delete("/:id", authMiddleware, historyController.deleteHistory);

module.exports = router;
