// 비동기 컨트롤러의 예외를 글로벌 에러 핸들러(server.js)로 위임하는 래퍼.
// 컨트롤러마다 반복되던 try/catch + 500 응답을 한곳으로 모은다.
function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

module.exports = { asyncHandler };
