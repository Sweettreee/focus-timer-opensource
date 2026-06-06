const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { initSchema } = require("./shared/db");
const authRoutes = require("./features/auth/auth_routes");
const historyRoutes = require("./features/history/history_routes");
const tasksRoutes = require("./features/tasks/tasks_routes");

const app = express();
const PORT = process.env.PORT || 4000;

// 미들웨어
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API 라우트
app.use("/api/auth", authRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/tasks", tasksRoutes);

// 헬스체크
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Focus Room REST API Server is running beautifully. 🌿",
    timestamp: new Date(),
  });
});

// 글로벌 에러 핸들러
app.use((err, req, res, next) => {
  console.error("서버 에러 감지:", err);
  res
    .status(500)
    .json({ message: "서버 내부에서 알 수 없는 오류가 발생했습니다." });
});

// 스키마 초기화 완료 후 서버 시작 (테이블 준비 전 요청 수신 방지)
initSchema()
  .then(() => {
    app.listen(PORT, () => {
      console.log("========================================");
      console.log("🌿 Focus Room Backend Server is active!");
      console.log(`🚀 Port: http://localhost:${PORT}`);
      console.log("========================================");
    });
  })
  .catch((err) => {
    console.error("❌ 데이터베이스 초기화 실패:", err);
    process.exit(1);
  });
