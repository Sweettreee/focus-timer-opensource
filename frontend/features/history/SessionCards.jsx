import { Award, Clock, NotebookPen } from "lucide-react";
import { useSessions } from "../../app/selectors";

export default function SessionCards() {
  const sessions = useSessions();

  // 최신순 (배열에는 오래된 순으로 push 되므로 뒤집어서 표시)
  const orderedSessions = [...sessions].reverse();

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white/60 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col min-h-0 flex-1">
      <div className="mb-2">
        <h2 className="text-xs font-bold text-[#4A5D4E]/80 uppercase tracking-widest flex items-center gap-1">
          <NotebookPen className="w-3.5 h-3.5 text-[#6B8E23]" /> Session Cards
        </h2>
        <p className="text-[10px] text-gray-400">
          your focus sessions, newest first
        </p>
      </div>

      {orderedSessions.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 gap-1 py-4">
          <Award className="w-5 h-5 text-gray-300 animate-soft-pulse" />
          <span className="text-[10px]">아직 기록된 세션이 없습니다.</span>
          <span className="text-[9px] text-gray-400">
            타이머를 완료하면 카드가 쌓입니다!
          </span>
        </div>
      ) : (
        <div className="space-y-2 overflow-y-auto flex-1 min-h-0 pr-1">
          {orderedSessions.map((s) => (
            <div
              key={s.id}
              className="bg-white/60 backdrop-blur-md rounded-xl p-2.5 border border-gray-100 shadow-sm"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="flex items-center gap-1 text-[10px] font-bold font-mono text-[#6B8E23] bg-[#6B8E23]/10 px-2 py-0.5 rounded-md">
                  <Clock className="w-3 h-3" /> {s.duration}min
                </span>
                <span className="text-[9px] text-gray-400 font-mono">
                  {formatDate(s.session_date)}
                </span>
              </div>
              {s.memo ? (
                <p className="text-[11px] text-gray-600 leading-relaxed break-words">
                  {s.memo}
                </p>
              ) : (
                <p className="text-[10px] text-gray-300 italic">메모 없음</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
