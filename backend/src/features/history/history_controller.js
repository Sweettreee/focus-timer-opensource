const historyService = require("./history_service");
const { asyncHandler } = require("../../shared/asyncHandler");

exports.syncHistory = asyncHandler(async (req, res) => {
  const { sessions } = req.body || {};
  const userId = req.user.id;

  if (!sessions || !Array.isArray(sessions)) {
    return res
      .status(400)
      .json({ message: "동기화할 세션 데이터가 없습니다." });
  }

  await historyService.upsertMany(userId, sessions);
  const rows = await historyService.listByUser(userId);

  //데이터 변환시키기
  const history = rows.map((row) => ({
    id: row.id,
    minutes: row.minutes,
    memo: row.memo,
    timestamp: new Date(row.timestamp).getTime(),
  }));

  res.status(200).json({
    message: "학습 기록이 데이터베이스와 성공적으로 동기화되었습니다.",
    history,
  });
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
  res.status(200).json({ message: "학습 기록이 성공적으로 삭제되었습니다." });
});
