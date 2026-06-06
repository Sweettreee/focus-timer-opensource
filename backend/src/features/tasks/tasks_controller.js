// tasks feature 요청 처리. 모든 변경 후 사용자의 최신 목록을 반환한다.
const tasksService = require("./tasks.service");
const { asyncHandler } = require("../../shared/asyncHandler");

async function respondList(res, userId, status = 200) {
  const tasks = await tasksService.listByUser(userId);
  res.status(status).json({ tasks });
}

exports.list = asyncHandler(async (req, res) => {
  await respondList(res, req.user.id);
});

exports.create = asyncHandler(async (req, res) => {
  const { text } = req.body || {};
  if (!text || !text.trim()) {
    return res.status(400).json({ message: "할 일 내용을 입력해주세요." });
  }
  await tasksService.create(req.user.id, text.trim());
  await respondList(res, req.user.id, 201);
});

exports.toggle = asyncHandler(async (req, res) => {
  await tasksService.toggle(req.user.id, req.params.id);
  await respondList(res, req.user.id);
});

exports.remove = asyncHandler(async (req, res) => {
  await tasksService.remove(req.user.id, req.params.id);
  await respondList(res, req.user.id);
});
