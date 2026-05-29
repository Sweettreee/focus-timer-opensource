import { useState } from "react";

export default function LoginPage() {
    const [email, setEmail] = useState(() => localStorage.getItem('logined_email') || '');
    const [password, setPassword] = useState(() => localStorage.getItem('logined_password') || '');
    // const [remember_me, setRememberMe] = useState(() => localStorage.getItem('remember_me') !== 'false');
    const [error, setError] = useState('');

    reutrn (
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
        </div>
    );
}