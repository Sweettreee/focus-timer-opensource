import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, CloudRain, TreePine, Waves, Radio, Play, Pause, Compass } from 'lucide-react';
import ambientSynthInstance from './ambientSynth';

export default function AmbientMixer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volumes, setVolumes] = useState({
    rain: 30,
    forest: 0,
    water: 0,
    whiteNoise: 0,
  });

  const [activePreset, setActivePreset] = useState('Custom');

  const presets = {
    'Rainy Study': { rain: 60, forest: 10, water: 0, whiteNoise: 15 },
    'Forest Walk': { rain: 0, forest: 70, water: 30, whiteNoise: 0 },
    'Deep Focus': { rain: 20, forest: 0, water: 0, whiteNoise: 50 },
    'Ocean Breeze': { rain: 10, forest: 20, water: 65, whiteNoise: 0 },
    'Mute All': { rain: 0, forest: 0, water: 0, whiteNoise: 0 },
  };

  useEffect(() => {
    // 마운트 시 오디오 컨트롤 시작할 준비만 해 둠
    return () => {
      // 컴포넌트 언마운트 시 오디오 리소스 해제
      ambientSynthInstance.stop();
    };
  }, []);

  const handleMasterToggle = () => {
    if (isPlaying) {
      ambientSynthInstance.stop();
      setIsPlaying(false);
    } else {
      ambientSynthInstance.start();
      // 기존 볼륨들 갱신
      Object.keys(volumes).forEach((key) => {
        ambientSynthInstance.setVolume(key, volumes[key]);
      });
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (soundKey, val) => {
    const newVol = parseInt(val, 10);
    setVolumes((prev) => {
      const updated = { ...prev, [soundKey]: newVol };
      // 프리셋 조건 검사 (프리셋 값이랑 수동 수정이랑 다르면 Custom으로 변경)
      setActivePreset('Custom');
      return updated;
    });

    if (isPlaying) {
      ambientSynthInstance.setVolume(soundKey, newVol);
    }
  };

  const applyPreset = (presetName) => {
    const presetVols = presets[presetName];
    setVolumes(presetVols);
    setActivePreset(presetName);

    if (isPlaying) {
      Object.keys(presetVols).forEach((key) => {
        ambientSynthInstance.setVolume(key, presetVols[key]);
      });
    } else if (presetName !== 'Mute All') {
      // 플레이 중이 아니었으면 플레이 활성화하면서 프리셋 적용
      ambientSynthInstance.start();
      setIsPlaying(true);
      Object.keys(presetVols).forEach((key) => {
        ambientSynthInstance.setVolume(key, presetVols[key]);
      });
    }
  };

  const getSoundIcon = (key) => {
    switch (key) {
      case 'rain': return <CloudRain className="w-4 h-4 text-sky-500" />;
      case 'forest': return <TreePine className="w-4 h-4 text-emerald-600" />;
      case 'water': return <Waves className="w-4 h-4 text-teal-500" />;
      case 'whiteNoise': return <Radio className="w-4 h-4 text-purple-500" />;
      default: return null;
    }
  };

  const getSoundLabel = (key) => {
    switch (key) {
      case 'rain': return 'Rain';
      case 'forest': return 'Forest Wind';
      case 'water': return 'Underwater';
      case 'whiteNoise': return 'White Noise';
      default: return key;
    }
  };

  return (
    <div className="flex-grow flex flex-col justify-between overflow-hidden">
      <div>
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-xs font-bold text-[#4A5D4E]/80 uppercase tracking-widest">Ambient Sounds</h2>
          <span className="flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
            <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}></span>
            {isPlaying ? 'Playing Real-time Synth' : 'Standby'}
          </span>
        </div>
        <p className="text-xs text-gray-400 mb-3">craft your perfect focus atmosphere</p>

        {/* 재생 마스터 버튼 */}
        <button
          onClick={handleMasterToggle}
          className={`w-full py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 mb-3 font-medium transition-all shadow-sm text-xs ${isPlaying
            ? 'bg-amber-500/10 text-amber-700 border border-amber-200/50 hover:bg-amber-500/20'
            : 'bg-[#5A6E5D] text-white hover:bg-[#4A5D4E]'
            }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5" /> Pause Sound Mixer
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-white ml-0.5" /> Start Ambient Synth
            </>
          )}
        </button>

        {/* 사운드 슬라이더 리스트 */}
        <div className="space-y-3.5">
          {Object.keys(volumes).map((soundKey) => (
            <div key={soundKey} className="space-y-0.5">
              <div className="flex justify-between text-xs font-medium text-gray-600 items-center">
                <span className="flex items-center gap-1.5">
                  {getSoundIcon(soundKey)}
                  {getSoundLabel(soundKey)}
                </span>
                <span className={`font-mono text-[11px] ${volumes[soundKey] > 0 ? 'text-[#6B8E23] font-bold' : 'text-gray-400'}`}>
                  {volumes[soundKey]}%
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volumes[soundKey]}
                  onChange={(e) => handleVolumeChange(soundKey, e.target.value)}
                  className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#6B8E23] transition-all hover:bg-gray-300"
                />
              </div>
            </div>
          ))}
        </div>

        {/* 사운드 프리셋 태그 */}
        <div className="mt-8">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
            <Compass className="w-3 h-3" /> Quick Presets
          </p>
          <div className="flex flex-wrap gap-1">
            {Object.keys(presets).map((name) => (
              <button
                key={name}
                onClick={() => applyPreset(name)}
                className={`text-[9px] px-2 py-0.5 rounded-md border font-medium transition-all ${activePreset === name
                  ? 'bg-[#6B8E23]/10 text-[#6B8E23] border-[#6B8E23]/30 font-semibold'
                  : 'bg-white/40 text-gray-500 border-gray-200/50 hover:bg-gray-50 hover:border-gray-300'
                  }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* 카메라 포탈 루트 */}
        <div id="camera-portal-root" className="mt-8 flex justify-center w-full"></div>

      </div>
    </div>
  );
}
