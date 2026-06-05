// frontend/app/App.jsx
import React from 'react';
import AmbientMixer from '../features/ambient/AmbientMixer';
import FocusTimer from '../features/timer/FocusTimer';
import TodoList from '../features/tasks/TodoList';
import SessionCards from '../features/history/SessionCards';
import HistoryPage from '../features/history/HistoryPage';
import LoginPage from '../features/auth/LoginPage';
import RegisterPage from '../features/auth/RegisterPage';
import Header from './layout/Header';
import { useView } from './selectors';

export default function App() {
  const view = useView();

  // 화면 라우팅 조건 (view 상태에 따라 렌더링)
  if (view === 'register') return <RegisterPage />;
  if (view === 'login') return <LoginPage />;
  if (view === 'history') return <HistoryPage />;

  // view === 'focus' 일 때 보여지는 메인 타이머 화면
  return (
    <div className="h-screen bg-[#F9F6F0] text-[#333333] p-5 flex flex-col justify-between font-sans selection:bg-[#6B8E23]/20 overflow-hidden">
      {/* 상단 헤더 영역 */}
      <Header currentView="focus" />

      {/* 메인 3분할 콘텐츠 영역 */}
      <main className="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-1 min-h-0 items-stretch mb-1">

        {/* [섹션 1] 좌측: 사운드 믹서 영역 */}
        <section className="lg:col-span-1 bg-white/60 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-gray-100/80 flex flex-col hover:shadow-md transition-all duration-300 overflow-hidden">
          <AmbientMixer />
        </section>

        {/* [섹션 2] 중앙: 3D 위젯 및 타이머 영역 */}
        <section className="lg:col-span-2 flex flex-col min-h-0 overflow-hidden">
          <FocusTimer />
        </section>

        {/* [섹션 3] 우측: 오늘의 할 일 및 기록 캡처 영역 */}
        <section className="lg:col-span-1 flex flex-col gap-4 min-h-0 overflow-hidden">
          <TodoList />
          <SessionCards />
        </section>

      </main>
    </div>
  );
}