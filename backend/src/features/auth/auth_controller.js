import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as authService from "./auth_service";
import { asyncHandler } from "../../shared/asyncHandler";

export const register = asyncHandler(async (req, res) => {
  const { email, password, nickname } = req.body || {};

  if (!email || !password || !nickname) {
    return res.status(400).json({ message: "모든 필드를 채워주세요." });
  }

  const existing = await authService.findByEmail(email);
  if (existing.length > 0) {
    return res.status(400).json({ message: "이미 가입된 이메일입니다." });
  }

  const salt = await bcrypt.getSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  await authService.createUser({ email, nickname, passwordHash });

  res.status(201).json({ message: "회원가입이 성공적으로 완료되었습니다." });
});

export const login = asyncHandler(async (req, res) => {
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

  const user = user[0];
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
