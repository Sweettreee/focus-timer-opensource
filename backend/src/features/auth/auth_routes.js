const express = require("express");
const router = express.Router();
const authController = require("./auth_controller");
const authMiddleware = require("../../shared/authMiddleware");

// POST /api/auth/register
router.post("/register", authController.register);

// POST /api/auth/login
router.post("/login", authController.login);

// GET /api/auth/me (JWT) — 토큰의 사용자 정보를 DB에서 조회
router.get("/me", authMiddleware, authController.me);

module.exports = router;
