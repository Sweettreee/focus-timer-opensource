import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Play, Pause, RotateCcw, Award, BrainCircuit, Save, SkipForward, Square } from 'lucide-react';
import PlantModel from './PlantModel';
import FaceCamera from './FaceCamera';
import { useSessionController } from '../history/useSessionController';

export default function FocusTimer() {
  const { addSession } = useSessionController();
  const [duration, setDuration] = useState(25 * 60);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [showAwayModal, setShowAwayModal] = useState(false);
  const [showMemoOverlay, setShowMemoOverlay] = useState(false);
  const [memoText, setMemoText] = useState('');
  const [portalTarget, setPortalTarget] = useState(null);

  const timerIntervalRef = useRef(null);

  useEffect(() => {
    const locatePortal = () => {
      const el = document.getElementById('camera-portal-root');
      if (el) {
        setPortalTarget(el);
      } else {
        let count = 0;
        const interval = setInterval(() => {
          const retryEl = document.getElementById('camera-portal-root');
          count++;
          if (retryEl) {
            setPortalTarget(retryEl);
            clearInterval(interval);
          } else if (count > 10) {
            clearInterval(interval);
          }
        }, 100);
        return () => clearInterval(interval);
      }
    };
    locatePortal();
  }, []);

  // 파생 변수
  const durationInMinutes = Math.floor(duration / 60);
  const isModalOpen = showAwayModal || showMemoOverlay;

  // 1. 타이머 인터벌 관리 (시간 깎기 전담)
  useEffect(() => {
    if (isRunning) {
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft((prev) => Math.max(0, prev - 1)); // 0 밑으로 안 내려가게 방어
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [isRunning]);

  // 2. 0초 도달 감지 전담
  useEffect(() => {
    if (isRunning && timeLeft === 0) {
      handleTimerComplete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, isRunning]);

  // 타이머가 0:00에 도달하면 메모 오버레이 표시 (식물은 다 자란 상태로 정지 유지)
  const handleTimerComplete = () => {
    setIsRunning(false);
    setShowMemoOverlay(true);
  };

  const handleStartPause = () => {
    if (showAwayModal) setShowAwayModal(false);
    setIsRunning(!isRunning);
  }

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(duration);
    setShowAwayModal(false);
  };

  // Log/End 버튼: 타이머·영상 정지 후 메모 오버레이 표시 (timeLeft는 그대로 둬 식물이 진행 위치에 멈춤)
  const handleEndClick = () => {
    setIsRunning(false);
    setShowMemoOverlay(true);
  };

  // 메모 저장/건너뛰기 시 세션을 기록하고 타이머·식물 영상을 처음으로 리셋
  const commitSession = (memo) => {
    // 실제로 몰입한 시간(경과 시간)을 분 단위로 기록합니다.
    // 단, 1초 이상 집중 시 최소 1분 이상으로 계산되어 시연 및 테스트에 무리가 없도록 합니다.
    const elapsedMinutes = Math.max(1, Math.floor((duration - timeLeft) / 60));
    addSession({ duration: elapsedMinutes, memo: memo ?? null });
    setShowMemoOverlay(false);
    setMemoText('');
    setShowAwayModal(false);
    setTimeLeft(duration);
  };

  const handleSaveMemo = () => commitSession(memoText.trim() || null);
  const handleSkipMemo = () => commitSession(null);

  const handleDurationChange = (newMinutes) => {
    if (isRunning) return;
    const newSeconds = newMinutes * 60;
    setDuration(newSeconds);
    setTimeLeft(newSeconds);
  };

  // AI 관련 핸들러
  const handleFaceLost = () => {
    setIsRunning((prev) => {
      if (prev) {
        setShowAwayModal(true);
        return false;
      }
      return prev;
    });
  };

  const handleFaceReturned = () => {
    if (aiEnabled && showAwayModal) {
      setShowAwayModal(false);
      setIsRunning(true);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="relative w-full flex-1 min-h-[510px] bg-white/60 backdrop-blur-md rounded-2xl border border-gray-100/80 flex flex-col items-center justify-between overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      
      {/* PlantModel 배경 레이어 (중앙 타이머 박스 전체를 가득 채움) */}
      <PlantModel duration={duration} timeLeft={timeLeft} isRunning={isRunning} />

      {/* 자리비움 모달 */}
      {showAwayModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[4px] rounded-2xl animate-fadeIn transition-all">
          <div className="bg-white/95 p-6 rounded-2xl shadow-2xl flex flex-col items-center text-center max-w-[260px] border border-gray-100 pointer-events-auto">
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
              <BrainCircuit className="w-6 h-6 text-emerald-500 animate-soft-pulse" />
            </div>
            <h3 className="font-bold text-[#1E293B] text-lg mb-1 tracking-tight">TARGET LOST</h3>
            <p className="text-[11px] text-gray-500 mb-5 leading-relaxed">
              자리 비움 감지로 일시 정지되었습니다.<br/>
              <span className="font-semibold text-emerald-600">돌아오시면 자동으로 재개됩니다.</span>
            </p>
            <button
              onClick={handleStartPause}
              className="w-full py-2.5 bg-[#6B8E23] hover:bg-[#5A7A1D] text-white text-[11px] font-bold tracking-widest uppercase rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <Play className="w-3 h-3 fill-white" /> Resume Now
            </button>
          </div>
        </div>
      )}

      {/* 세션 메모 입력 오버레이 */}
      {showMemoOverlay && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[4px] rounded-2xl animate-fadeIn transition-all">
          <div className="bg-white/95 p-6 rounded-2xl shadow-2xl flex flex-col items-center text-center w-[300px] max-w-full border border-gray-100 pointer-events-auto">
            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mb-3">
              <Award className="w-6 h-6 text-amber-500 animate-bounce" />
            </div>
            <h3 className="font-bold text-[#1E293B] text-lg mb-1 tracking-tight">집중 완료</h3>
            <p className="text-[11px] text-gray-500 mb-4 leading-relaxed">
              이번 세션을 한 줄로 남겨보세요.
              <span className="font-semibold text-[#6B8E23] block mt-1">
                ({durationInMinutes}분 기록)
              </span>
            </p>
            <textarea
              value={memoText}
              onChange={(e) => setMemoText(e.target.value)}
              placeholder="예: 챕터 3 정리 완료"
              rows={3}
              autoFocus
              className="w-full text-xs p-3 rounded-xl border border-gray-200 outline-none focus:border-[#6B8E23] transition-colors bg-white resize-none mb-4 text-[#333333]"
            />
            <div className="flex gap-2 w-full">
              <button
                onClick={handleSkipMemo}
                className="flex-grow py-2 bg-gray-100 hover:bg-gray-200 text-gray-500 text-[11px] font-bold uppercase rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <SkipForward className="w-3 h-3" /> 건너뛰기
              </button>
              <button
                onClick={handleSaveMemo}
                className="flex-grow py-2 bg-[#6B8E23] hover:bg-[#5A7A1D] text-white text-[11px] font-bold uppercase rounded-xl transition-colors shadow-md flex items-center justify-center gap-1.5"
              >
                <Save className="w-3 h-3" /> 저장
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. 상단 오버레이: 타이머 디스플레이 */}
      <div className={`absolute top-6 left-1/2 -translate-x-1/2 z-20 text-center w-full flex flex-col items-center transition-all duration-300 ${isModalOpen ? 'blur-sm scale-[0.98] pointer-events-none select-none' : ''}`}>
        <div className="text-[5.5rem] leading-none font-serif font-medium text-[#2D3748] tracking-tight drop-shadow-[0_2px_8px_rgba(255,255,255,0.7)] tabular-nums select-none pointer-events-none">
          {formatTime(timeLeft)}
        </div>
        
        <p className={`text-[11px] uppercase tracking-widest font-extrabold mt-3 flex items-center justify-center gap-1.5 select-none pointer-events-none ${
          isRunning ? 'text-[#6B8E23]' : 'text-gray-400'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-[#6B8E23] animate-soft-pulse' : 'bg-gray-300'}`}></span>
          {isRunning ? 'Focusing' : 'Paused'}
        </p>

        {/* 시간 설정 컨트롤 (정지 상태일 때만 은은하게 노출) */}
        <div className={`w-full max-w-[200px] mt-4 px-2 transition-all duration-300 ${isRunning ? 'opacity-0 pointer-events-none translate-y-1' : 'opacity-100 translate-y-0'}`}>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between gap-1 border border-gray-200/50 bg-white/70 backdrop-blur-md p-1 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              {[2, 25, 50].map((mins) => (
                <button
                  key={mins}
                  onClick={() => handleDurationChange(mins)}
                  className={`flex-1 py-1 text-[10px] font-bold rounded-lg transition-colors ${
                    durationInMinutes === mins ? 'bg-[#5A6E5D] text-white' : 'text-gray-400 hover:text-gray-700 hover:bg-white/60'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI 카메라 피드 - React Portal을 통해 왼쪽 사운드 컬럼 하단의 빈 공간으로 렌더링 전송 (기존 동작 100% 동일) */}
      {portalTarget && ReactDOM.createPortal(
        <div className={`w-full flex flex-col gap-4 z-20 transition-all duration-300 ${isModalOpen ? 'blur-sm scale-[0.98] pointer-events-none select-none' : ''}`}>
          <div className="w-full h-40 shadow-lg rounded-2xl overflow-hidden bg-[#1A1C23] border border-gray-800/40 relative">
            <FaceCamera 
              aiEnabled={aiEnabled} 
              isAiPaused={showAwayModal}
              onFaceLost={handleFaceLost} 
              onFaceReturned={handleFaceReturned}
            />
          </div>

          <div className="w-full border border-gray-100 rounded-xl p-3 flex justify-between items-center bg-white/50 backdrop-blur-sm shadow-sm transition-all duration-300">
            <div className="flex items-center gap-2 relative">
              <BrainCircuit className={`w-4 h-4 transition ${aiEnabled ? 'text-emerald-500' : 'text-gray-300'}`}/>
              <span className={`w-1.5 h-1.5 rounded-full absolute -top-0.5 -right-0.5 ${aiEnabled ? 'bg-emerald-400 animate-soft-pulse' : 'bg-gray-300'}`}></span>
              <span className="text-[11px] font-medium text-gray-500">AI Vision Assistant</span>
            </div>
            <button
              onClick={() => setAiEnabled(!aiEnabled)}
              className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition uppercase tracking-wider ${
                aiEnabled ? 'bg-[#F2F5E9] text-[#6B8E23]' : 'bg-gray-100 text-gray-400 hover:text-gray-600'
              }`}
            >
              {aiEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>,
        portalTarget
      )}

      {/* 2. 하단 오버레이: 메인 컨트롤 버튼들 */}
      <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-end justify-center gap-12 w-full transition-all duration-300 ${isModalOpen ? 'blur-sm scale-[0.98] pointer-events-none select-none' : ''}`}>
        
        {/* Reset 버튼 */}
        <div className="flex flex-col items-center gap-1.5">
          <button 
            onClick={handleReset} 
            className="w-12 h-12 rounded-full bg-white text-gray-600 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center justify-center hover:bg-gray-50 active:scale-95 transition disabled:opacity-35 disabled:pointer-events-none" 
            disabled={isRunning}
          >
            <RotateCcw className="w-4.5 h-4.5 text-gray-800" />
          </button>
          <span className="text-[10px] font-semibold text-gray-500 select-none">Reset</span>
        </div>
        
        {/* Play / Pause 버튼 */}
        <div className="flex flex-col items-center gap-1.5">
          <button 
            onClick={handleStartPause} 
            className="w-16 h-16 rounded-full text-white flex items-center justify-center shadow-[0_4px_12px_rgba(107,142,35,0.3)] hover:scale-105 active:scale-95 transition bg-[#6B8E23] hover:bg-[#5A7A1D]"
          >
            {isRunning ? (
              <Pause className="w-6 h-6 fill-white stroke-none" />
            ) : (
              <Play className="w-6 h-6 fill-white stroke-none ml-0.5" />
            )}
          </button>
          <span className="text-[10px] font-bold text-[#6B8E23] select-none">
            {isRunning ? 'Pause' : 'Start'}
          </span>
        </div>
        
        {/* End 버튼 */}
        <div className="flex flex-col items-center gap-1.5">
          <button 
            onClick={handleEndClick} 
            className="w-12 h-12 rounded-full bg-white text-gray-600 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center justify-center hover:bg-gray-50 hover:text-red-500 active:scale-95 transition"
          >
            <Square className="w-4.5 h-4.5 text-gray-800 fill-transparent" />
          </button>
          <span className="text-[10px] font-semibold text-gray-500 select-none">End</span>
        </div>

      </div>
    </div>
  );
}