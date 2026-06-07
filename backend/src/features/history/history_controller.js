const historyService = require("./history_service");
const { asyncHandler } = require("../../shared/asyncHandler");

// 모든 변경 후 사용자의 최신 세션 목록을 { sessions }로 반환한다(tasks 컨트롤러와 동일 계약).
async function respondList(res, userId, status = 200) {
  const sessions = await historyService.listByUser(userId);
  res.status(status).json({ sessions });
}

exports.listHistory = asyncHandler(async (req, res) => {
  await respondList(res, req.user.id);
});

exports.createHistory = asyncHandler(async (req, res) => {
  const { duration, memo } = req.body || {};
  if (duration == null || Number.isNaN(Number(duration))) {
    return res.status(400).json({ message: "유효한 집중 시간이 필요합니다." });
  }
  await historyService.createOne(req.user.id, { duration, memo });
  await respondList(res, req.user.id, 201);
});

exports.deleteHistory = asyncHandler(async (req, res) => {
  const affected = await historyService.deleteOne(req.user.id, req.params.id);
  if (affected === 0) {
    return res
      .status(404)
      .json({ message: "삭제할 학습 기록을 찾지 못했습니다." });
  }
  await respondList(res, req.user.id);
});
