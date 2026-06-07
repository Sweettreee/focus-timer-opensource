const express = require("express");
const router = express.Router();

const historyController = require("./history_controller");
const authMiddleware = require("../../shared/authMiddleware");

// POST 요청 처리
router.post("/sync", authMiddleware, historyController.syncHistory);

// DELETE 요청 처리
router.delete("/:id", authMiddleware, historyController.deleteHistory);

module.exports = router;
