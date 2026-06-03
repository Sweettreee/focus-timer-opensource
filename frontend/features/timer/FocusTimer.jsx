import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { Play, Pause, RotateCcw, Award, BrainCircuit, Save, SkipForward } from 'lucide-react';
import PlantModel from './PlantModel';
import FaceCamera from './FaceCamera';
import { useSessionController } from '../history/useSessionController';

export default function FocusTimer() {
  const { addSession } = useSessionController();

  //상태 선언부

  //타이머관련
  const [totalTime, setTotalTime] = useState(25 * 60);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  //캠관련
  const [camPortal, setCamPortal] = useState(null);
  const [aiEnabled, setAiEnabled] = useState(true);         // AI Vision 켜짐여부
  const [showModal, setShowModal] = useState(false);       // 자리비움 모달

  //기타
  const [showMemoOverlay, setShowMemoOverlay] = useState(false);
  const [memoText, setMemoText] = useState('');

  const timerId = useRef(null);  //타이머 id 보관


  //타이머 메인 작동 로직


  useEffect(() => {
    if (isRunning) {
      timerId.current = setInterval(() => {
        setTimeLeft((prev) => Math.max(0, prev - 1));
      }, 1000);  //0초 오류 방지
    } else {
      clearInterval(timerId.current);
    }
    return () => clearInterval(timerId.current);
  }, [isRunning]);

  //완료 했을때
  const finishTimer = useCallback(() => {
    setIsRunning(false);
    setShowMemoOverlay(true);
  }, []);

  //0초 도달 했을때
  useEffect(() => {
    if (isRunning && timeLeft === 0) {
      finishTimer();
    }
  }, [timeLeft, isRunning, finishTimer]);


  //버튼, 이벤트


  //시작 리셋 로그 버튼
  const start = () => {
    if (showModal) setShowModal(false);
    setIsRunning(!isRunning);
  };

  const reset = () => {
    setIsRunning(false);
    setTimeLeft(totalTime);
    setShowModal(false);
  };

  const stopAndLog = () => {
    setIsRunning(false);
    setShowMemoOverlay(true);
  };

  // 타이머 초기화 해주는 함수
  const resetSessionStates = () => {
    setShowMemoOverlay(false);
    setMemoText('');
    setShowModal(false);
    setTimeLeft(totalTime);
  };

  // 백엔드 로커 저장
  const commitSession = (memo) => {
    const studySeconds = totalTime - timeLeft;

    //1초도 공부 안하면 리셋인데 이거 시간 늘려도 될듯 
    if (studySeconds <= 0) {
      resetSessionStates();
      return;
    }

    const studyMinutes = Math.max(1, Math.floor(studySeconds / 60));

    addSession({ duration: studyMinutes, memo: memo ?? null });
    resetSessionStates();
  };
  //메모 관련
  const saveMemo = () => commitSession(memoText.trim() || null);
  const skipMemo = () => commitSession(null);

  //다시 시작
  const changeTimerPreset = (newMinutes) => {
    if (isRunning) return;

    const newSeconds = newMinutes * 60;
    setTotalTime(newSeconds);
    setTimeLeft(newSeconds);
  };


  //캠부분 


  useEffect(() => {
    const portalElement = document.getElementById('camera-portal-root');
    if (portalElement) {
      setCamPortal(portalElement);
    }
  }, []);

  //시간 파생 변수들
  const totalMinutes = Math.floor(totalTime / 60);
  const isModalOpen = showModal || showMemoOverlay;


  //캠 사람 감지 함수들

  const userAway = () => {
    setIsRunning((prev) => {
      if (prev) setShowModal(true);
      return false;
    });
  };

  const userBack = () => {
    if (aiEnabled && showModal) {
      setShowModal(false);
      setIsRunning(true);
    }
  };

  // 시간 00:00 포맷
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };


  // ui파트
  return (
    <div className="w-full flex flex-col items-center justify-between h-full relative overflow-hidden">

      {/* AI 미감지 시 시야 차단하는 모달*/}
      {showModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[4px] rounded-2xl animate-fadeIn transition-all">
          <div className="bg-white/95 p-6 rounded-2xl shadow-2xl flex flex-col items-center text-center max-w-[260px] border border-gray-100 pointer-events-auto">
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
              <BrainCircuit className="w-6 h-6 text-emerald-500 animate-soft-pulse" />
            </div>
            <h3 className="font-bold text-[#1E293B] text-lg mb-1 tracking-tight">TARGET LOST</h3>
            <p className="text-[11px] text-gray-500 mb-5 leading-relaxed">
              자리 비움 감지로 일시 정지되었습니다.<br />
              <span className="font-semibold text-emerald-600">돌아오시면 자동으로 재개됩니다.</span>
            </p>
            <button
              onClick={start}
              className="w-full py-2.5 bg-[#6B8E23] hover:bg-[#5A7A1D] text-white text-[11px] font-bold tracking-widest uppercase rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <Play className="w-3 h-3 fill-white" /> Resume Now
            </button>
          </div>
        </div>
      )}

      {/* 집중 세션 종료 시 한 줄 남기기 모달 */}
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
                ({totalMinutes}분 기록)
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
                onClick={skipMemo}
                className="flex-grow py-2 bg-gray-100 hover:bg-gray-200 text-gray-500 text-[11px] font-bold uppercase rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <SkipForward className="w-3 h-3" /> 건너뛰기
              </button>
              <button
                onClick={saveMemo}
                className="flex-grow py-2 bg-[#6B8E23] hover:bg-[#5A7A1D] text-white text-[11px] font-bold uppercase rounded-xl transition-colors shadow-md flex items-center justify-center gap-1.5"
              >
                <Save className="w-3 h-3" /> 저장
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 시계 숫자 나오는 메인 디스플레이 */}
      <div className={`text-center z-10 w-full flex flex-col items-center mt-2 transition-all duration-300 ${isModalOpen ? 'blur-sm scale-[0.98] pointer-events-none select-none' : ''}`}>
        <div className="text-[5.5rem] leading-none font-mono font-medium text-[#333333] tabular-nums tracking-tight">
          {formatTime(timeLeft)}
        </div>

        <p className={`text-[11px] uppercase tracking-widest font-bold mt-4 flex items-center justify-center gap-1.5 ${isRunning ? 'text-[#6B8E23]' : 'text-gray-400'
          }`}>
          <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-[#6B8E23] animate-soft-pulse' : 'bg-gray-300'}`}></span>
          {isRunning ? 'Focusing' : 'Paused'}
        </p>

        {/* 2분 / 25분 / 50분 설정 탭 */}
        <div className={`w-full max-w-[280px] mt-6 px-2 transition-opacity duration-300 ${isRunning ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between gap-2 border border-gray-100/80 bg-white/50 p-1.5 rounded-xl transition">
              {[2, 25, 50].map((mins) => (
                <button
                  key={mins}
                  onClick={() => changeTimerPreset(mins)}
                  className={`flex-1 py-2 text-[11px] font-bold rounded-lg transition-colors ${totalMinutes === mins ? 'bg-[#6B8E23] text-white' : 'text-gray-400 hover:text-gray-700'
                    }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 중간: 식물 모델 컴포넌트 */}
      <div className={`relative my-6 flex items-center justify-center w-full flex-1 transition-all duration-300 ${isModalOpen ? 'blur-sm scale-[0.98] pointer-events-none select-none' : ''}`}>
        <PlantModel duration={totalTime} timeLeft={timeLeft} isRunning={isRunning} />
      </div>

      {/* 왼쪽 사이드바 하단 포탈로 사출되는 AI 카메라 피드 */}
      {camPortal && ReactDOM.createPortal(
        <div className={`w-full flex flex-col gap-4 z-20 transition-all duration-300 ${isModalOpen ? 'blur-sm scale-[0.98] pointer-events-none select-none' : ''}`}>
          <div className="w-full h-48 shadow-lg rounded-2xl overflow-hidden bg-[#1A1C23] border border-gray-800/40 relative">
            <FaceCamera
              aiEnabled={aiEnabled}
              isAiPaused={showModal}
              onFaceLost={userAway}
              onFaceReturned={userBack}
            />
          </div>

          {/* AI 조수 토글 스위치 */}
          <div className="w-full border border-gray-100 rounded-xl p-3 flex justify-between items-center bg-white/50 backdrop-blur-sm shadow-sm transition-all duration-300">
            <div className="flex items-center gap-2 relative">
              <BrainCircuit className={`w-4 h-4 transition ${aiEnabled ? 'text-emerald-500' : 'text-gray-300'}`} />
              <span className={`w-1.5 h-1.5 rounded-full absolute -top-0.5 -right-0.5 ${aiEnabled ? 'bg-emerald-400 animate-soft-pulse' : 'bg-gray-300'}`}></span>
              <span className="text-[11px] font-medium text-gray-500">AI Vision Assistant</span>
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

      {/* 하단 메인 타이머 리모컨 */}
      <div className={`flex flex-col items-center w-full z-10 gap-6 transition-all duration-300 ${isModalOpen ? 'blur-sm scale-[0.98] pointer-events-none select-none' : ''}`}>
        <div className="flex items-center gap-10">

          {/* 리셋 버튼 */}
          <button
            onClick={reset}
            className={`flex flex-col items-center gap-1 transition ${isRunning ? 'opacity-30 cursor-not-allowed text-gray-300' : 'text-gray-400 hover:text-gray-600'
              }`}
            disabled={isRunning}
          >
            <RotateCcw className="w-5 h-5" />
            <span className="text-[11px] font-semibold">Reset</span>
          </button>

          {/* 재생/일시정지 메인 버튼 */}
          <button
            onClick={start}
            className="w-16 h-16 rounded-full text-white flex items-center justify-center shadow-md transition-transform hover:scale-105 bg-[#5A6E5D] hover:bg-[#4A5D4E]"
          >
            {isRunning ? <Pause className="w-7 h-7 fill-white" /> : <Play className="w-7 h-7 fill-white ml-1" />}
          </button>

          {/* 세션 끝내고 기록 버튼 */}
          <button
            onClick={stopAndLog}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-red-500 transition"
          >
            <Award className="w-5 h-5" />
            <span className="text-[11px] font-semibold">Log/End</span>
          </button>

        </div>
      </div>
    </div>
  );
}
