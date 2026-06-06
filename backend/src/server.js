const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initSchema, query } = require('./shared/db');
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

//여기부터 랜딩페이지 코드입니다
app.get('/api/stats', async (req, res) => {
  try {
    const [hoursResult] = await query('SELECT COALESCE(SUM(duration), 0) as totalHours FROM history');
    const [treesResult] = await query('SELECT COUNT(*) as totalTrees FROM history');
    const [rankers] = await query(`
      SELECT users.nickname, 
             COALESCE(SUM(history.duration), 0) as hours, 
             COUNT(history.id) as trees 
      FROM users 
      LEFT JOIN history ON history.user_id = users.id 
      GROUP BY users.id, users.nickname 
      ORDER BY trees DESC, hours DESC 
      LIMIT 4
    `);

    const dbHours = Math.round(Number(hoursResult[0]?.totalHours || 0) / 60);
    const dbTrees = Number(treesResult[0]?.totalTrees || 0);

    const baseHours = 250;
    const baseTrees = 185;

    const responseHours = dbHours > 0 ? dbHours : baseHours;
    const responseTrees = dbTrees > 0 ? dbTrees : baseTrees;

    const activeRankers = rankers && rankers.some(r => r.trees > 0)
      ? rankers.map((r, i) => ({
          id: i + 1,
          nickname: r.nickname,
          hours: Math.round(Number(r.hours) / 60) || 1,
          trees: Number(r.trees)
        }))
      : [
          { id: 1, nickname: "ik", hours: 142, trees: 210 },
          { id: 2, nickname: "hihi", hours: 128, trees: 185 },
          { id: 3, nickname: "samsung", hours: 115, trees: 160 },
          { id: 4, nickname: "yee~", hours: 98, trees: 142 },
        ];

    res.status(200).json({
      totalHours: responseHours,
      totalTrees: responseTrees,
      topRankers: activeRankers
    });
  } catch (error) {
    console.error('Stats API error:', error);
    res.status(500).json({ message: '통계 데이터를 불러오는 중 오류가 발생했습니다.' });
  }
});

app.post('/api/waitlist', async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ message: '이메일을 입력해주세요.' });
  }

  try {
    await query('INSERT INTO waitlist (email) VALUES (?) ON DUPLICATE KEY UPDATE email=email', [email]);
    console.log(`[DB Insert 성공] 새로운 사전예약 이메일: ${email}`);
    
    res.status(201).json({ 
      success: true, 
      message: '초대장 신청이 완료되었습니다.' 
    });
  } catch (error) {
    res.status(500).json({ message: '이메일 저장 중 오류가 발생했습니다.' });
  }
});

//랜딩페이지 코드 끝

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
      console.log(' Focus Room Backend Server is active!');
      console.log(` Port: http://localhost:${PORT}`);
      console.log('========================================');
    });
  })
  .catch((err) => {
    console.error(' 데이터베이스 초기화 실패:', err);
    process.exit(1);
  });
