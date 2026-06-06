// history feature 요청 처리. SQL은 history.service에 위임.
// 모든 변경 후 사용자의 최신 목록을 반환한다(프론트의 "list 반환 → SET_SESSIONS" 계약과 일치).
const historyService = require("./history.service");
const { asyncHandler } = require("../../shared/asyncHandler");

async function respondList(res, userId, status = 200) {
  const sessions = await historyService.listByUser(userId);
  res.status(status).json({ sessions });
}

exports.listHistory = asyncHandler(async (req, res) => {
  await respondList(res, req.user.id);
});

exports.createHistory = asyncHandler(async (req, res) => {
  const { duration, memo } = req.body || {};
  const minutes = Math.trunc(Number(duration));
  if (!Number.isFinite(minutes) || minutes <= 0) {
    return res
      .status(400)
      .json({ message: "유효한 집중 시간(분)이 필요합니다." });
  }

  await historyService.create(req.user.id, {
    duration: minutes,
    memo: memo ?? null,
  });
  await respondList(res, req.user.id, 201);
});

exports.deleteHistory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const affected = await historyService.deleteOne(userId, id);
  if (affected === 0) {
    return res
      .status(404)
      .json({ message: "삭제할 학습 기록을 찾지 못했습니다." });
  }
  await respondList(res, userId);
});
