import React, { useState } from "react";
import { HelpCircle, AlertCircle } from "lucide-react";
import { useAuthController } from "./useAuthController";
import { useNavController } from "../../app/useNavController";

export default function RegisterPage() {
  const { register } = useAuthController();
  const { goTo } = useNavController();
  const onBack = () => goTo("focus");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState("");

  // 비밀번호 안전도 (0 ~ 4) 계산
  const getPasswordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 4) strength += 1;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password) || /[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const strength = getPasswordStrength();

  const getStrengthLabel = (s) => {
    if (s <= 1) return "취약함";
    if (s === 2) return "보통";
    if (s === 3) return "안전";
    return "매우안전";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name.trim()) {
      setError("이름을 입력해주세요.");
      return;
    }
    if (!emailPattern.test(email)) {
      setError("올바른 이메일 형식을 입력해주세요.");
      return;
    }
    if (password.length < 6) {
      setError("비밀번호를 6자 이상 입력해주세요.");
      return;
    }
    setError("");

    try {
      // 검증 통과 → 컨트롤러에 위임(성공 시 로그인 화면으로 이동, 자동 로그인하지 않음)
      await register({ email, password, nickname: name.trim() });
    } catch (err) {
      setError(err.message || "회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#333333] selection:bg-[#6B8E23]/20 flex flex-col font-sans relative overflow-hidden">
      {/* 1. 상단 글로벌 네비게이션 헤더 */}
      <header className="w-full p-6 flex justify-between items-center z-10">
        <div className="flex flex-col items-start">
          <h1
            className="text-2xl font-bold tracking-wider text-[#4A5D4E] cursor-pointer hover:opacity-85 select-none"
            onClick={onBack}
            title="홈 화면으로 이동"
          >
            FOCUS ROOM
          </h1>
          <p className="text-[11px] text-gray-500 uppercase tracking-widest mt-0.5">
            your time, your growth
          </p>
        </div>
      </header>

      {/* 2. 메인 투컬럼 분할 레이아웃 */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-6 lg:py-16 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-stretch z-10">
        {/* ─────────── 좌측: 회원가입 양식 ─────────── */}
        <section className="bg-white/60 backdrop-blur-md rounded-2xl p-8 lg:p-10 border border-gray-100 shadow-sm w-full max-w-md mx-auto flex flex-col justify-between">
          <div>
            <div className="mb-8">
              <h3 className="font-serif italic text-3xl text-[#4A5D4E] mb-1">
                회원가입
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 이름 */}
              <div className="flex flex-col">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                  이름
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-transparent border-b border-dashed border-gray-300 focus:border-[#6B8E23] outline-none py-2 text-xs text-[#333333] transition-colors w-full font-sans font-medium"
                  placeholder="이름"
                />
              </div>

              {/* 이메일 */}
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

              {/* 비밀번호 */}
              <div className="flex flex-col">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                  비밀번호
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-transparent border-b border-dashed border-gray-300 focus:border-[#6B8E23] outline-none py-2 text-xs text-[#333333] transition-colors w-full font-mono"
                  placeholder="••••••••"
                />

                {/* 안전도 측정 바 */}
                {password.length > 0 && (
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="flex gap-1 flex-1">
                      {[1, 2, 3, 4].map((index) => (
                        <div
                          key={index}
                          className={`h-1.5 rounded-full flex-grow transition-all duration-300 ${
                            index <= strength ? "bg-[#6B8E23]" : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[9px] font-sans font-bold text-[#6B8E23] whitespace-nowrap">
                      {getStrengthLabel(strength)}
                    </span>
                  </div>
                )}
              </div>

              {/* 에러 메시지 */}
              {error && (
                <div className="flex items-center gap-1.5 text-[10px] text-red-500 font-semibold">
                  <AlertCircle className="w-3 h-3" /> {error}
                </div>
              )}

              {/* 회원가입 제출 */}
              <button
                type="submit"
                className="w-full py-3.5 mt-2 bg-[#4A5D4E] hover:bg-[#3d4d41] text-white text-[10px] font-bold tracking-widest uppercase rounded-full transition-all duration-300 shadow-sm flex items-center justify-center gap-1.5 hover:scale-[1.01]"
              >
                회원가입하기 →
              </button>
            </form>
          </div>

          {/* 로그인 전환 */}
          <div className="text-center pt-8 border-t border-dashed border-gray-100 mt-8">
            <button
              onClick={() => goTo("login")}
              className="text-[10px] font-bold text-[#6B8E23] hover:text-[#4A5D4E] transition border-b border-dashed border-[#6B8E23] pb-0.5 tracking-wider"
            >
              이미 계정이 있으신가요? 로그인하기 ›
            </button>
          </div>
        </section>

        {/* ─────────── 우측: 가이드 보드 ─────────── */}
        <section className="flex flex-col justify-center items-start text-left max-w-sm mx-auto p-6">
          <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-6 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-[#6B8E23]" /> 정원 안내서
          </p>

          <div className="space-y-6 w-full mb-8">
            {/* 가이드 1 */}
            <div className="flex gap-4 items-start">
              <div className="w-4 h-4 rounded-full border-2 border-[#6B8E23] flex items-center justify-center shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-gray-700">씨앗 심기</h4>
                <p className="text-[10px] text-gray-400 mt-0.5 leading-normal">
                  한 번의 집중이 새로운 시작이 됩니다.
                </p>
              </div>
            </div>

            {/* 가이드 2 */}
            <div className="flex gap-4 items-start">
              <div className="w-4 h-4 rounded-full border-2 border-[#6B8E23] flex items-center justify-center shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-gray-700">
                  천천히 성장하기
                </h4>
                <p className="text-[10px] text-gray-400 mt-0.5 leading-normal">
                  조급함보다 꾸준함이 더 멀리 갑니다.
                </p>
              </div>
            </div>

            {/* 가이드 3 */}
            <div className="flex gap-4 items-start">
              <div className="w-4 h-4 rounded-full border-2 border-[#6B8E23] flex items-center justify-center shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-gray-700">정직한 기록</h4>
                <p className="text-[10px] text-gray-400 mt-0.5 leading-normal">
                  모든 세션은 있는 그대로 기록됩니다.
                </p>
              </div>
            </div>

            {/* 가이드 4 */}
            <div className="flex gap-4 items-start">
              <div className="w-4 h-4 rounded-full border-2 border-[#6B8E23] flex items-center justify-center shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-gray-700">
                  나만의 숲 만들기
                </h4>
                <p className="text-[10px] text-gray-400 mt-0.5 leading-normal">
                  집중이 쌓일수록 당신의 숲도 자라납니다.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
