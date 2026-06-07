//사용자 신원 확인 미들웨어(마이페이지등 보호하기위함)
const jwt = require('jsonwebtoken');

// Authorization: Bearer <Token> 검증 후 req.user 주입.
module.exports = (req, res, next) => {
    //HTTP요청 헤더에서 authorization값 가져옴
  const authHeader = req.headers['authorization'];
  //토큰만 추출
  const token = authHeader && authHeader.split(' ')[1];
    //토큰 없으면 에러 반환(다음 단계로 가지 못하게)
  if (!token) {
    return res.status(401).json({ message: '인증 토큰이 누락되었습니다. 접근 권한이 없습니다.' });
  }

  try {
    //서버에서 토큰을 검증
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // req.user.id, req.user.email
    next();
  } catch (error) {
    //토큰이 위조되었거나 만료되었다면 403에러 반환
    console.error('JWT 검증 오류:', error);
    return res.status(403).json({ message: '유효하지 않거나 만료된 토큰입니다.' });
  }
};
