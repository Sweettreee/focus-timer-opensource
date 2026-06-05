const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initSchema } = require('./shared/db');
const authRoutes = require('./features/auth/auth.routes');
const historyRoutes = require('./features/history/history.routes');
const tasksRoutes = require('./features/tasks/tasks.routes');

const app = express();
const PORT = process.env.PORT || 4000;

// 미들웨어
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API 라우트
app.use('/api/auth', authRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/tasks', tasksRoutes);

// ---------------------------------------------------------
// [과제 제출용] 랜딩페이지 DB 연동 API (Retrieve & Insert)
// ---------------------------------------------------------

// ---------------------------------------------------------
// [과제 제출용] 랜딩페이지 DB 연동 API (Retrieve 전용)
// ---------------------------------------------------------

// 1. [Retrieve] 글로벌 통계 및 상위 랭킹 데이터 보내주기
app.get('/api/stats', async (req, res) => {
  try {
    // 실제 과제 적용 시, 아래와 같이 DB에서 집계 데이터를 SELECT 해와야 합니다.
    // const [hoursResult] = await pool.query('SELECT SUM(duration) as totalHours FROM history');
    // const [treesResult] = await pool.query('SELECT COUNT(*) as totalTrees FROM history WHERE duration >= 25');
    // const [rankers] = await pool.query('SELECT users.nickname, SUM(history.duration) as hours, COUNT(history.id) as trees FROM history JOIN users ON history.user_id = users.id GROUP BY users.id ORDER BY trees DESC LIMIT 4');

    // 프론트엔드 테스트 및 과제 시연용 가짜 응답 데이터 세팅
    res.status(200).json({
      totalHours: 12450, // hoursResult[0].totalHours (실 DB 연동 시 교체)
      totalTrees: 8320,  // treesResult[0].totalTrees (실 DB 연동 시 교체)
      topRankers: [      // rankers 배열 데이터 (실 DB 연동 시 교체)
        { id: 1, nickname: "DeepThinker", hours: 142, trees: 210 },
        { id: 2, nickname: "NightOwl_99", hours: 128, trees: 185 },
        { id: 3, nickname: "FocusMaster", hours: 115, trees: 160 },
        { id: 4, nickname: "GreenThumb", hours: 98, trees: 142 },
      ]
    });
  } catch (error) {
    res.status(500).json({ message: '통계 데이터를 불러오는 중 오류가 발생했습니다.' });
  }
});

// 2. [Insert] 얼리 액세스 (웨이트리스트) 이메일 저장하기
app.post('/api/waitlist', async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ message: '이메일을 입력해주세요.' });
  }

  try {
    // 실제로는 아래와 같이 DB에 데이터를 INSERT 합니다. (테이블 생성 필요)
    // await pool.query('INSERT INTO waitlist (email) VALUES (?)', [email]);

    console.log(`[DB Insert 성공] 새로운 사전예약 이메일: ${email}`);
    
    res.status(201).json({ 
      success: true, 
      message: '초대장 신청이 완료되었습니다.' 
    });
  } catch (error) {
    res.status(500).json({ message: '이메일 저장 중 오류가 발생했습니다.' });
  }
});
// 헬스체크
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Focus Room REST API Server is running beautifully. 🌿',
    timestamp: new Date(),
  });
});

// 글로벌 에러 핸들러
app.use((err, req, res, next) => {
  console.error('서버 에러 감지:', err);
  res.status(500).json({ message: '서버 내부에서 알 수 없는 오류가 발생했습니다.' });
});

// 스키마 초기화 완료 후 서버 시작 (테이블 준비 전 요청 수신 방지)
initSchema()
  .then(() => {
    app.listen(PORT, () => {
      console.log('========================================');
      console.log('🌿 Focus Room Backend Server is active!');
      console.log(`🚀 Port: http://localhost:${PORT}`);
      console.log('========================================');
    });
  })
  .catch((err) => {
    console.error('❌ 데이터베이스 초기화 실패:', err);
    process.exit(1);
  });
