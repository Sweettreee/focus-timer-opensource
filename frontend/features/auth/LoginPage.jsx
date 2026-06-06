import React, { useState } from 'react';
import { Compass, AlertCircle } from 'lucide-react';
import { useAuthController } from './useAuthController';
import { useNavController } from '../../app/useNavController';

export default function LoginPage() {
  const { login } = useAuthController();
  const { goTo } = useNavController();
  const onBack = () => goTo('focus');
  
  const [email, setEmail] = useState(() => localStorage.getItem('remembered_email') || '');
  const [password, setPassword] = useState(() => localStorage.getItem('remembered_password') || '');
  const [rememberMe, setRememberMe] = useState(() => localStorage.getItem('remember_me') !== 'false');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError('올바른 이메일 형식을 입력해주세요.');
      return;
    }
    if (password.length < 4) {
      setError('비밀번호를 4자 이상 입력해주세요.');
      return;
    }
    setError('');
    
    try {
      // 검증 통과 → 인증 컨트롤러에 위임(영속화·화면 전환은 컨트롤러 담당)
      await login({ email, password });
      
      // 자동 로그인 쿠키/로컬스토리지 저장 처리
      if (rememberMe) {
        localStorage.setItem('remembered_email', email);
        localStorage.setItem('remembered_password', password);
        localStorage.setItem('remember_me', 'true');
      } else {
        localStorage.removeItem('remembered_email');
        localStorage.removeItem('remembered_password');
        localStorage.setItem('remember_me', 'false');
      }
    } catch (err) {
      setError(err.message || '로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#333333] selection:bg-[#6B8E23]/20 flex flex-col font-sans relative overflow-hidden">
      
      {/* 1. 상단 헤더 */}
      <header className="w-full p-6 flex justify-between items-center z-10">
        <div className="flex flex-col items-start">
          <h1 
            className="text-2xl font-bold tracking-wider text-[#4A5D4E] cursor-pointer hover:opacity-85 select-none" 
            onClick={onBack}
            title="홈 화면으로 이동"
          >
            FOCUS ROOM
          </h1>
          <p className="text-[11px] text-gray-500 uppercase tracking-widest mt-0.5">your time, your growth</p>
        </div>
      </header>

      {/* 2. 메인 콘텐츠 분할 영역 */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-6 lg:py-16 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center z-10">
        
        {/* ─────────── 좌측: 감성 스토리보드 ─────────── */}
        <section className="flex flex-col items-start text-left">
          <div className="w-8 h-8 rounded-full bg-[#6B8E23]/10 flex items-center justify-center text-[#6B8E23] font-bold text-sm mb-6">
            fo
          </div>

          <h2 className="font-serif italic text-4xl lg:text-5xl text-[#4A5D4E] leading-tight mb-4">
            the lamp is still warm.
          </h2>

          <p className="text-gray-500 text-xs lg:text-sm leading-relaxed mb-8 max-w-sm">
            자리를 비운 동안에도 집중 세션 기록과 환경 설정은 안전하게 보존됩니다.
          </p>

          {/* 지난 기록 보드 */}
          <div className="border border-dashed border-gray-300 rounded-2xl p-6 bg-white/50 w-full max-w-sm hover:shadow-sm transition-all duration-300">
            <p className="text-[10px] text-gray-400 font-bold tracking-wider uppercase mb-1.5 flex items-center gap-1">
              <Compass className="w-3 h-3 text-[#6B8E23]" /> 마지막 이력 · 4일 전
            </p>
            <p className="font-serif italic text-base text-[#4A5D4E] mb-4">
              “25분 집중 완료.”
            </p>
            <div className="flex gap-2.5">
              
            </div>
          </div>
        </section>

        {/* ─────────── 우측: 로그인 양식 ─────────── */}
        <section className="bg-white/60 backdrop-blur-md rounded-2xl p-8 lg:p-10 border border-gray-100 shadow-sm w-full max-w-md mx-auto">
          <div className="mb-8">
            <h3 className="font-serif italic text-3xl text-[#4A5D4E] mb-1">로그인</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 이메일 인풋 */}
            <div className="flex flex-col">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                이메일
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-transparent border-b border-dashed border-gray-300 focus:border-[#6B8E23] outline-none py-2 text-xs text-[#333333] transition-colors w-full font-mono"
                placeholder="email@example.com"
              />
            </div>

            {/* 비밀번호 인풋 */}
            <div className="flex flex-col relative">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                  비밀번호
                </label>
                <button
                  type="button"
                  onClick={() => alert("🔑 임시 알림: 가입하신 이메일로 비밀번호 재설정 메일이 전송되었습니다.")}
                  className="text-[9px] text-[#6B8E23] hover:text-[#4A5D4E] hover:underline tracking-wide"
                >
                  비밀번호 찾기 ›
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-transparent border-b border-dashed border-gray-300 focus:border-[#6B8E23] outline-none py-2 text-xs text-[#333333] transition-colors w-full font-mono"
                placeholder="••••••••"
              />
            </div>

            {/* 자동 로그인 토글 */}
            <div 
              className="flex items-start gap-2.5 cursor-pointer select-none py-1 group" 
              onClick={() => setRememberMe(!rememberMe)}
            >
              <div className={`w-3.5 h-3.5 mt-0.5 rounded border border-dashed flex items-center justify-center text-[10px] transition ${
                rememberMe 
                  ? 'border-[#6B8E23] bg-[#6B8E23]/10 text-[#6B8E23] font-bold' 
                  : 'border-gray-300 bg-white/20 text-transparent'
              }`}>
                ✓
              </div>
              <span className="text-[10px] text-gray-400 group-hover:text-gray-500 leading-normal tracking-wide transition-colors">
                자동 로그인 · 로그인 상태를 30일간 유지합니다.
              </span>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="flex items-center gap-1.5 text-[10px] text-red-500 font-semibold">
                <AlertCircle className="w-3 h-3" /> {error}
              </div>
            )}

            {/* 입장 버튼 */}
            <button
              type="submit"
              className="w-full py-3.5 mt-2 bg-[#4A5D4E] hover:bg-[#3d4d41] text-white text-[10px] font-bold tracking-widest uppercase rounded-full transition-all duration-300 shadow-sm flex items-center justify-center gap-1.5 hover:scale-[1.01]"
            >
              입장하기 →
            </button>
          </form>

          {/* 소셜 연결 구분선 */}
          <div className="flex items-center justify-center my-6">
            <div className="h-[1px] flex-grow border-t border-dashed border-gray-200"></div>
            <span className="px-3 text-[9px] text-gray-400 font-mono tracking-wider lowercase">or</span>
            <div className="h-[1px] flex-grow border-t border-dashed border-gray-200"></div>
          </div>

          {/* 소셜 간편 로그인 */}
          <div className="flex flex-col gap-3 mb-8">
            <button
              onClick={() => alert("🔑 카카오 로그인이 연동되었습니다.")}
              className="py-3 px-4 w-full bg-[#FEE500] hover:bg-[#F2D700] active:scale-[0.99] text-[#181600] text-[11px] font-bold rounded-xl transition duration-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 fill-[#181600]" viewBox="0 0 24 24">
                <path d="M12 3c-5.523 0-10 3.731-10 8.333 0 2.951 1.812 5.539 4.54 7.106l-1.153 4.23c-.126.463.38.835.753.586l5.02-3.344c.277.036.559.055.84.055 5.523 0 10-3.73 10-8.333S17.523 3 12 3z"/>
              </svg>
              카카오로 시작하기
            </button>
            <button
              onClick={() => alert("🔑 네이버 로그인이 연동되었습니다.")}
              className="py-3 px-4 w-full bg-[#03C75A] hover:bg-[#02af4f] active:scale-[0.99] text-white text-[11px] font-bold rounded-xl transition duration-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-3 h-3 fill-white" viewBox="0 0 24 24">
                <path d="M16.2 3H21v18h-4.8l-7.4-10.7V21H4V3h4.8l7.4 10.7V3z"/>
              </svg>
              네이버로 시작하기
            </button>
            <button
              onClick={() => alert("🔑 구글 로그인이 연동되었습니다.")}
              className="py-3 px-4 w-full bg-white border border-gray-200 hover:bg-gray-50 active:scale-[0.99] text-gray-700 text-[11px] font-bold rounded-xl transition duration-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              구글로 시작하기
            </button>
          </div>

          {/* 가입 링크 */}
          <div className="text-center pt-2">
            <button 
              onClick={() => goTo('register')}
              className="text-[10px] font-bold text-[#6B8E23] hover:text-[#4A5D4E] transition border-b border-dashed border-[#6B8E23] pb-0.5 tracking-wider"
            >
              처음이신가요? 회원가입하기 ›
            </button>
          </div>
        </section>
      </main>


    </div>
  );
}
