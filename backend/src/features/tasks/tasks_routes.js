const express = require("express");
const router = express.Router();
const tasksController = require("./tasks.controller");
const authMiddleware = require("../../shared/authMiddleware");

// 모두 JWT 보호
router.get("/", authMiddleware, tasksController.list);
router.post("/", authMiddleware, tasksController.create);
router.patch("/:id/toggle", authMiddleware, tasksController.toggle);
router.delete("/:id", authMiddleware, tasksController.remove);

module.exports = router;
