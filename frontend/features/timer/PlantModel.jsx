import React, { useRef, useEffect } from 'react';

export default function PlantModel({ totalTime, timeLeft, isRunning }) {
  const videoRef = useRef(null);
  const animationRef = useRef(null);

  //타이머 갱신 시점 저장
  const lastSecondTimeRef = useRef(performance.now());

  useEffect(() => {
    lastSecondTimeRef.current = performance.now();
  }, [timeLeft]);

  // 공부 진행률
  const progressPercent = ((totalTime - timeLeft) / totalTime) * 100;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateVideoTime = () => {

      if (video.duration && !video.seeking) {
        let studySeconds = totalTime - timeLeft;

        if (isRunning) {
          const timeSinceLastTick = (performance.now() - lastSecondTimeRef.current) / 1000;
          const fractionalSecond = Math.min(1.0, Math.max(0, timeSinceLastTick));
          studySeconds += fractionalSecond;
        }

        let targetVideoTime = (studySeconds / totalTime) * video.duration;

        // 검은화면 방지
        let target = Math.max(0, Math.min(video.duration, targetVideoTime));
        if (timeLeft === 0) {
          target = video.duration - 0.1;
        }

        // 오버헤드 방지
        if (Math.abs(video.currentTime - target) > 0.01 || timeLeft === 0) {
          video.currentTime = target;
        }
      }
      animationRef.current = requestAnimationFrame(updateVideoTime);
    };

    animationRef.current = requestAnimationFrame(updateVideoTime);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [totalTime, timeLeft, isRunning]);

  // 원형 진행바
  const radius = 190;
  const totalLength = (240 / 360) * 2 * Math.PI * radius;
  const startAngle = 150;

  const arcAngle = 240;
  const currentAngle = startAngle + (progressPercent / 100) * arcAngle;
  const angleRad = (currentAngle * Math.PI) / 180;

  const knobX = 200 + radius * Math.cos(angleRad);
  const knobY = 200 + radius * Math.sin(angleRad);

  return (
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden rounded-2xl bg-[#F9F6F0]">
      {/*배경 식물*/}
      <video
        ref={videoRef}
        src="/video.mp4"
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover object-center select-none pointer-events-none scale-[1.05]"
      />

      {/*원형 진행바*/}
      <svg
        viewBox="0 0 400 400"
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      >
        {/* 가이드 라인*/}
        <path
          d="M 35.46 295 A 190 190 0 1 1 364.54 295"
          fill="transparent"
          stroke="#D5CFC5"
          strokeWidth="1.2"
          strokeDasharray="3 4"
          className="opacity-60"
        />
        {/* 실시간 진행 게이지*/}
        <path
          d="M 35.46 295 A 190 190 0 1 1 364.54 295"
          fill="transparent"
          stroke="#6B8E23"
          strokeWidth="3.5"
          strokeDasharray={totalLength}
          strokeDashoffset={totalLength * (1 - progressPercent / 100)}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-linear"
        />
        {/* 게이지 끝*/}
        {progressPercent > 0 && (
          <circle
            cx={knobX}
            cy={knobY}
            r="4.5"
            fill="white"
            stroke="#6B8E23"
            strokeWidth="2.5"
            className="transition-all duration-1000 ease-linear shadow-md shadow-black/10"
          />
        )}
      </svg>
    </div>
  );
}
