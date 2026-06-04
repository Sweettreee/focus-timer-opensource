import { useState } from "react";
import { AlertCircle, Compass } from "lucide-react";

export default function LoginPage() {
  // const { login } = useAuthController();
  // const { goTo } = useNavController();
  // const onBack = () => goTo('focus');

  const [email, setEmail] = useState(
    () => localStorage.getItem("logined_email") || "",
  );
  const [password, setPassword] = useState(
    () => localStorage.getItem("logined_password") || "",
  );
  // const [rememberMe, setRememberMe] = useState
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("올바른 이메일 형식을 입력해주세요");
      return;
    }
    if (password.length < 4) {
      setError("비밀번호를 4자 이상 입력해주세요");
      return;
    }
    setError("");

    try {
      // await login({ email, password })
      // 자동 로그인 유지
      localStorage.setItem(email);
      localStorage.setItem(password);
    } catch (err) {
      setError(err.message || "로그인 중 오류가 발생했습니다");
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#333333] selection:bg-[#6B8E23]/20 flex flex-col font-sans relative overlow-hidden">
      <header className="w-full p-6 flex justify-between items-center z-10">
        <div className="flex flex-col items-start">
          <h1
            className="text-2xl font-bold tracking-wider text-[#4A5D4E] cursor-pointer hover:opacity-85 select-none"
            // onClick={onBack}
            title="홈 화면으로 이동"
          >
            FOCUS ROOM
          </h1>
        </div>
        <p className="text-[11px] text-gray-500 uppercase tracking-widest mt-0.5">
          3d-pomodoro timer
        </p>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-6 lg:py-16 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center z-10">
        <section className="flex flex-col items-start text-left">
          <div className="w-8 h-8 rounded-full bg-[#6B8E23]/10 flex items-center justify-center text-[#6B8E23] font-bold text-sm mb-6">
            for
          </div>

          <h2 className="font-serif italic text-4xl lg:text-5xl text-[#4A5D4E] leading-[1.15] mb-4">
            the ones who <br /> keep showing up
          </h2>

          <p className="text-gray-500 text-xs lg:text-sm leading-relaxed mb-10 max-w-sm">
            어제보다 한 세션 더, 그게 성장이에요.
          </p>

          <div className="w-full max-w-sm border border-dashed border-gray-300 rounded-2xl p-5 bg-white/50 hover:shadow-sm transition-all duration-300">
            <p className="text-[10px] text-gray-400 font-bold tracking-wider uppercase mb-2 flex items-center gap-1.5">
              <Compass className="w-3 h-3 text-[#6B8E23]" /> Focus Room
            </p>
            <p className="font-serif italic text-base text-[#4A5D4E] mb-4">
              "성장은 특별한 하루가 아니라, <br></br>
              평범한 하루의 반복에서 시작됩니다."
            </p>
            <div className="flex gap-2.5"></div>
          </div>
        </section>

        <section className="bg-white/60 backdrop-blur-md rounded-2xl p-8 lg:p-10 border border-gray-100 shadow-sm w-full max-w-md mx-auto">
          <div className="mb-8">
            <h3 className="font-serif italic text-3xl txt-[#4A5D4E] mb-1">
              로그인
            </h3>
          </div>

          {/*  */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 이메일 */}
            <div className="flex flex-col">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                E-mail
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
            <div className="flex flex-col relative">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                  비밀번호
                </label>
                <button
                  type="button"
                  // onClick={() => alert("알림: 가입하신 이메일로 비밀번호 재설정 메일이 전송되었습니다")}
                  className="text-[9px] text-[#6B8E23] hover:text-[#4A5D4E] hover:underline tracking-wide"
                >
                  비밀번호 찾기
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-transparent border-b border-dashed border-gray-300 focus:border-[#6B8E23] outline-none py-2 text-xs text-[#333333] transition-colors w-full font-mono"
                placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;"
              />
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="flex items-center gap-1.5 text-[#10px] text-red-500 font-semibold">
                <AlertCircle className="w-3 h-3" /> {error}
              </div>
            )}

            {/* 입장버튼 */}
            <button
              type="submit"
              className="w-full py-3.5 mt-2 bg-[#4A5D4E] hover:bg-[#3d4d41] text-white text-[#10px] font-bold tracking-widest uppercase rounded-full transition-all duration-300 shadow-sm flex items-center justify-center gpa-1.5 hover:scale-[1.01]"
            >
              입장하기
            </button>
          </form>

          {/* 소셜로그인 */}

          {/* 가입링크 */}
          <div className="text-center pt-2">
            <button
              // onClick={() => goTo("register")}
              className="text-[10px] font-bold text-[#6B8E23] hover:text-[#4A5D4E] transition border-b border-dashed border-[#6B8E23] pb-0.5 tracking-wider"
            >
              처음이신가요? 회원가입하기 〉
            </button>
          </div>
        </section>
      </main>

      <footer className="p-6 text-center text-[10px] text-gray-400 border-t border-gray-200/10 max-w-6xl w-full mx-auto">
        <span>𒀭 FOCUS ROOM. A silent sanctuary</span>
      </footer>
    </div>
  );
}
