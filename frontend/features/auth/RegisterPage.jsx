import { useState } from "react";
import { HelpCircle, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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
    e.preventDefault(); // 폼 제출 후 자동 새로고침 막기
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name.trim()) {
      setError("이름을 입력해주세요");
      return;
    }
    if (!emailPattern.test(email)) {
      setError("올바른 이메일 형식을 입력해주세요");
      return;
    }
    if (password.length < 6) {
      setError("비밀번호 6자 이상 입력해주세요");
      return;
    }

    setError("");

    // controller 로직이 완료되고 나서 추가
    // await는 "비동기 작업이 끝날 때까지 기다려"라는 명령어
    // try {
    //     await register({email, password, nickname: name.trim()});
    // } catch (err) {
    //     setError(err.message || "회원가입 중 오류가 발생했습니다");
    // }
  };

  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#333333] selection:bg-[#6B8E23]/20 flex flex-col font-sans">
      <header className="w-full p-6 flex justify-between items-center">
        <div className="flex flex-col items-start">
          <h1
            className="text-2xl font-bold tracking-wider text-[#4A5D4E] cursor-pointer hover:opacity-85 select-none"
            // onClick={onBack}
            title="홈 화면으로 이동"
          >
            FOCUS ROOM
          </h1>
          <p className="text-[11px] text-gray-500 uppercase tracking-widest mt-0.5">
            your time, your growth
          </p>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-6 lg:py-6 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-stretch">
        <section className="bg-white/60 backdrop-blur-md rounded-2xl p-8 lg:p-10 border border-gray-100 shadow-sm w-full max-w-md mx-auto flex flex-col justify-between">
          <div>
            <div className="mb-8">
              <h3 className="font-serif italic text-3xl text-[#4A5D4E] mb-1">
                Sign Up
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 이름 */}
              <div className="flex flex-col">
                <label className="text-[9px] font-bold text-gray-400 uppercase tacking-widest mb-1.5">
                  이름
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-transparent border-b border-dashed border-gray-300 focus:border-[#6B8E23] outline-none py-2 text-xs text-[#333333] transition-colors w-full font-medium"
                  placeholder="이름"
                />
              </div>

              {/* 이메일 */}
              <div className="flex flex-col">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                  이메일
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-transparent border-b border-dashed border-gray-300 focus:border-[#6B8E23] outline-none py-2 text-xs text-[#333333] transition-colors w-full font-mono"
                  placeholder="E-mail"
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
                  placeholder="password"
                />

                {/* 안전도 */}
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
                    <span className="text-[9px] font-bold text-[#6B8E23] whitespace-nowrap">
                      {getStrengthLabel(strength)}
                    </span>
                  </div>
                )}
              </div>

              {/* 에러메시지 */}
              {error && (
                <div className="flex items-center gap-1.5 text-[10px] text-red-500 font-semibold">
                  <AlertCircle className="w-3 h-3" /> {error}
                </div>
              )}

              {/* 회원가입 제출 */}
              <button
                type="submit"
                className="w-full py-3.5 mt-2 bg-[#4A5D4E] hover:bg-[#3d4d41] text-white text-[10px] font-bold tracking-widest uppercase rounded-full transition-all duration-300 shadow-sm flex items-center justify-center hover:scale-[1.01]"
              >
                회원가입하기 →
              </button>
            </form>

            {/* 소셜 로그인 구분선 */}
            <div className="flex items-center justify-center my-6">
              <div className="h-[1px] flex-grow border-gray-200"></div>
              <span className="px-3 text-[9px] text-gray-400 font-mono tracking-wider lowercase">
                or
              </span>
              <div className="h-[1px] flex-grow border-gray-200"></div>
            </div>

            {/* 소셜 가입 */}
            {/* <div className="flex flex-col gap-3">
                <button
                  onClick={() => alert("카카오톡 로그인 성공!")}
                  className="py-3 px-4 w-full bg-[#FEE500] hover:bg-[#F2D700] active:scale-[0.99] text-[#181600] text-[11px] font-bold rounded-xl transition duration-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/KakaoTalk_logo.svg/1280px-KakaoTalk_logo.svg.png?_=20190617212005"
                    alt="kakaotalk"
                    className="w-3.5 h-3.5 fill-[#181600]"
                    viewBox="0 0 24 24"
                  />
                  카카오톡으로 시작하기
                </button>
              </div> */}
          </div>
          {/* 로그인 전환 */}
          <div className="text-center pt-8 border-t border-dashed border-gray-100 mt-8">
            <button
              // onClick={() => goTo('login')}
              className="text-[10px] font-bold text-[#6B8E23] hover:text-[#4A5D4E] transition border-b border-dashed border-[#6B8E23] pb-0.5 tracking-wider"
            >
              이미 계정에 있으신가요? 로그인하기
            </button>
          </div>
        </section>

        {/* 우측: 가이드 보드 */}
        <section className="flex flex-col justify-center items-start max-w-sm mx-auto p-6">
          <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-6 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-[#6B8E23]" /> focus-room
            안내서
          </p>

          <div className="space-y-6 w-full mb-8">
            {/* guide-1 */}
            <div className="flex gap-4 items-start">
              <div className="w-4 h-4 rounded-full border-2 border-[#6B8E23] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-gray-700">집중 시작</h4>
                <p className="text-[10px] text-gray-400 mt-0.5 leading-normal">
                  타이머를 시작하고 한 가지 일에만 몰입하세요.
                </p>
              </div>
            </div>

            {/* guider-2 */}
            <div className="flex gap-4 items-start">
              <div className="w-4 h-4 rounded-full border-2 border-[#6B8E23] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-gray-700">씨앗 심기</h4>
                <p className="text-[10px] text-gray-400 mt-0.5 leading-normal">
                  한 번의 집중이 새로운 시작이 됩니다.
                </p>
              </div>
            </div>

            {/* guide-3 */}
            <div className="flex gap-4 items-start">
              <div className="w-4 h-4 rounded-full border-2 border-[#6B8E23] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-gray-700">기록 보관</h4>
                <p className="text-[10px] text-gray-400 mt-0.5 leading-normal">
                  집중 시간과 성과가 자동으로 기록됩니다.
                </p>
              </div>
            </div>

            {/* guide-4 */}
            <div className="flex gap-4 items-start">
              <div className="w-4 h-4 rounded-full border-2 border-[#6B8E23] shrink-0 mt-0.5" />
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

      <footer className="p-6 text-center text-[10px] text-gray-400 border-t border-gray-200/20 max-w-6xl w-full mx-auto">
        <span>FOCUS ROOM. A silent sanctuary</span>
      </footer>
    </div>
  );
}
