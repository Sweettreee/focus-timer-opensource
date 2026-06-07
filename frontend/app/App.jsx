import AmbientMixer from '../features/ambient/AmbientMixer';
import FocusTimer from '../features/timer/FocusTimer';
import TodoList from '../features/tasks/TodoList';
import SessionCards from '../features/history/SessionCards';
import HistoryPage from '../features/history/HistoryPage';
import LoginPage from '../features/auth/LoginPage';
import RegisterPage from '../features/auth/RegisterPage';
import LandingPage from '../features/landing/LandingPage';
import Header from './layout/Header';
import Footer from './layout/Footer';
import { useView } from './selectors';

export default function App() {
  const view = useView();

  if (view === 'landing') return <LandingPage />;
  if (view === 'register') return <RegisterPage />;
  if (view === 'login') return <LoginPage />;
  if (view === 'history') return <HistoryPage />;

  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#333333] p-6 flex flex-col justify-between font-sans selection:bg-[#6B8E23]/20">
  <Header currentView="focus" />
      <main className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 items-stretch">
        <section className="lg:col-span-1 bg-white/60 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-gray-100/80 flex flex-col hover:shadow-md transition-all duration-300">
          <AmbientMixer />
        </section>
        <section className="lg:col-span-2 bg-white/40 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-gray-100/80 flex flex-col items-center justify-center relative hover:shadow-md transition-all duration-300">
          <FocusTimer />
        </section>
        <section className="lg:col-span-1 flex flex-col gap-6">
          <TodoList />
          <SessionCards />
        </section>
      </main>
      <Footer />
    </div>
  );
}
