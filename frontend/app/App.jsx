import React from 'react';
import AmbientMixer from '../features/ambient/AmbientMixer';
import FocusTimer from '../features/timer/FocusTimer';
import TodoList from '../features/tasks/TodoList';
import SessionCards from '../features/history/SessionCards';
import HistoryPage from '../features/history/HistoryPage';
import LoginPage from '../features/auth/LoginPage';
import RegisterPage from '../features/auth/RegisterPage';
import Header from './layout/Header';
import Footer from './layout/Footer';
import { useView } from './selectors';

export default function App() {
  const view = useView();

  if (view === 'register') return <RegisterPage />;
  if (view === 'login') return <LoginPage />;
  if (view === 'history') return <HistoryPage />;

  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#333333] p-6 flex flex-col justify-between font-sans selection:bg-[#6B8E23]/20">
      {/* 상단 헤더 영역 */}
      <Header currentView="focus" />

      {/* 메인 3분할 콘텐츠 영역 */}
      <main className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 items-stretch">

        {/* [섹션 1] 좌측: 사운드 믹서 영역 (이동욱 담당) */}
        <section className="lg:col-span-1 bg-white/60 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-gray-100/80 flex flex-col hover:shadow-md transition-all duration-300">
          <AmbientMixer />
        </section>

        {/* [섹션 2] 중앙: 3D 위젯 및 타이머 영역 (장익준 담당) */}
        <section className="lg:col-span-2 bg-white/40 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-gray-100/80 flex flex-col items-center justify-center relative hover:shadow-md transition-all duration-300">
          <FocusTimer />
        </section>

        {/* [섹션 3] 우측: 오늘의 할 일 및 기록 캡처 영역 (김진식 담당) */}
        <section className="lg:col-span-1 flex flex-col gap-6">
          <TodoList />
          <SessionCards />
        </section>

      </main>

      {/* 하단 푸터 영역 */}
      <Footer />
    </div>
  );
}