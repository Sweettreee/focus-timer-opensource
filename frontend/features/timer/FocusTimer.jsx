import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Play, Pause, RotateCcw, Award, BrainCircuit, Save, SkipForward, Square } from 'lucide-react';
import PlantModel from './PlantModel';
import FaceCamera from './FaceCamera';
import { useSessionController } from '../history/useSessionController';

export default function FocusTimer() {

  const { addSession } = useSessionController();
  //타이머 동작 관련
  const [totalTime, setTotalTime] = useState(25 * 60);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  //캠
  const [aiEnabled, setAiEnabled] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [camPortal, setCamPortal] = useState(null);

  //기록
  const [showMemoOverlay, setShowMemoOverlay] = useState(false);
  const [memoText, setMemoText] = useState('');

  // 파생 변수
  const totalMinutes = Math.floor(totalTime / 60);
  const isModalOpen = showModal || showMemoOverlay;

  // 메인 동작 코드 (React 표준 타이머 패턴 적용)
  useEffect(() => {
    if (!isRunning) return;

    // 시간이 다 되면 안전하게 타이머 종료 처리 호출
    if (timeLeft === 0) {
      handleTimerEnd();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timerId);
  }, [isRunning, timeLeft]);

  //끝났을때 (기존 finishTimer와 stopAndLog 통합)
  const handleTimerEnd = () => {
    setIsRunning(false);
    setShowMemoOverlay(true);
  };

  const handleStartPause = () => {
    if (showModal) setShowModal(false);
    setIsRunning(!isRunning);
  }

  const resetSessionStates = () => {
    setShowMemoOverlay(false);
    setMemoText('');
    setShowModal(false);
    setTimeLeft(totalTime);
  };

  const reset = () => {
    setIsRunning(false);
    resetSessionStates();
  };

  const commitSession = (memo) => {
    //기록 측정 1분이상으로 되게
    const studyMinutes = Math.max(1, Math.floor((totalTime - timeLeft) / 60));
    addSession({ duration: studyMinutes, memo: memo ?? null });
    resetSessionStates();
  };

  const saveMemo = () => commitSession(memoText.trim() || null);
  const skipMemo = () => commitSession(null);

  const changeTimerPreset = (newMinutes) => {
    if (isRunning) return;
    const newSeconds = newMinutes * 60;
    setTotalTime(newSeconds);
    setTimeLeft(newSeconds);
  };

  // 포털 엘리먼트 탐색 (안전한 1회성 + 소규모 폴백)
  useEffect(() => {
    const portalElement = document.getElementById('camera-portal-root');
    if (portalElement) {
      setCamPortal(portalElement);
      return;
    }

    // 마운트 직후 아주 잠깐 엇갈렸을 때를 위한 1회성/소규모 폴백
    let count = 0;
    const interval = setInterval(() => {
      const retryEl = document.getElementById('camera-portal-root');
      count++;
      if (retryEl) {
        setCamPortal(retryEl);
        clearInterval(interval);
      } else if (count > 5) {
        clearInterval(interval); // 5번(0.5초) 시도 후 깔끔하게 포기
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const userAway = () => {
    if (isRunning) {
      setIsRunning(false);
      setShowModal(true);
    }
  };

  const userBack = () => {
    if (aiEnabled && showModal) {
      setShowModal(false);
      setIsRunning(true);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="relative w-full flex-1 min-h-[500px] bg-white/60 backdrop-blur-md rounded-2xl border border-gray-200/50 flex flex-col items-center justify-between overflow-hidden shadow-sm hover:shadow-md transition-all">

      {/* PlantModel 배경 레이어 (중앙 타이머 박스 전체를 가득 채움) */}
      <PlantModel totalTime={totalTime} timeLeft={timeLeft} isRunning={isRunning} />

      {/* 자리비움 모달 */}
      {showModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-2xl animate-fadeIn transition-all">
          <div className="bg-white/95 p-6 rounded-2xl shadow-xl flex flex-col items-center text-center max-w-[260px] border border-gray-100 pointer-events-auto">
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
              <BrainCircuit className="w-6 h-6 text-emerald-500 animate-soft-pulse" />
            </div>
            <h3 className="font-bold text-gray-800 text-lg mb-1 tracking-tight">TARGET LOST</h3>
            <p className="text-xs text-gray-500 mb-5 leading-relaxed">
              자리 비움 감지로 일시 정지되었습니다.<br />
              <span className="font-semibold text-emerald-600">돌아오시면 자동으로 재개됩니다.</span>
            </p>
            <button
              onClick={handleStartPause}
              className="w-full py-2.5 bg-[#6B8E23] hover:bg-[#5A7A1D] text-white text-xs font-bold tracking-widest uppercase rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <Play className="w-3 h-3 fill-white" /> Resume Now
            </button>
          </div>
        </div>
      )}

      {/* 세션 메모 입력 오버레이 */}
      {showMemoOverlay && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-2xl animate-fadeIn transition-all">
          <div className="bg-white/95 p-6 rounded-2xl shadow-xl flex flex-col items-center text-center w-[300px] max-w-full border border-gray-100 pointer-events-auto">
            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mb-3">
              <Award className="w-6 h-6 text-amber-500 animate-bounce" />
            </div>
            <h3 className="font-bold text-gray-800 text-lg mb-1 tracking-tight">집중 완료</h3>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              이번 세션을 한 줄로 남겨보세요.
              <span className="font-semibold text-[#6B8E23] block mt-1">
                ({totalMinutes}분 기록)
              </span>
            </p>
            <textarea
              value={memoText}
              onChange={(e) => setMemoText(e.target.value)}
              placeholder="예: 챕터 3 정리 완료"
              rows={3}
              autoFocus
              className="w-full text-xs p-3 rounded-xl border border-gray-200 outline-none focus:border-[#6B8E23] transition-colors bg-white resize-none mb-4 text-gray-700"
            />
            <div className="flex gap-2 w-full">
              <button
                onClick={skipMemo}
                className="flex-grow py-2 bg-gray-100 hover:bg-gray-200 text-gray-500 text-xs font-bold uppercase rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <SkipForward className="w-3 h-3" /> 건너뛰기
              </button>
              <button
                onClick={saveMemo}
                className="flex-grow py-2 bg-[#6B8E23] hover:bg-[#5A7A1D] text-white text-xs font-bold uppercase rounded-xl transition-colors shadow-md flex items-center justify-center gap-1.5"
              >
                <Save className="w-3 h-3" /> 저장
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. 상단 오버레이: 타이머 디스플레이 */}
      <div className={`absolute top-6 left-1/2 -translate-x-1/2 z-20 text-center w-full flex flex-col items-center transition-all duration-300 ${isModalOpen ? 'blur-sm scale-95 opacity-80 pointer-events-none select-none' : ''}`}>
        <div className="text-[5.5rem] leading-none font-serif font-medium text-[#2D3748] tracking-tight drop-shadow-md tabular-nums select-none pointer-events-none">
          {formatTime(timeLeft)}
        </div>

        <p className={`text-[11px] uppercase tracking-widest font-extrabold mt-3 flex items-center justify-center gap-1.5 select-none pointer-events-none ${isRunning ? 'text-[#6B8E23]' : 'text-gray-400'
          }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-[#6B8E23] animate-soft-pulse' : 'bg-gray-300'}`}></span>
          {isRunning ? 'Focusing' : 'Paused'}
        </p>

        {/* 시간 설정 컨트롤 (정지 상태일 때만 은은하게 노출) */}
        <div className={`w-full max-w-[200px] mt-4 px-2 transition-all duration-300 ${isRunning ? 'opacity-0 pointer-events-none translate-y-1' : 'opacity-100 translate-y-0'}`}>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between gap-1 border border-gray-200/50 bg-white/70 backdrop-blur-md p-1 rounded-xl shadow-sm">
              {[2, 25, 50].map((mins) => (
                <button
                  key={mins}
                  onClick={() => changeTimerPreset(mins)}
                  className={`flex-1 py-1 text-[10px] font-bold rounded-lg transition-colors ${totalMinutes === mins ? 'bg-[#5A6E5D] text-white' : 'text-gray-500 hover:text-gray-800 hover:bg-white/60'
                    }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI 카메라 피드 - React Portal을 통해 왼쪽 사운드 컬럼 하단의 빈 공간으로 렌더링 전송 */}
      {camPortal && ReactDOM.createPortal(
        <div className={`w-full flex flex-col gap-4 z-20 transition-all duration-300 ${isModalOpen ? 'blur-sm scale-95 opacity-80 pointer-events-none select-none' : ''}`}>
          <div className="w-full h-40 shadow-md rounded-2xl overflow-hidden bg-[#1A1C23] border border-gray-800/40 relative">
            <FaceCamera
              aiEnabled={aiEnabled}
              isAiPaused={showModal}
              onFaceLost={userAway}
              onFaceReturned={userBack}
            />
          </div>

          <div className="w-full border border-gray-200/60 rounded-xl p-3 flex justify-between items-center bg-white/50 backdrop-blur-sm shadow-sm transition-all duration-300">
            <div className="flex items-center gap-2 relative">
              <BrainCircuit className={`w-4 h-4 transition-colors ${aiEnabled ? 'text-emerald-500' : 'text-gray-400'}`} />
              <span className={`w-1.5 h-1.5 rounded-full absolute -top-0.5 -right-0.5 ${aiEnabled ? 'bg-emerald-400 animate-soft-pulse' : 'bg-gray-300'}`}></span>
              <span className="text-xs font-medium text-gray-600">AI Vision Assistant</span>
            </div>
            <button
              onClick={() => setAiEnabled(!aiEnabled)}
              className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition uppercase tracking-wider ${aiEnabled ? 'bg-[#F2F5E9] text-[#6B8E23]' : 'bg-gray-100 text-gray-400 hover:text-gray-600'
                }`}
            >
              {aiEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>,
        camPortal
      )}

      {/* 2. 하단 오버레이: 메인 컨트롤 버튼들 */}
      <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-end justify-center gap-12 w-full transition-all duration-300 ${isModalOpen ? 'blur-sm scale-95 opacity-80 pointer-events-none select-none' : ''}`}>

        {/* Reset 버튼 */}
        <div className="flex flex-col items-center gap-1.5">
          <button
            onClick={reset}
            className="w-12 h-12 rounded-full bg-white text-gray-600 border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 active:scale-95 transition disabled:opacity-50 disabled:pointer-events-none"
            disabled={isRunning}
          >
            <RotateCcw className="w-5 h-5 text-gray-700" />
          </button>
          <span className="text-[10px] font-semibold text-gray-500 select-none">Reset</span>
        </div>

        {/* Play / Pause 버튼 */}
        <div className="flex flex-col items-center gap-1.5">
          <button
            onClick={handleStartPause}
            className="w-16 h-16 rounded-full text-white flex items-center justify-center shadow-lg shadow-[#6B8E23]/30 hover:scale-105 active:scale-95 transition-transform bg-[#6B8E23] hover:bg-[#5A7A1D]"
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
            onClick={handleTimerEnd}
            disabled={timeLeft === totalTime}
            className="w-12 h-12 rounded-full bg-white text-gray-600 border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 hover:text-red-500 active:scale-95 transition disabled:opacity-50 disabled:pointer-events-none"
          >
            <Square className="w-5 h-5 text-gray-700 fill-transparent" />
          </button>
          <span className="text-[10px] font-semibold text-gray-500 select-none">End</span>
        </div>

      </div>
    </div>
  );
}
