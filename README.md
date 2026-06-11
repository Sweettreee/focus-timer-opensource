Focus Room 

웹캠 기반의 실시간 자리비움 감지 타이머와 앰비언트 사운드 믹서가 결합된 웹 포모토로 타이머입니다. 설정한 시간 동안 집중하면 씨앗이 나무로 자라나 시각적 성취감을 주며, 투두 리스트를 통해 할 일을 기록하고 히스토리를 통해 나의 노력을 추적합니다.

기술 스택

Frontend

Framework & Build: React 18, Vite, Tailwind CSS

AI Vision: MediaPipe Tasks Vision (blaze_face_short_range 모델 사용)

State & Router: Custom Navigation Controller, Context API 기반 전역 상태 관리

Icons: Lucide React

Backend

Framework: Node.js, Express

Database: MySQL (mysql2 드라이버를 활용한 커넥션 풀링)

Security: JWT (JsonWebToken), bcryptjs (비밀번호 암호화 및 검증)

주요 기능 및 구현 특징

1. 웹캠 기반 온디바이스(On-Device) 자리비움 감지

서버로 비디오 스트림을 전송하지 않고 사용자의 브라우저에서 MediaPipe BlazeFace 모델을 직접 구동합니다.

프레임 단위로 얼굴을 감지하여 사용자가 자리를 비우면 타이머를 일시정지하고, 복귀하면 자동으로 타이머를 재개합니다. (기본 1.5초 감지 딜레이 적용으로 오작동 방지)

하단 토글을 통해 웹캠 기능을 완전히 끄고 일반 타이머 모드로도 사용할 수 있습니다.

2. 식물 성장 시각화 및 세션 기록

설정 시간(2분, 25분, 50분 등)의 진행도 비율에 맞춰 화면 내 식물 에셋이 성장하도록 시각화되어 있습니다.

(2분은 개발자의 작동 확인용으로 개발되었습니다. 실제 출시시 제거할 예정)

세션이 종료되면 간단한 한 줄 메모를 기록하여 DB에 누적 적재할 수 있습니다. 1분 미만의 세션은 유효하지 않은 집중 시간으로 판단하여 기록에서 자동으로 필터링합니다.

3. 실시간 웹 오디오 앰비언트 믹서

Web Audio API 기반의 오디오 인스턴스를 통해 자연음 소스(빗소리, 바람, 수중음, 백색소음)를 재생합니다.

개별 사운드의 볼륨 슬라이더 조절 및 프리셋(Deep Focus, Ocean Breeze 등)을 지원하여 나만의 몰입 사운드 환경을 구성할 수 있습니다.

4. 대시보드 및 실시간 랭킹 보드

전체 사용자의 누적 집중 시간과 완료된 총 세션 수(나무 개수)를 메인 대시보드에 시각화합니다.

상위 몰입 유저 4명의 닉네임과 누적 기록을 집계해 실시간 랭킹 보드를 제공함으로써 자발적인 동기부여를 제공합니다.

로컬 실행 방법

1. 환경 변수 설정

backend/ 폴더 아래에 .env 파일을 생성하고 데이터베이스 및 토큰 정보를 입력합니다. (서버 시작 시 데이터베이스 스키마와 테이블은 자동으로 생성 및 초기화됩니다.)

PORT=4000
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=focus_room
JWT_SECRET=your_jwt_secret_key


2. 패키지 설치 및 실행

루트 디렉토리에서 아래 명령어를 실행하여 프론트엔드와 백엔드의 패키지를 한번에 세팅하고 동시 구동할 수 있습니다.

# 전체 의존성 패키지 설치
npm install

# 백엔드 의존성 별도 설치
cd backend && npm install && cd ..

# 개발 서버 동시에 실행
# 프론트엔드: http://localhost:5173 / 백엔드: http://localhost:4000
npm run dev


프로젝트 폴더 구조

├── backend/                  # Express 백엔드 서버 구동 영역
│   ├── src/
│   │   ├── features/         # 기능별 엔드포인트 분리 (auth, history, tasks)
│   │   ├── shared/           # 공통 DB 연결 모듈, 미들웨어 (auth, async 처리)
│   │   └── server.js         # REST API 메인 엔트리 및 통계/랭킹용 API
│   └── package.json
│
├── frontend/                 # React SPA 클라이언트 영역
│   ├── app/                  # 레이아웃 구성 및 라우터 대체용 Navigation Controller
│   ├── features/             # 도메인 기반 컴포넌트 설계
│   │   ├── ambient/          # 앰비언트 사운드 믹서 컴포넌트 및 신디사이저 모듈
│   │   ├── auth/             # 인증 페이지 및 토큰 저장소 관리
│   │   ├── history/          # 누적 기록 렌더링 카드 및 통계 페이지
│   │   ├── tasks/            # 할 일(Todo) 관리
│   │   └── timer/            # 메인 타이머, 캔버스 렌더링 및 MediaPipe 카메라 연동
│   └── landing/              # 메인 랜딩 및 실시간 랭킹 보드 대시보드
│
├── package.json             
└── README.md
