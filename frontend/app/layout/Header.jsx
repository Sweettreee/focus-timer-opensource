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
    <header className="relative z-50 flex flex-col md:flex-row justify-between items-center mb-2 gap-3 border-b border-gray-200/50 pb-2 w-full">
      
      {/* 로고 */}
      <div className="md:flex-1 flex flex-col items-center md:items-start w-full md:w-auto">
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80" onClick={() => goTo('focus')}>
          <h1 className="text-2xl font-bold tracking-wider text-[#4A5D4E]">FOCUS ROOM</h1>
        </div>
        <p className="text-[11px] text-gray-400 mt-0.5">your time, your growth</p>
      </div>

      {/* 통계 요약 영역 (가운데 정렬) */}
      <div className="flex items-center justify-center gap-5 md:gap-7 select-none px-3 py-1.5 bg-gray-50/50 rounded-xl border border-gray-200/20 shadow-[inset_0_1px_2px_rgba(0,0,0,0.01)] my-1 md:my-0">
        {/* TODAY FOCUS */}
        <div className="text-center px-1">
          <p className="text-[#8C867A] text-[8.5px] uppercase tracking-[0.18em] font-semibold">
            TODAY FOCUS
          </p>
          <p className="font-serif italic font-medium text-gray-800 text-[15px] mt-0.5">
            {stats.todayFocus}
          </p>
        </div>
        
        <div className="w-[1px] h-6 bg-gray-300/40"></div>
        
        {/* SESSIONS */}
        <div className="text-center px-1">
          <p className="text-[#8C867A] text-[8.5px] uppercase tracking-[0.18em] font-semibold">
            SESSIONS
          </p>
          <p className="font-serif italic font-medium text-gray-800 text-[15px] mt-0.5">
            {stats.sessions}
          </p>
        </div>
        
        <div className="w-[1px] h-6 bg-gray-300/40"></div>
        
        {/* STREAK */}
        <div className="text-center px-1">
          <p className="text-[#8C867A] text-[8.5px] uppercase tracking-[0.18em] font-semibold">
            STREAK
          </p>
          <p className="font-serif italic font-medium text-gray-800 text-[15px] mt-0.5">
            {stats.streak}d
          </p>
        </div>
      </div>

      {/* 우측 유저 메뉴 및 버튼 */}
      <div className="md:flex-1 flex items-center justify-center md:justify-end w-full md:w-auto">
        {user ? (
          <div className="relative group">
            
            <button className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-[#4A5D4E] font-bold text-xs rounded-xl shadow-sm transition-colors">
              <User className="w-3.5 h-3.5" />
              <span>My</span>
              <ChevronDown className="w-3 h-3 text-[#4A5D4E]/70 group-hover:rotate-180 transition-transform" />
            </button>
            
            {/* 마이페이지 드롭다운 */}
            <div className="absolute right-0 top-full mt-1.5 w-60 bg-[#FAF8F5] border border-gray-200 rounded-xl shadow-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[999] flex flex-col">
              
              <div className="flex justify-between items-center px-4 py-2.5 border-b border-gray-200 bg-gray-50">
                <span className="font-bold text-gray-800 text-xs truncate max-w-[120px]">{user.nickname}</span>
                <button
                  onClick={logout}
                  className="px-2 py-1 text-[10px] font-bold text-gray-500 hover:text-red-600 bg-gray-200/60 hover:bg-red-50 rounded-md transition-colors"
                >
                  로그아웃
                </button>
              </div>
              
              <div className="p-3.5 flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">집중 시간</span>
                  <span className="font-bold text-[#4A5D4E]">{stats.todayFocus}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">완료한 세션</span>
                  <span className="font-bold text-[#4A5D4E]">{stats.sessions}회</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">학습 스트릭</span>
                  <span className="font-bold text-[#4A5D4E]">{stats.streak}일</span>
                </div>
              </div>

              <div className="h-[1px] bg-gray-100 mx-3"></div>
              
              <div className="p-3">
                {currentView === 'history' ? (
                  <button
                    onClick={() => goTo('focus')}
                    className="w-full py-2 rounded-lg bg-[#4A5D4E] hover:bg-[#3d4c40] text-white text-center text-xs font-bold shadow transition-colors"
                  >
                    타이머 화면
                  </button>
                ) : (
                  <button
                    onClick={() => goTo('history')}
                    className="w-full py-2 rounded-lg bg-[#4A5D4E] hover:bg-[#3d4c40] text-white text-center text-xs font-bold shadow transition-colors"
                  >
                    히스토리 보기
                  </button>
                )}
              </div>

            </div>
          </div>
        ) : (
          <div className="flex gap-1.5">
            <button
              onClick={() => goTo('login')}
              className="flex items-center gap-1 px-3 py-2 bg-[#6B8E23]/10 hover:bg-[#6B8E23]/20 border border-[#6B8E23]/20 text-[#4A5D4E] rounded-xl text-xs font-bold transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" /> 로그인
            </button>
            
            <button
              onClick={() => goTo('register')}
              className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 hover:text-gray-700 rounded-xl text-xs font-bold transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" /> 회원가입
            </button>
          </div>
        )}
      </div>

    </header>
  );
}

