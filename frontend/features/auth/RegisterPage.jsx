import { useState } from "react";
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
    if (!agreeTerms) {
      setError("개인정보 보호 조항에 동의하셔야 완료됩니다.");
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

              {/* 약관 동의 */}
              <div
                className="flex items-start gap-2.5 cursor-pointer select-none py-1 group"
                onClick={() => setAgreeTerms(!agreeTerms)}
              >
                <div
                  className={`w-3.5 h-3.5 mt-0.5 rounded border border-dashed flex items-center justify-center text-[10px] shrink-0 transition ${
                    agreeTerms
                      ? "border-[#6B8E23] bg-[#6B8E23]/10 text-[#6B8E23] font-bold"
                      : "border-gray-300 bg-white/20 text-transparent"
                  }`}
                >
                  ✓
                </div>
                <span className="text-[9.5px] text-gray-400 group-hover:text-gray-500 leading-normal tracking-wide transition-colors">
                  약관 동의 · 카메라 영상은 기기 외부로 전송되지 않고 안전하게
                  처리됩니다.
                </span>
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

            {/* 소셜 로그인 구분선 */}
            <div className="flex items-center justify-center my-6">
              <div className="h-[1px] flex-grow border-t border-dashed border-gray-200"></div>
              <span className="px-3 text-[9px] text-gray-400 font-mono tracking-wider lowercase">
                or
              </span>
              <div className="h-[1px] flex-grow border-t border-dashed border-gray-200"></div>
            </div>

            {/* 소셜 가입 */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => alert("🌱 카카오 연동 회원가입 성공!")}
                className="py-3 px-4 w-full bg-[#FEE500] hover:bg-[#F2D700] active:scale-[0.99] text-[#181600] text-[11px] font-bold rounded-xl transition duration-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 fill-[#181600]" viewBox="0 0 24 24">
                  <path d="M12 3c-5.523 0-10 3.731-10 8.333 0 2.951 1.812 5.539 4.54 7.106l-1.153 4.23c-.126.463.38.835.753.586l5.02-3.344c.277.036.559.055.84.055 5.523 0 10-3.73 10-8.333S17.523 3 12 3z" />
                </svg>
                카카오로 시작하기
              </button>
              <button
                onClick={() => alert("🌱 네이버 연동 회원가입 성공!")}
                className="py-3 px-4 w-full bg-[#03C75A] hover:bg-[#02af4f] active:scale-[0.99] text-white text-[11px] font-bold rounded-xl transition duration-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-3 h-3 fill-white" viewBox="0 0 24 24">
                  <path d="M16.2 3H21v18h-4.8l-7.4-10.7V21H4V3h4.8l7.4 10.7V3z" />
                </svg>
                네이버로 시작하기
              </button>
              <button
                onClick={() => alert("🌱 구글 연동 회원가입 성공!")}
                className="py-3 px-4 w-full bg-white border border-gray-200 hover:bg-gray-50 active:scale-[0.99] text-gray-700 text-[11px] font-bold rounded-xl transition duration-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                구글로 시작하기
              </button>
            </div>
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
                <h4 className="text-xs font-bold text-gray-700">
                  조용한 타이머
                </h4>
                <p className="text-[10px] text-gray-400 mt-0.5 leading-normal">
                  빨간 경고나 소음 없이 부드럽고 잔잔한 링으로 집중의 끝을
                  알립니다.
                </p>
              </div>
            </div>

            {/* 가이드 2 */}
            <div className="flex gap-4 items-start">
              <div className="w-4 h-4 rounded-full border-2 border-[#6B8E23] flex items-center justify-center shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-gray-700">
                  새로운 생명체
                </h4>
                <p className="text-[10px] text-gray-400 mt-0.5 leading-normal">
                  첫 몰입 세션을 완수하면 아늑한 구체 온실 속에 새로운 생명이
                  부화합니다.
                </p>
              </div>
            </div>

            {/* 가이드 3 */}
            <div className="flex gap-4 items-start">
              <div className="w-4 h-4 rounded-full border-2 border-[#6B8E23] flex items-center justify-center shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-gray-700">정직한 기록</h4>
                <p className="text-[10px] text-gray-400 mt-0.5 leading-normal">
                  중간에 중단한 기록까지도 따뜻하게 받아들여 히스토리에 아늑하게
                  보관합니다.
                </p>
              </div>
            </div>

            {/* 가이드 4 */}
            <div className="flex gap-4 items-start">
              <div className="w-4 h-4 rounded-full border-2 border-[#6B8E23] flex items-center justify-center shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-gray-700">
                  온디바이스 보안
                </h4>
                <p className="text-[10px] text-gray-400 mt-0.5 leading-normal">
                  카메라 분석 프레임과 모든 데이터는 클라우드 동기화 전까진
                  철저히 내 기기에만 머뭅니다.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
