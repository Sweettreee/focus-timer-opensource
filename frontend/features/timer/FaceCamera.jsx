import React, { useState, useEffect, useRef } from 'react';
import { Video, VideoOff } from 'lucide-react';
import { FaceDetector, FilesetResolver } from '@mediapipe/tasks-vision';

export default function FaceCamera({ aiEnabled, isAiPaused, onFaceLost, onFaceReturned }) {
  const [webcamActive, setWebcamActive] = useState(false);
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  const videoRef = useRef(null);
  const detectorRef = useRef(null);
  const requestRef = useRef(null);

  const faceLostTimeRef = useRef(null);
  const faceReturnedTimeRef = useRef(null);

  const lastVideoTimeRef = useRef(-1);

  // 최신 props 참조
  const propsRef = useRef({ aiEnabled, isAiPaused, onFaceLost, onFaceReturned });
  useEffect(() => {
    propsRef.current = { aiEnabled, isAiPaused, onFaceLost, onFaceReturned };
  }, [aiEnabled, isAiPaused, onFaceLost, onFaceReturned]);

  // AI Vision Assistant 스위치와 웹캠 동작 연동
  useEffect(() => {
    setWebcamActive(aiEnabled);
  }, [aiEnabled]);

  // 1. MediaPipe 모델 초기화
  useEffect(() => {
    const initModel = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        detectorRef.current = await FaceDetector.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
            delegate: "GPU"
          },
          runningMode: "VIDEO"
        });
        setIsModelLoaded(true);
      } catch (error) {
        console.error("AI 모델 로딩 실패:", error);
      }
    };
    initModel();
  }, []);

  // 2. 웹캠 켜기/끄기
  useEffect(() => {
    let stream = null;
    if (webcamActive) {
      navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } })
        .then((s) => {
          stream = s;
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(err => {
          console.error("카메라 권한 오류:", err);
          setWebcamActive(false);
        });
    }

    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [webcamActive]);

  // 3. 매 프레임 스캔 (Race Condition 완벽 대응)
  const predictWebcam = () => {
    // 카메라가 꺼져있다면 즉시 루프 중단
    if (!webcamActive) return;

    // 카메라나 AI 모델이 덜 준비된 상태라면 죽지 않고 다음 프레임 예약 후 대기!
    if (!detectorRef.current || !videoRef.current) {
      requestRef.current = requestAnimationFrame(predictWebcam);
      return;
    }

    // 정상 상태이므로 다음 프레임 예약 후 판별 시작
    requestRef.current = requestAnimationFrame(predictWebcam);

    try {
      if (videoRef.current.currentTime !== lastVideoTimeRef.current) {
        lastVideoTimeRef.current = videoRef.current.currentTime;

        const startTimeMs = performance.now();
        const detections = detectorRef.current.detectForVideo(videoRef.current, startTimeMs);

        // --- 얼굴 감지 성공 ---
        if (detections && detections.detections.length > 0) {
          setIsFaceDetected(true);
          faceLostTimeRef.current = null; // 자리비움 초기화

          const { aiEnabled, isAiPaused, onFaceReturned } = propsRef.current;

          if (aiEnabled && isAiPaused) {
            if (!faceReturnedTimeRef.current) {
              faceReturnedTimeRef.current = Date.now();
            } else if (Date.now() - faceReturnedTimeRef.current > 1500) {
              onFaceReturned();
              faceReturnedTimeRef.current = null;
            }
          } else {
            faceReturnedTimeRef.current = null;
          }
        }
        // --- 얼굴 놓침 ---
        else {
          setIsFaceDetected(false);
          faceReturnedTimeRef.current = null; // 돌아옴 초기화

          if (propsRef.current.aiEnabled) {
            if (!faceLostTimeRef.current) {
              faceLostTimeRef.current = Date.now();
            } else if (Date.now() - faceLostTimeRef.current > 500) {
              propsRef.current.onFaceLost();
              faceLostTimeRef.current = null;
            }
          }
        }
      }
    } catch (error) {
      console.warn("AI 프레임 스킵됨");
    }
  };

  return (
    <div className="w-full h-full bg-[#1A1C23] rounded-2xl overflow-hidden border border-gray-800 shadow-2xl flex flex-col justify-between group relative transition-all duration-300 z-30">
      {webcamActive ? (
        <video
          ref={videoRef} autoPlay playsInline muted onLoadedData={predictWebcam}
          className="w-full h-full object-cover scale-x-[-1]"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#1A1C23] text-gray-500 p-2 text-[10px] text-center gap-1">
          <VideoOff className="w-5 h-5 opacity-40 text-gray-400" />
          <span>Camera Off</span>
        </div>
      )}

      {/* 오버레이 UI */}
      <div className="absolute inset-0 flex flex-col justify-between p-2 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-black/40 overflow-hidden">
        <div className="flex justify-between items-start">
          <span className="text-[7px] font-mono text-white/80 bg-black/60 px-1 rounded-sm tracking-wider tabular-nums">
            {!isModelLoaded ? 'LOADING AI...' : webcamActive ? 'FEED ACTIVE' : 'NO FEED'}
          </span>
          <span className={`w-1.5 h-1.5 rounded-full ${!webcamActive ? 'bg-gray-500' : isFaceDetected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500 animate-ping'}`}></span>
        </div>
        {webcamActive && (
          <div className="text-[7px] text-emerald-400 font-mono leading-tight bg-black/40 px-1 py-0.5 rounded backdrop-blur-sm w-fit transition-opacity duration-300">
            TARGET: {isFaceDetected ? 'LOCKED' : 'LOST'}
          </div>
        )}
      </div>

      {/* 토글 버튼 */}
      <button
        onClick={() => setWebcamActive(!webcamActive)}
        disabled={!isModelLoaded}
        className="absolute bottom-1.5 right-1.5 p-1.5 bg-white/10 hover:bg-white/90 text-white hover:text-gray-900 rounded-md pointer-events-auto transition backdrop-blur-md opacity-0 group-hover:opacity-100 shadow-lg"
      >
        {webcamActive ? <VideoOff className="w-3 h-3" /> : <Video className="w-3 h-3" />}
      </button>
    </div>
  );
}
