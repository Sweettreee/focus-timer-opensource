import React, { useRef, useEffect } from 'react';

export default function PlantModel({ totalTime, timeLeft, isRunning }) {
  const videoRef = useRef(null); //html5 video에 직접 접근해 시간 관리
  const animationRef = useRef(null);  // requestAnimationFrame의 id 저장 정지할때 사용
  const lastSecondTimeRef = useRef(performance.now()); //정확한 시간 저장

  useEffect(() => {
    lastSecondTimeRef.current = performance.now();
  }, [timeLeft]);   //정확한 시간을 측정(밀리초)

  const progressPercent = ((totalTime - timeLeft) / totalTime) * 100;  //원형 바에 쓰는코드임 진행률

  //비디오 요소 가져오기
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateVideoTime = () => {
      if (video.duration && !video.seeking) { //중요코드 비디오 전체시간을 알고 탐색중이 아닐떄
        let targetVideoTime = 0;

        if (isRunning) {
          const timeSinceLastTick = (performance.now() - lastSecondTimeRef.current) / 1000;
          const fractionalSecond = Math.min(1.0, Math.max(0, timeSinceLastTick));

          // 남은시간과 한 시간 정밀하게
          const preciseTimeLeft = timeLeft - fractionalSecond;
          const preciseStudySeconds = totalTime - preciseTimeLeft;

          targetVideoTime = (preciseStudySeconds / totalTime) * video.duration;
        } else {
          targetVideoTime = ((totalTime - timeLeft) / totalTime) * video.duration;
        }

        let target = Math.max(0, Math.min(video.duration, targetVideoTime));

        //안전장치 
        if (timeLeft === 0) {
          target = video.duration - 0.1;
        }

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

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-96 h-96 rounded-full flex items-center justify-center relative bg-white/40 border border-gray-100/50 shadow-inner overflow-hidden">
        <video
          ref={videoRef}
          src="/video.mp4"
          muted
          playsInline
          preload="auto"
          className="absolute w-[350px] h-[350px] object-cover rounded-full select-none pointer-events-none z-10 mix-blend-multiply"
          style={{
            transform: 'scale(1.02)',
            transformOrigin: 'center center',
          }}
        />

        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none z-20">
          <circle cx="192" cy="192" r="180" fill="transparent" stroke="#F9F6F0" strokeWidth="2" className="opacity-30" />
          <circle
            cx="192"
            cy="192"
            r="180"
            fill="transparent"
            stroke="#6B8E23"
            strokeWidth="4.5"
            strokeDasharray={2 * Math.PI * 180}
            strokeDashoffset={2 * Math.PI * 180 * (1 - progressPercent / 100)}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
      </div>
    </div>
  );
}
