import React, { useRef, useEffect } from 'react';

export default function PlantModel({ duration, timeLeft, isRunning }) {
  const videoRef = useRef(null);
  const requestRef = useRef(null);
  
  // 마지막으로 timeLeft가 변경된 시점의 고정밀 타임스탬프 기록용 Ref
  const lastSecondTimeRef = useRef(performance.now());
  const prevTimeLeftRef = useRef(timeLeft);

  // timeLeft가 변경(매 초 차감)될 때마다 타임스탬프 갱신
  useEffect(() => {
    if (timeLeft !== prevTimeLeftRef.current) {
      lastSecondTimeRef.current = performance.now();
      prevTimeLeftRef.current = timeLeft;
    }
  }, [timeLeft]);

  // 진행률 (0 ~ 100) - 원형 테두리 게이지용
  const progressPercent = ((duration - timeLeft) / duration) * 100;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateVideoTime = () => {
      // 🌟 [핵심 개선] HTML5 비디오는 디코딩 버퍼링 중(seeking === true)에 
      // 새로운 탐색(Seek) 요청을 받으면 화면이 극심하게 버벅이고 굳어버립니다.
      // 디코더가 준비된 상태(!video.seeking)일 때만 정밀 갱신을 수행해 뚝뚝 끊김을 완전히 해결합니다!
      if (video.duration && !video.seeking) {
        let targetTime = 0;

        if (isRunning) {
          // 60fps 수준의 극강의 선형 연산을 위해 밀리초 단위 보간
          const timeSinceLastTick = (performance.now() - lastSecondTimeRef.current) / 1000;
          const currentSecondFraction = Math.min(1.0, Math.max(0, timeSinceLastTick));
          
          const smoothTimeLeft = timeLeft - currentSecondFraction;
          const smoothElapsed = duration - smoothTimeLeft;
          
          targetTime = (smoothElapsed / duration) * video.duration;
        } else {
          targetTime = ((duration - timeLeft) / duration) * video.duration;
        }

        // 🌟 [안전 장치] 비디오 파일의 극말미에 간혹 숨겨져 있는 '검은색 빈 프레임' 노출 방지
        // 0.1초의 미세 버퍼를 두어 가장 화려하게 만개한 마지막 식물 프레임이 안전하게 고정되도록 만듭니다.
        let target = Math.max(0, Math.min(video.duration, targetTime));
        if (timeLeft === 0) {
          target = video.duration - 0.1;
        }

        // 이전 프레임과 미세한 차이가 있을 때만 프레임 이동 요청을 날려 브라우저 오버헤드를 막습니다.
        if (Math.abs(video.currentTime - target) > 0.01 || timeLeft === 0) {
          video.currentTime = target;
        }
      }
      requestRef.current = requestAnimationFrame(updateVideoTime);
    };

    requestRef.current = requestAnimationFrame(updateVideoTime);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [duration, timeLeft, isRunning]);

  // viewBox (400x400) 기준 반경 190으로 원형 진행바 설계 (아래쪽이 뚫린 240도 아크)
  const radius = 190;
  const totalLength = (240 / 360) * 2 * Math.PI * radius;
  
  // 150도(8시 방향)에서 시작하여 시계방향으로 240도 회전 (4시 방향에서 종료)
  const startAngle = 150;
  const arcAngle = 240;
  const currentAngle = startAngle + (progressPercent / 100) * arcAngle;
  const angleRad = (currentAngle * Math.PI) / 180;
  
  // 노브의 X, Y 좌표 계산
  const knobX = 200 + radius * Math.cos(angleRad);
  const knobY = 200 + radius * Math.sin(angleRad);

  return (
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden rounded-2xl bg-[#F9F6F0]">
      {/* 1. 배경을 가득 채우는 성장 비디오 */}
      <video
        ref={videoRef}
        src="/video.mp4"
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover object-bottom select-none pointer-events-none transition-all duration-700"
      />
      
      {/* 2. 식물을 아름답게 감싸는 미니멀 원형 진행바 (SVG, viewBox 400x400 고정계) */}
      <svg 
        viewBox="0 0 400 400" 
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      >
        {/* 외곽 가이드 점선 링 (240도 아크) */}
        <path 
          d="M 35.46 295 A 190 190 0 1 1 364.54 295" 
          fill="transparent" 
          stroke="#D5CFC5" 
          strokeWidth="1.2" 
          strokeDasharray="3 4"
          className="opacity-60" 
        />
        {/* 실시간 적층 게이지 (240도 아크) */}
        <path
          d="M 35.46 295 A 190 190 0 1 1 364.54 295"
          fill="transparent"
          stroke="#6B8E23" // 기존 올리브 그린 색상 유지
          strokeWidth="3.5"
          strokeDasharray={totalLength}
          strokeDashoffset={totalLength * (1 - progressPercent / 100)}
          strokeLinecap="round"
          className="transition-all duration-300 ease-out"
        />
        {/* 게이지 끝자락에서 정교하게 같이 도는 둥근 노브(Knob Dot) */}
        {progressPercent > 0 && (
          <circle
            cx={knobX}
            cy={knobY}
            r="4.5"
            fill="white"
            stroke="#6B8E23"
            strokeWidth="2.5"
            className="transition-all duration-300 ease-out shadow-[0_2px_6px_rgba(0,0,0,0.1)]"
          />
        )}
      </svg>
    </div>
  );
}