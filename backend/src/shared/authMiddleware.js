const jwt = require("jsonwebtoken");

// Authorization: Bearer <Token> 검증 후 req.user 주입.
module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "인증 토큰이 누락되었습니다. 접근 권한이 없습니다." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // req.user.id, req.user.email
    next();
  } catch (error) {
    console.error("JWT 검증 오류:", error);
    return res
      .status(403)
      .json({ message: "유효하지 않거나 만료된 토큰입니다." });
  }
};
