import React from 'react';
import { ChevronDown, User, LogIn, UserPlus } from 'lucide-react';
import { useUser, useStats } from '../selectors';
import { useAuthController } from '../../features/auth/useAuthController';
import { useNavController } from '../useNavController';

export default function Header({ currentView }) {
  const user = useUser();
  const stats = useStats();
  const { logout } = useAuthController();
  const { goTo } = useNavController();

  return (
    <header className="relative z-50 flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-3 border-b border-gray-200/30 pb-2">
      <div>
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-85 select-none" onClick={() => goTo('focus')} title="홈 화면으로 이동">
          <h1 className="text-2xl font-bold tracking-wider text-[#4A5D4E]">FOCUS ROOM</h1>
        </div>
        <p className="text-[11px] text-gray-500 uppercase tracking-widest mt-0.5">your time, your growth</p>
      </div>

      {/* 상단 통계 요약 (Today Focus, Sessions, Streak) */}
      <div className="flex flex-wrap items-center gap-3 md:gap-4">
        <div className="flex items-center gap-5 md:gap-7 select-none px-2">
          {/* TODAY FOCUS */}
          <div className="text-center">
            <p className="text-[#8C867A] text-[8.5px] uppercase tracking-[0.18em] font-semibold">
              TODAY FOCUS
            </p>
            <p className="font-serif italic font-medium text-gray-800 text-[16px] mt-0.5">
              {stats.todayFocus}
            </p>
          </div>
          
          <div className="w-[1px] h-6 bg-gray-300/60"></div>
          
          {/* SESSIONS */}
          <div className="text-center">
            <p className="text-[#8C867A] text-[8.5px] uppercase tracking-[0.18em] font-semibold">
              SESSIONS
            </p>
            <p className="font-serif italic font-medium text-gray-800 text-[16px] mt-0.5">
              {stats.sessions}
            </p>
          </div>
          
          <div className="w-[1px] h-6 bg-gray-300/60"></div>
          
          {/* STREAK */}
          <div className="text-center">
            <p className="text-[#8C867A] text-[8.5px] uppercase tracking-[0.18em] font-semibold">
              STREAK
            </p>
            <p className="font-serif italic font-medium text-gray-800 text-[16px] mt-0.5">
              {stats.streak}d
            </p>
          </div>
        </div>

        {user ? (
          <div className="relative group">
            {/* 사람이모티콘 My 버튼 */}
            <button
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white/80 border border-[#4A5D4E]/20 hover:bg-[#4A5D4E]/5 text-[#4A5D4E] font-semibold text-xs tracking-wide rounded-xl shadow-sm hover:shadow transition-all duration-200 cursor-pointer select-none"
              title="마이 메뉴"
            >
              <User className="w-3.5 h-3.5 opacity-90" />
              <span>My</span>
              <ChevronDown className="w-3 h-3 text-[#4A5D4E]/60 group-hover:rotate-180 transition-transform duration-200" />
            </button>
            
            {/* 호버 드롭다운 메뉴 (Rich Popover Card) */}
            <div className="absolute right-0 top-full mt-2 w-64 bg-[#FAF8F5] border border-[#4A5D4E]/15 border-t-[3px] border-t-[#D27D66] rounded-xl shadow-xl overflow-hidden transition-all duration-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 z-[999] flex flex-col">
              {/* 상단: 닉네임 & 로그아웃 */}
              <div className="flex justify-between items-center px-4 py-3 border-b border-[#4A5D4E]/10 bg-[#F5F2EC]/30">
                <span className="font-bold text-gray-800 text-sm truncate max-w-[130px]">{user.nickname}</span>
                <button
                  onClick={logout}
                  className="px-2 py-1 text-[10px] font-bold text-gray-500 hover:text-red-600 bg-gray-200/50 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                >
                  로그아웃
                </button>
              </div>
              
              {/* 중단: 집중 통계 목록 */}
              <div className="p-4 flex flex-col gap-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-medium">집중 시간</span>
                  <span className="font-serif italic font-semibold text-[#4A5D4E]">{stats.todayFocus}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-medium">완료한 세션</span>
                  <span className="font-serif italic font-semibold text-[#4A5D4E]">{stats.sessions}회</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-medium">학습 스트릭</span>
                  <span className="font-serif italic font-semibold text-[#4A5D4E]">{stats.streak}일</span>
                </div>
              </div>

              <div className="h-[1px] bg-[#4A5D4E]/10 mx-4"></div>
              
              {/* 하단: 거대 액션 버튼 2개 */}
              <div className="p-4 flex gap-2">
                {currentView === 'history' ? (
                  <button
                    onClick={() => goTo('focus')}
                    className="flex-grow py-2.5 rounded-xl bg-[#4A5D4E] hover:bg-[#3d4c40] text-[#F9F6F0] text-center text-xs font-semibold shadow transition cursor-pointer select-none"
                  >
                    타이머 화면
                  </button>
                ) : (
                  <button
                    onClick={() => goTo('history')}
                    className="flex-grow py-2.5 rounded-xl bg-[#4A5D4E] hover:bg-[#3d4c40] text-[#F9F6F0] text-center text-xs font-semibold shadow transition cursor-pointer select-none"
                  >
                    히스토리 보기
                  </button>
                )}
                <button
                  onClick={() => alert('설정 기능 준비 중입니다.')}
                  className="flex-grow py-2.5 rounded-xl bg-[#D27D66] hover:bg-[#c36e57] text-[#F9F6F0] text-center text-xs font-semibold shadow transition cursor-pointer select-none"
                >
                  설정 변경
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex gap-1">
            <button
              onClick={() => goTo('login')}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#6B8E23]/10 hover:bg-[#6B8E23]/20 border border-[#6B8E23]/20 hover:border-[#6B8E23]/30 text-[#4A5D4E] transition-all rounded-xl text-xs font-semibold tracking-wide cursor-pointer shadow-sm"
              title="로그인"
            >
              <LogIn className="w-3.5 h-3.5" /> 로그인
            </button>
            <button
              onClick={() => goTo('register')}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/80 border border-gray-200 hover:bg-white text-gray-500 hover:text-gray-800 transition-all rounded-xl text-xs font-semibold tracking-wide cursor-pointer shadow-sm"
              title="회원가입"
            >
              <UserPlus className="w-3.5 h-3.5" /> 회원가입
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
