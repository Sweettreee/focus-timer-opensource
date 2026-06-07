import React, { useState } from "react";
import { Compass, AlertCircle } from "lucide-react";
import { useAuthController } from "./useAuthController";
import { useNavController } from "../../app/useNavController";

export default function LoginPage() {
  const { login } = useAuthController();
  const { goTo } = useNavController();
  const onBack = () => goTo("focus");

  const [email, setEmail] = useState(
    () => localStorage.getItem("remembered_email") || "",
  );
  // 비밀번호는 절대 저장/자동입력하지 않는다(보안). 항상 빈 값에서 시작.
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(
    () => localStorage.getItem("remember_me") !== "false",
  );
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("올바른 이메일 형식을 입력해주세요.");
      return;
    }
    if (password.length < 4) {
      setError("비밀번호를 4자 이상 입력해주세요.");
      return;
    }
    setError("");

    try {
      // 검증 통과 → 인증 컨트롤러에 위임(영속화·화면 전환은 컨트롤러 담당)
      await login({ email, password });

      // 이메일만 기억(편의). 비밀번호는 저장하지 않으며, 과거 평문 저장값이 있으면 제거한다.
      localStorage.removeItem("remembered_password");
      if (rememberMe) {
        localStorage.setItem("remembered_email", email);
        localStorage.setItem("remember_me", "true");
      } else {
        localStorage.removeItem("remembered_email");
        localStorage.setItem("remember_me", "false");
      }
    } catch (err) {
      setError(err.message || "로그인 중 오류가 발생했습니다.");
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
          <p className="text-[11px] text-gray-500 uppercase tracking-widest mt-0.5">
            your time, your growth
          </p>
        </div>
      </header>

      {/* 2. 메인 콘텐츠 분할 영역 */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-6 lg:py-16 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center z-10">
        {/* ─────────── 좌측: 감성 스토리보드 ─────────── */}
        <section className="flex flex-col items-start text-left">
          <div className="w-8 h-8 rounded-full bg-[#6B8E23]/10 flex items-center justify-center text-[#6B8E23] font-bold text-sm mb-6">
            for
          </div>

          <h2 className="font-serif italic text-4xl lg:text-5xl text-[#4A5D4E] leading-tight mb-4">
            the ones who keep showing up
          </h2>

          <p className="text-gray-500 text-xs lg:text-sm leading-relaxed mb-8 max-w-sm">
            어제보다 한 세션 더, 그게 성장이에요.
          </p>

          {/* 지난 기록 보드 */}
          <div className="border border-dashed border-gray-300 rounded-2xl p-6 bg-white/50 w-full max-w-sm hover:shadow-sm transition-all duration-300">
            <p className="text-[10px] text-gray-400 font-bold tracking-wider uppercase mb-1.5 flex items-center gap-1">
              <Compass className="w-3 h-3 text-[#6B8E23]" />
            </p>
            <p className="font-serif italic text-base text-[#4A5D4E] mb-4">
              Focus Room 성장은 특별한 하루가 아니라 <br /> 평범한 하루의
              반복에서 시작됩니다.
            </p>
            <div className="flex gap-2.5"></div>
          </div>
        </section>

        {/* ─────────── 우측: 로그인 양식 ─────────── */}
        <section className="bg-white/60 backdrop-blur-md rounded-2xl p-8 lg:p-10 border border-gray-100 shadow-sm w-full max-w-md mx-auto">
          <div className="mb-8">
            <h3 className="font-serif italic text-3xl text-[#4A5D4E] mb-1">
              로그인
            </h3>
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
                  onClick={() =>
                    alert(
                      "🔑 임시 알림: 가입하신 이메일로 비밀번호 재설정 메일이 전송되었습니다.",
                    )
                  }
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
              <div
                className={`w-3.5 h-3.5 mt-0.5 rounded border border-dashed flex items-center justify-center text-[10px] transition ${
                  rememberMe
                    ? "border-[#6B8E23] bg-[#6B8E23]/10 text-[#6B8E23] font-bold"
                    : "border-gray-300 bg-white/20 text-transparent"
                }`}
              >
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
            <span className="px-3 text-[9px] text-gray-400 font-mono tracking-wider lowercase">
              or
            </span>
            <div className="h-[1px] flex-grow border-t border-dashed border-gray-200"></div>
          </div>

          {/* 가입 링크 */}
          <div className="text-center pt-2">
            <button
              onClick={() => goTo("register")}
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
