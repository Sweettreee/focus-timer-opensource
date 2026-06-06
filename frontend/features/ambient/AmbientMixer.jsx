// 웹 오디오 믹서-네 가지 자연의 소리와 화이트 노이즈 볼륨 조절하여 나만의 배경음을 만듦
import React, {useState,useEffect} from 'react';
// 화면 꾸며주는 아이콘 이미지 
import { CloudRain, TreePine, Waves, Radio, Play, Pause, Compass } from 'lucide-react';
import ambientSynthInstance from './ambientSynth';

//기본 상태 설정 
export default function AmbientMixer(){
    const [isPlaying,setIsPlaying] = useState(false); //앱을 켰을 때 소리가 나지 않게함
    const [volumes,setVolumes] = useState({
        rain: 20,
        forest: 0,
        water: 0,
        whiteNoise: 0,
    });

    const [activePreset, setActivePreset] =useState('Custom');

    //프리셋 세팅
    const presets = {
        'Rainy Study': { rain: 60, forest: 10, water: 0, whiteNoise: 15 },
        'Forest Walk': { rain: 0, forest: 70, water: 30, whiteNoise: 0 },
        'Deep Focus': { rain: 20, forest: 0, water: 0, whiteNoise: 50 },
        'Ocean Breeze': { rain: 10, forest: 20, water: 65, whiteNoise: 0 },
        'Mute All': { rain: 0, forest: 0, water: 0, whiteNoise: 0 },
      };
    
    //이탈할 시 소리를 멈추도록 세팅
    useEffect(() => {
        //켜질때 사운드 엔진 대기
        return () => {
            ambientSynthInstance.stop();
        };
    }, []);

    const handleMasterToggle = ()=>{
        if(isPlaying){
            ambientSynthInstance.stop();
            setIsPlaying(false);}
        else{
            ambientSynthInstance.start();
            Object.keys(volumes).forEach((key) => {
                ambientSynthInstance.setVolume(key, volumes[key])
            });
            setIsPlaying(true);
    }

    };
    //수치및 프리셋 업데이트
    const handleVolumeChange = (soundKey,val)=>{
        //문자열을 숫자로 변환(10진수 정수로))
        const newVol = parseInt(val,10);
        //prev 기존의 다른 사운드 볼륨 상태를 유지하면 서 현재  조절한 사운드만 newVol로 교체
        setVolumes((prev)=>{
            const updated = {...prev,[soundKey]: newVol};
            //프리셋 조건 검사(프리셋 값이랑 수동 수정이랑 다르면 Custom으로 변경)
            setActivePreset('Custom');//슬라이더를 조금이라도 건드리면 Custom으로 상태 변경
            return updated;
        });
        //실제 오디오 엔진에 실시간 볼륨 적용
        if(isPlaying){
            ambientSynthInstance.setVolume(soundKey,newVol);
        }
    }

    //프리셋 버튼 클릭시 모든 슬라이더 수치와 활성화된 프리셋 이름을 한번에 갱신 
    const applyPreset = (presetName)=>{
        const presetVols = presets[presetName];//프리셋을 가져옴
        setVolumes(presetVols);//가져온 볼륨 객체로 슬라이더 리셋
        setActivePreset(presetName) //선택된 프리셋 버튼 스타일 변경 
        
        if(isPlaying){
            Object.keys(presetVols).forEach((key)=>{
                ambientSynthInstance.setVolume(key,presetVols[key]);
            });
        }else if(presetName !=='Mute All'){
            //플레이중이 아니었으면 플레이 활성화하면서 프리셋 적용 
            ambientSynthInstance.start();
            setIsPlaying(true);
            Object.keys(presetVols).forEach((key) =>{
                ambientSynthInstance.setVolume(key,presetVols[key]);
                });
            }
        }
    
    //geSoundIcon(아이콘 번역기)-사운드 종류에 맞는 시각적 아이콘을 리턴 
    const getSoundIcon = (key) => {
        switch (key) {
          case 'rain': return <CloudRain className="w-4 h-4 text-sky-500" />;
          case 'forest': return <TreePine className="w-4 h-4 text-emerald-600" />;
          case 'water': return <Waves className="w-4 h-4 text-teal-500" />;
          case 'whiteNoise': return <Radio className="w-4 h-4 text-purple-500" />;
          default: return null;
        }
      };
    
    //텍스트 번역기-글자 내용 바꿈
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
        <div className="flex-grow flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1">
              <h2 className="text-xs font-bold text-[#4A5D4E]/80 uppercase tracking-widest">Ambient Sounds</h2>
              <span className="flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}></span>
                {isPlaying ? 'Playing Real-time Synth' : 'Standby'}
              </span>
            </div>
            <p className="text-xs text-gray-400 mb-5">craft your perfect focus atmosphere</p>
    
            {/* 재생 마스터 버튼 */}
            <button
              onClick={handleMasterToggle}
              className={`w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 mb-6 font-medium transition-all shadow-sm ${
                isPlaying 
                  ? 'bg-amber-500/10 text-amber-700 border border-amber-200/50 hover:bg-amber-500/20' 
                  : 'bg-[#5A6E5D] text-white hover:bg-[#4A5D4E]'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" /> Pause Sound Mixer
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" /> Start Ambient Synth
                </>
              )}
            </button>
    
            {/* 사운드 슬라이더 리스트 */}
            <div className="space-y-4">
              {Object.keys(volumes).map((soundKey) => (
                <div key={soundKey} className="space-y-1">
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
            <div className="mt-6">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                <Compass className="w-3 h-3" /> Quick Presets
              </p>
              <div className="flex flex-wrap gap-1.5">
                {Object.keys(presets).map((name) => (
                  <button
                    key={name}
                    onClick={() => applyPreset(name)}
                    className={`text-[10px] px-2.5 py-1 rounded-md border font-medium transition-all ${
                      activePreset === name
                        ? 'bg-[#6B8E23]/10 text-[#6B8E23] border-[#6B8E23]/30 font-semibold'
                        : 'bg-white/40 text-gray-500 border-gray-200/50 hover:bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
    
            {/* [신규] 카메라 포탈 루트 - Quick Presets 바로 밑에 배치 */}
            <div id="camera-portal-root" className="mt-5 flex justify-center w-full"></div>
          </div>
    
          {/* 하단 감성적인 명언 */}
          <div className="mt-8 pt-4 border-t border-gray-100/80">
            <p className="text-xs italic text-gray-400 font-serif leading-relaxed text-center">
              "할 수 있다! 하면 된다!FocusRoom 화이팅"
            </p>
          </div>
        </div>
      );
    }


