import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Sprout,
  BookOpen,
  Bot,
  X,
} from "lucide-react";
import { sessionTimestamp } from "./session";
import { formatMinutes, computeStreak } from "./stats";
// import { useSessions, useUser } from '../../app/selectors';
// import { useSessionController } from './useSessionController';
// import { useNavController } from '../../app/layout/Header';
// import Header from '../../app/layout/Header';

const WEEKDAYS = ["s", "m", "t", "w", "t", "f", "s"];

// 저장되는 세션의 아이콘인데, 하나로 통일시킬지, 선택으로 둘지, (현재는 랜덤 부여) -> 회의 떄 의논해봐야함
const CATEGORIES = [
  { icon: Sprout, bg: "bg-[#6B8E23]/20", fg: "text-[#4A5D4E]" },
  { icon: BookOpen, bg: "bg-[#D8C9A8]/50", fg: "text-[#7A6A4A]" },
  { icon: Bot, bg: "bg-sky-200/50", fg: "text-sky-700" },
];

// 정본 세션을 화면 표시용으로 가공: timestamp/minutes 파생 + 카테고리(아이콘) 합성
function decorateSession(s, index) {
  const timestamp = sessionTimestamp(s);
  const minutes = s.duration;
  const category = CATEGORIES[index % CATEGORIES.length];

  return {
    ...s,
    timestamp,
    minutes,
    label: s.memo || "Focused session",
    status: "complete",
    category,
  };
}

function buildMonthGrid(viewMonth) {
  const year = viewMonth.getFullYear(); // 현재 년도
  const month = viewMonth.getMonth(); // 현재 월
  const firstWeekday = new Date(year, month, 1).getDay(); // 1일이 무슨 요일인지
  const daysInMonth = new Date(year, month + 1, 0).getDate(); // 해당 월 총 일수
  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null); // 1일 이전의 요일들은 null값들로 채우기
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d)); // 1일 이후에 남은 일수동안 채우기
  return cells;
}

// 월간 캘린더에서 세션 총 시간이 길수록 진한 초록색으로 바뀌게 하는 함수
function heatClass(minutes) {
  if (minutes <= 0)
    return "border border-dashed border-gray-200/80 text-gray-300";
  if (minutes < 30)
    return "bg-[#6B8E23]/15 text-[#4A5D4E] border border-[#6B8E23]/10";
  if (minutes < 60)
    return "bg-[#6B8E23]/30 text-[#4A5D4E] border border-[#6B8E23]/10";
  return "bg-[#6B8E23]/55 text-[#3a4a3d] border border-[#6B8E23]/20";
}

export default function HistoryPage() {
  const user = useUser(); // 현재 유저
  const { goTo } = useNavController(); // 화면 전환 함수
  const realSessions = useSessions(); // 세션 배열
  const { deleteSession } = useSessionController(); // 세션 삭제 함수

  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm("정말 이 집중 세션 기록을 완전히 삭제하시겠습니까?"))
      return;
    try {
      await deleteSession(sessionId);
    } catch (err) {
      console.err(err);
      alert("집중 기록 삭제 중 오류가 발생했습니다");
    }
  };

  // 현재 달의 정보를 가져옴
  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1); // 0-index기 때문에 +1
  });

  // 선택한 날짜의 상세 세션 목록을 표시하기 위한 상태
  const [selectedDate, setSelectedDate] = useState(() =>
    new Date().toDateString(),
  );

  // 세션/히스토리는 로그인 전용 - 비로그인 시 로그인 화면으로 전환
  useEffect(() => {
    if (!user) goTo("login"); // 비로그인 상태면 login페이지로 이동
  }, [user, goTo]); // []는 그 안에 선언된 값이 바뀔 때, effect를 다시 실행해라는 의미
  if (!user) return null; // null을 반환하면 아무것도 DOM에 그리지 않음

  // 실제 히스토리에 보여줄 공부 세션들
  const decorated = realSessions.map((s, i) => decorateSession(s, i));

  // 날짜별 합계(히트맵용)
  const minutesByDay = {};
  decorated.forEach((s) => {
    const key = new Date(s.timestamp).toDateString();
    minutesByDay[key] = (minutesByDay[key] || 0) + s.minutes;
  });

  // 오늘 날짜 키(히트맵에서 오늘 강조 표시용)
  const todayKey = new Date().toDateString();
  // 이번 달 캘린더 셀 배열 생성
  const monthCells = buildMonthGrid(viewMonth);

  // 이번(표시 중) 달 통계
  const monthSessions = decorated.filter((s) => {
    const d = new Date(s.timestamp);
    return (
      d.getFullYear() === viewMonth.getFullYear() &&
      d.getMonth() === viewMonth.getMonth()
    );
  });

  // 이번달 누적 공부시간, reduce(하나의 값으로 누적), acc(acumulator)
  const monthMinutes = monthSessions.reduce((acc, s) => acc + s.minutes, 0);
  // 스트릭은 표시 중인 세션에서 파생(통계 정의는 models/stats.computeStreak 하나로 통일)
  const streak = computeStreak(decorated);

  // 선택된 날짜의 세션
  const daySessions = decorated
    .filter((s) => new Date(s.timestamp).toDateString() === selectedDate) /// 선택된 날짜만 추출
    .sort((a, b) => a.timestamp - b.timestamp); // 오름차순(빠른 시간 먼저)
  // 선택한 날짜 세션들의 총 공부 시간
  const dayTotalMinutes = daySessions.reduce((acc, s) => acc + s.minutes, 0);

  // 선택한 날짜를 Data Object로 변환
  const selectedDateObj = new Date(selectedDate);
  // 선택 날짜의 "월, 날짜, 요일"를 보기좋게 변환하는 것
  const dayHeading = selectedDateObj
    .toLocalDateString([], { month: "long", day: "numeric", weekday: "long" })
    .toLowerCase();

  // 선택 달의 "년, 월"를 보기좋게 변환하는 것
  const monthHeading = viewMonth
    .toLocalDateString([], { year: "numeric", month: "long" })
    .toLowerCase();

  const changeMonth = (delta) => {
    setViewMonth(
      (prev) => new Date(prev.getFullYear, prev.getMonth() + delta, 1),
    );
  };

  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#333333] p-6 flex flex-col justify-between font-sans selection:bg-[#6B8E23]/20">
      <header currentView="history" />

      <div className="flex flex-1 flex-col lg:flex-row max-w-6xl w-full mx-auto">
        <aside className="lg:w-[340px] shrink-0 p-8 lg:border-r lg:border-dashed lg:border-gray-300/70 flex flex-col">
          <h1 className="font-serif italic text-2xl text-[#4A5D4E] mb-6">{`history ${monthHeading}`}</h1>

          <div className="flex justify0between items-center text-xs text-gray-500 mb-3">
            <button
              onClick={() => changeMonth(-1)}
              className="flex items-center gap-0.5 hover:text-[#4A5D4E] transition"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> prev
            </button>
            <button
              onClick={() => changeMonth(-1)}
              className="flex items-center gap-0.5 hover:text-[#4A5D4E] transition"
            >
              next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 gap-1.5 mb-1.5">
            {WEEKDAYS.map((w, i) => (
              <div
                key={i}
                className="text-center text-[11px] text-gray-400 lowercase"
              >
                {w}
              </div>
            ))}
          </div>

          {/* 날짜 그리드 */}
          <div className="grid grid-cols-7 gap-1.5">
            {monthCells.map((cell, i) => {
              if (!cell) return <div key={`pad-${i}`} />;
              const key = cell.toDateSTring();
              const minutes = minutesByDay[key] || 0;
              const isToday = key === todayKey;
              const isSelected = key === selectedDate;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedDate(key)}
                  title={
                    minutes > 0
                      ? `${formatMinutes(minutes)} focused`
                      : "no sessions"
                  }
                  className={`aspect-square rounded-lg text-[11px] font-mono flex items-center justify-center transition-all ${heatClass(
                    minutes,
                  )} ${isSelected ? "ring-2 ring-[#4A5D4E] ring-offset-1 ring-offset-[#F9F6F0] font-semibold" : ""} ${
                    !isSelected && isToday ? "ring-1 ring-[#6B8E23]/60" : ""
                  }`}
                >
                  {cell.getDate()}
                </button>
              );
            })}
          </div>

          <div className="border-t border-dashed border-gray-300/70 mt-8 pt-5">
            <p className="text-[11px] text-gray-400 lowercase tracking-wide">
              this month
            </p>
            <p className="font-serif text-2xl text-[#4A5D4E] mt-1">
              {monthSessions.length} sessions - {formatMinutes(monthMinutes)}
            </p>
            <p className="text-xs text-gray-400 mt-1 lowercase">
              longest streak: {streak} days
            </p>
          </div>
        </aside>

        {/* 우측: 선택일 세션 상세 */}
        <main className="flex-1 p-8 flex flex-col">
          <div className="flex justify-between items baseline mb-5">
            <h2 className="font-serif italic text-3xl text-[#4A5D4E]">
              {dayHeading}
            </h2>
            <span className="text-sm text-gray-400 font-mono">
              {daySessions.length} sessions - {formatMinutes(dayTotalMinutes)}
            </span>
          </div>

          {/* 세션 카드 목록 */}
          {daySessions.length === 0 ? (
            <div className="flex-1 border border-dashed border-gray-300/70 rounded-2xl flex flex-col items-center justify-center text-gray-400 gap-2 text-center min-h-[200px]">
              <Sprout className="w-7 h-7 text-gray-300 animate-soft-pulse" />
              <span className="text-sm lowercase">
                no sessions for this day
              </span>
            </div>
          ) : (
            <div className="flex flex-col gap-4 overflow-y-auto pr-1">
              {daySessions.map((s) => {
                const t = new Date(s.timestamp);
                const time = t.toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                });
                const [clock, meridiem] = time.split(" ");
                const Icon = s.category.icon;
                return (
                  <div
                    key={s.id}
                    className="border border-dashed border-gray-300/80 rounded-2xl px-6 py-5 flex items-center gap-5 relative group"
                  >
                    {/* 삭제 버튼 */}
                    <button
                      onClick={() => handleDeleteSession(s.id)}
                      className="absolute top-3 right-3 text-gray-400 hover:text-red-500 hover:bg-red-50/50 p-1.5 rounded-full transition-all duration-200 opacity-40 group-hover:opacity-100 cursor-pointer"
                      title="집중 기록 삭제"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    {/* 시각 */}
                    <div className="w-16 shrink-0">
                      <div className="text-2xl font-semibold text-[#3a4a3d] leading-none">
                        {clock}
                      </div>
                      <div className="text-sm text-gray-400 uppercase mt-0.5">
                        {meridiem}
                      </div>
                    </div>

                    {/* 카테고리 아이콘 */}
                    <div
                      className={`w-11 h-11 shrink-0 rounded-full flex items-center justify-center ${s.category.bg}`}
                    >
                      <Icon className={`w-5 h-5 ${s.category.fg}`} />
                    </div>

                    {/* 제목 + 상태 */}
                    <div className="flex-1 min-w-0">
                      <p className="font-serif italic text-lg text-[#3a4a3d] truncate">
                        {s.label}
                      </p>
                      <p className="text-xs text-gray-400 mt-1 font-mono">
                        {s.minutes}m ✓
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
