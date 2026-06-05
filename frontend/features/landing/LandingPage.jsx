import React, { useState, useEffect } from 'react';
import { BrainCircuit, Sprout, Headphones, ChevronRight, Users, Trophy, Medal, Crown } from 'lucide-react';
import Header from '../../app/layout/Header';
import { useNavController } from '../../app/useNavController';

export default function LandingPage() {
  const { goTo } = useNavController();
  const [isVisible, setIsVisible] = useState(false);

  // DB 연동(Retrieve) 가짜 데이터 상태 (실제로는 useEffect에서 fetch)
  const [globalStats, setGlobalStats] = useState({ totalHours: 12450, totalTrees: 8320 });
  const [rankings, setRankings] = useState([
    { id: 1, nickname: "DeepThinker", hours: 142, trees: 210 },
    { id: 2, nickname: "NightOwl_99", hours: 128, trees: 185 },
    { id: 3, nickname: "FocusMaster", hours: 115, trees: 160 },
    { id: 4, nickname: "GreenThumb", hours: 98, trees: 142 },
  ]);

  // 마운트 시 부드러운 페이드인 애니메이션 트리거
  useEffect(() => {
    setIsVisible(true);
    
    // TODO: 실제 과제 제출 시에는 아래처럼 백엔드 API를 호출해서 데이터를 세팅하세요!
    /*
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        setGlobalStats({ totalHours: data.totalHours, totalTrees: data.totalTrees });
        setRankings(data.topRankers);
      });
    */
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#333333] flex flex-col font-sans selection:bg-[#6B8E23]/20 overflow-x-hidden">
      
      {/* 글로벌 네비게이션 헤더 */}
      <div className="px-6 pt-5">
        <Header currentView="landing" />
      </div>

      <main className="flex-1 flex flex-col">
        {/* 1. Hero Section (메인 타이틀) */}
        <section className={`flex flex-col items-center justify-center text-center px-6 py-24 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="w-16 h-16 rounded-full bg-[#6B8E23]/10 flex items-center justify-center text-[#6B8E23] mb-8">
            <Sprout className="w-8 h-8 animate-soft-pulse" />
          </div>
          <h1 className="font-serif italic text-5xl md:text-7xl text-[#4A5D4E] leading-tight mb-6 tracking-tight">
            The quiet you cultivate now <br /> becomes the life you build.
          </h1>
          <p className="text-gray-500 max-w-2xl text-sm md:text-base leading-relaxed mb-10">
            FOCUS ROOM은 당신의 몰입을 시각화합니다. 
            스마트 AI 비전 어시스턴트와 고요한 앰비언트 사운드, 그리고 당신의 시간에 맞춰 씨앗에서 나무로 자라나는 반려 식물과 함께 가장 깊은 집중의 상태로 들어가보세요.
          </p>
          <button 
            onClick={() => goTo('focus')}
            className="group relative px-8 py-4 bg-[#4A5D4E] hover:bg-[#3d4d41] text-white text-sm font-bold tracking-widest uppercase rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Start Focusing <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </section>

        {/* 2. Features Section (핵심 기능 3가지) */}
        <section className="bg-white/40 border-y border-gray-200/50 py-20 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="group flex flex-col items-center text-center p-6 rounded-2xl hover:bg-white/80 transition-all duration-500">
              <div className="w-12 h-12 rounded-full bg-[#D8C9A8]/30 flex items-center justify-center text-[#7A6A4A] mb-6 group-hover:scale-110 transition-transform duration-500">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl text-[#4A5D4E] mb-3">AI Vision Assistant</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                온디바이스 AI 기술로 자리를 감지합니다. 자리를 비우면 일시정지되고, 돌아오면 부드럽게 몰입을 이어갑니다.
              </p>
            </div>

            <div className="group flex flex-col items-center text-center p-6 rounded-2xl hover:bg-white/80 transition-all duration-500">
              <div className="w-12 h-12 rounded-full bg-[#6B8E23]/20 flex items-center justify-center text-[#4A5D4E] mb-6 group-hover:scale-110 transition-transform duration-500">
                <Sprout className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl text-[#4A5D4E] mb-3">Visual Growth</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                목표 시간에 맞춰 씨앗이 나무로 성장하는 타임랩스 영상을 제공합니다. 몰입의 결실을 눈으로 확인하세요.
              </p>
            </div>

            <div className="group flex flex-col items-center text-center p-6 rounded-2xl hover:bg-white/80 transition-all duration-500">
              <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 mb-6 group-hover:scale-110 transition-transform duration-500">
                <Headphones className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl text-[#4A5D4E] mb-3">Ambient Soundscapes</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                백색소음, 숲의 바람, 빗소리를 직접 믹싱하세요. 당신만의 완벽한 포커스 환경을 커스텀할 수 있습니다.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Global Stats & Ranking Section (DB Retrieve 요건 충족) */}
        <section className="py-24 px-6 mb-10">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* 좌측: 누적 통계 */}
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4 text-[#6B8E23]">
                <Users className="w-5 h-5" />
                <h3 className="text-sm font-bold uppercase tracking-widest">Global Impact</h3>
              </div>
              <h2 className="font-serif text-3xl md:text-5xl text-[#4A5D4E] mb-6 leading-tight">
                Join thousands of focusers <br/> building their forest.
              </h2>
              <p className="text-sm text-gray-500 mb-10 leading-relaxed">
                전 세계의 수많은 사람들이 이미 Focus Room과 함께 자신만의 고요한 시간을 가꾸고 있습니다. 가장 깊이 몰입한 탑 랭커들에 도전해보세요.
              </p>

              {/* 통계 카드 */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/60 backdrop-blur-sm border border-gray-200/60 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
                  <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-2">Total Focus Time</p>
                  <p className="font-mono text-3xl text-[#4A5D4E] font-semibold">
                    {globalStats.totalHours.toLocaleString()}
                    <span className="text-lg text-gray-400 ml-1">hrs</span>
                  </p>
                </div>
                <div className="bg-[#6B8E23]/10 border border-[#6B8E23]/20 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
                  <p className="text-[10px] text-[#6B8E23] font-bold tracking-widest uppercase mb-2">Trees Grown</p>
                  <p className="font-mono text-3xl text-[#6B8E23] font-semibold">
                    {globalStats.totalTrees.toLocaleString()}
                    <span className="text-lg text-[#6B8E23]/60 ml-1">trees</span>
                  </p>
                </div>
              </div>
            </div>

            {/* 우측: 랭킹 보드 (Leaderboard) */}
            <div className="bg-white/80 p-8 rounded-3xl shadow-lg border border-gray-100 relative">
              <div className="flex justify-between items-end mb-6 border-b border-gray-100 pb-4">
                <div>
                  <h3 className="font-serif text-2xl text-[#4A5D4E]">Hall of Focus</h3>
                  <p className="text-[11px] text-gray-400 mt-1">이번 달 가장 많은 나무를 피워낸 포커서</p>
                </div>
                <Trophy className="w-8 h-8 text-amber-500 opacity-80" />
              </div>

              <div className="flex flex-col gap-3">
                {rankings.map((ranker, index) => (
                  <div key={ranker.id} className="flex items-center justify-between p-4 bg-[#F9F6F0]/80 rounded-2xl border border-gray-100 hover:bg-white transition-colors">
                    <div className="flex items-center gap-4">
                      {/* 순위 아이콘 처리 */}
                      <div className="w-8 h-8 flex items-center justify-center shrink-0">
                        {index === 0 ? <Crown className="w-6 h-6 text-amber-500" /> :
                         index === 1 ? <Medal className="w-6 h-6 text-gray-400" /> :
                         index === 2 ? <Medal className="w-6 h-6 text-amber-700" /> :
                         <span className="text-sm font-bold text-gray-400 font-mono">{index + 1}</span>}
                      </div>
                      
                      <div>
                        <p className="text-sm font-bold text-gray-800">{ranker.nickname}</p>
                        <p className="text-[10px] text-gray-500 font-mono">{ranker.hours} hrs focused</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-1.5 text-[#6B8E23] font-bold font-mono">
                        <Sprout className="w-3.5 h-3.5" />
                        {ranker.trees}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="text-center py-8 border-t border-gray-200/50 text-[10px] text-gray-400">
        © 2026 FOCUS ROOM. All rights reserved. Designed for the final project.
      </footer>
    </div>
  );
}