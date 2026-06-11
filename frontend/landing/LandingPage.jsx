import React, { useState, useEffect } from 'react';
import {
  BrainCircuit,
  Sprout,
  Headphones,
  ChevronRight,
  Users,
  Trophy,
  Medal,
  Crown
} from 'lucide-react';
import { useUser } from '../app/selectors';
import { useAuthController } from '../features/auth/useAuthController';
import { useNavController } from '../app/useNavController';

export default function LandingPage() {
  const { goTo } = useNavController();
  const user = useUser();
  const { logout } = useAuthController();

  const [isVisible, setIsVisible] = useState(false);

  // API 호출 실패 시 표시할 백업 데이터
  const [globalStats, setGlobalStats] = useState({
    totalHours: 12450,
    totalTrees: 8320,
  });

  const [rankings, setRankings] = useState([
    { id: 1, nickname: '초집중모드', hours: 142, trees: 210 },
    { id: 2, nickname: '밤샘코딩', hours: 128, trees: 185 },
    { id: 3, nickname: '이동욱', hours: 115, trees: 160 },
    { id: 4, nickname: 'test1234', hours: 98, trees: 142 },
  ]);

  // 실시간 통계 및 랭킹 로드
  useEffect(() => {
    setIsVisible(true);

    fetch('http://localhost:4000/api/stats')
      .then((res) => {
        if (!res.ok) throw new Error('서버 응답 오류');
        return res.json();
      })
      .then((data) => {
        if (data.totalHours && data.totalTrees) {
          setGlobalStats({
            totalHours: data.totalHours,
            totalTrees: data.totalTrees,
          });
        }
        if (data.topRankers) {
          setRankings(data.topRankers);
        }
      })
      .catch((err) => {
        console.warn('실시간 데이터를 불러오지 못했습니다. 로컬 데이터로 대체합니다.', err);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#333333] flex flex-col font-sans">
      <main className="flex-1">

        {/* 비주얼 영역 */}
        <section
          className={`relative overflow-hidden flex flex-col items-center min-h-[550px] md:min-h-[680px] transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
            }`}
        >
          {/* 배경 동영상 */}
          <video
            src="/forest_movie.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover scale-[1.3] z-0"
          />

          {/*어두운 오버레이 */}
          <div className="absolute inset-0 bg-black/45 backdrop-blur-[0.5px] z-10" />

          {/* 상단 네비바 */}
          <header className="relative z-20 flex justify-between items-center w-full py-5 px-8">
            <div
              className="flex flex-col items-start cursor-pointer hover:opacity-85 select-none text-white"
              onClick={() => goTo('focus')}
            >
              <h1 className="text-2xl font-bold tracking-wider">FOCUS ROOM</h1>
              <p className="text-[10px] text-white/60 uppercase tracking-widest mt-0.5">
                your time, your growth
              </p>
            </div>

            {/* 로그인 / 회원 정보 메뉴 */}
            <div className="flex items-center gap-2">
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-white text-xs font-semibold select-none">
                    {user.nickname}님
                  </span>
                  <button
                    onClick={logout}
                    className="px-3 py-1.5 text-[10px] font-bold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all cursor-pointer"
                  >
                    로그아웃
                  </button>
                  <button
                    onClick={() => goTo('focus')}
                    className="px-4 py-1.5 text-[10px] font-bold text-white bg-[#6B8E23] hover:bg-[#5A7A1D] rounded-xl shadow transition-all cursor-pointer"
                  >
                    Go to App
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => goTo('login')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-semibold tracking-wide cursor-pointer transition-all"
                  >
                    로그인
                  </button>
                  <button
                    onClick={() => goTo('register')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white text-gray-900 hover:bg-gray-100 rounded-xl text-xs font-semibold tracking-wide cursor-pointer transition-all shadow-sm"
                  >
                    회원가입
                  </button>
                </div>
              )}
            </div>
          </header>

          {/* 슬로건 및 시작 버튼 */}
          <div className="relative z-20 flex-1 flex flex-col items-center justify-center text-center px-6 py-16 max-w-2xl">
            <h1 className="font-serif font-bold text-white text-4xl md:text-6xl leading-tight mb-6 tracking-wide select-none drop-shadow-md">
              당신의 몰입이 <br /> 한 그루의 나무가 되는 시간
            </h1>

            <p className="text-white/85 max-w-xl text-sm md:text-base leading-relaxed mb-8 font-medium select-none drop-shadow-sm">
              FOCUS ROOM은 당신의 집중을 시각화합니다. <br />
              AI 비전 어시스턴트의 모니터링과 고요한 앰비언트 사운드 속에서,
              나만의 소중한 시간을 나무로 키워보세요.
            </p>

            <button
              onClick={() => goTo('focus')}
              className="flex items-center gap-2 px-8 py-4 bg-[#6B8E23] hover:bg-[#5A7A1D] active:scale-[0.97] text-white text-xs font-bold uppercase rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              Start Focusing <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* 주요 기능 소개 */}
        <section className="bg-white/50 border-y border-gray-200 py-16 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

            <div className="flex flex-col items-center text-center p-6 bg-white/60 rounded-xl border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-[#D8C9A8]/30 flex items-center justify-center text-[#7A6A4A] mb-3">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#4A5D4E] mb-2">
                AI Vision Assistant
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                AI 기술로 자리비움을 감지합니다. 자리를 비우면 타이머가
                일시정지되고, 돌아오면 몰입을 이어갈 수 있습니다.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-white/60 rounded-xl border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-[#6B8E23]/20 flex items-center justify-center text-[#4A5D4E] mb-3">
                <Sprout className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#4A5D4E] mb-2">
                Visual Growth
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                설정한 목표 시간에 맞춰 씨앗이 나무로 성장하는 타임랩스를 볼 수
                있습니다. 집중의 결과를 눈으로 확인해 보세요.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-white/60 rounded-xl border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 mb-3">
                <Headphones className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#4A5D4E] mb-2">
                Ambient Soundscapes
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                백색소음, 숲의 바람 소리, 빗소리 등을 직접 믹싱하여 나에게 가장
                잘 맞는 최적의 집중 환경을 커스텀합니다.
              </p>
            </div>

          </div>
        </section>

        {/* 통계 및 랭킹 대시보드 */}
        <section className="py-16 px-6 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

            {/* 글로벌 통계 */}
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-1.5 mb-2 text-[#6B8E23]">
                <Users className="w-4 h-4" />
                <span className="text-xs font-bold">Global Stats</span>
              </div>
              <h2 className="text-2xl font-bold text-[#4A5D4E] mb-3">
                이미 많은 유저들이 <br /> 자신만의 숲을 만들고 있습니다.
              </h2>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                Focus Room에서 다른 사람들과 함께 집중 시간을 공유하고
                모니터링할 수 있습니다. 이번 달 가장 깊게 몰입한 탑 랭커에
                도전해 보세요.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 p-4 rounded-lg">
                  <p className="text-[10px] text-gray-400 font-bold mb-1">
                    총 집중 시간
                  </p>
                  <p className="text-xl text-[#4A5D4E] font-bold">
                    {globalStats.totalHours.toLocaleString()}{' '}
                    <span className="text-xs text-gray-400 font-normal">
                      hrs
                    </span>
                  </p>
                </div>

                <div className="bg-[#6B8E23]/10 border border-[#6B8E23]/20 p-4 rounded-lg">
                  <p className="text-[10px] text-[#6B8E23] font-bold mb-1">
                    심은 나무 수
                  </p>
                  <p className="text-xl text-[#6B8E23] font-bold">
                    {globalStats.totalTrees.toLocaleString()}{' '}
                    <span className="text-xs text-[#6B8E23]/70 font-normal">
                      trees
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* 랭킹 보드 */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
                <div>
                  <h3 className="text-base font-bold text-[#4A5D4E]">
                    Hall of Focus
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    이번 달 가장 많은 나무를 피워낸 포커서
                  </p>
                </div>
                <Trophy className="w-5 h-5 text-amber-500" />
              </div>

              <div className="flex flex-col gap-2">
                {rankings.length > 0 ? (
                  rankings.map((ranker, index) => (
                    <div
                      key={ranker.id}
                      className="flex items-center justify-between p-3 bg-[#F9F6F0] rounded-lg border border-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 flex items-center justify-center shrink-0">
                          {index === 0 ? (
                            <Crown className="w-4 h-4 text-amber-500" />
                          ) : index === 1 ? (
                            <Medal className="w-4 h-4 text-gray-400" />
                          ) : index === 2 ? (
                            <Medal className="w-4 h-4 text-amber-700" />
                          ) : (
                            <span className="text-xs text-gray-400 font-bold">
                              {index + 1}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-800">
                            {ranker.nickname}
                          </p>
                          <p className="text-[10px] text-gray-500">
                            {ranker.hours} hrs
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[#6B8E23] font-bold">
                        <Sprout className="w-3.5 h-3.5" />
                        {ranker.trees}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-center text-gray-400 py-4">
                    랭킹 데이터가 없습니다.
                  </p>
                )}
              </div>
            </div>

          </div>
        </section>
      </main>

      <footer className="text-center py-6 border-t border-gray-200 text-[10px] text-gray-400">
        © 2026 FOCUS ROOM. Designed by Team Search (LeeDongWook, JangIkJoon, KimJinSik).
      </footer>
    </div>
  );
}
