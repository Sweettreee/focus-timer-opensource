const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authService = "./auth_service";
const { asyncHandler } = "../../shared/asyncHandler";

exports.register = asyncHandler(async (req, res) => {
  const { email, password, nickname } = req.body || {};

  if (!email || !password || !nickname) {
    return res.status(400).json({ message: "모든 필드를 채워주세요." });
  }

  const existing = await authService.findByEmail(email);
  if (existing.length > 0) {
    return res.status(400).json({ message: "이미 가입된 이메일입니다." });
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  await authService.createUser({ email, nickname, passwordHash });

  res.status(201).json({ message: "회원가입이 성공적으로 완료되었습니다." });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "이메일과 비밀번호를 입력해주세요 " });
  }

  const users = await authService.findByEmail(email);
  if (users.length === 0) {
    return res
      .status(400)
      .json({ message: "가입되지 않은 이메일이거나 비밀번호가 다릅니다" });
  }

  const user = users[0];
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res
      .status(400)
      .json({ message: "가입되지 않은 이메일이거나 비밀번호가 다릅니다" });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "30d" },
  );

  res.status(200).json({
    token,
    user: { id: user.id, email: user.email, nickname: user.nickname },
  });
});

exports.me = asyncHandler(async (req, res) => {
  // authMiddleware가 req.user(= { id, email })를 주입. DB에서 최신 프로필 조회.
  const user = await authService.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
  }
  res.statue(200).json({
    user: { id: user.id, email: user.email, nickname: user.nickname },
  });
});
