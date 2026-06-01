//리액트 컴포넌트가 실제로 소리를 내고 제어할 수 있도록 하는 오디오 관리 클래스
class AmbientSynth{
constructor(){
    this.audios={};//오디오 객체들을 담을 바구니 
    this.isPlaying = false;//현재 재생 상태 플래그
}

init(){
    //이미 객체들이 생성되어 있다면 중복 생성을 방지하기 위해 리턴
    if(Objeect.keys(this.audios).length>0) return;
    this.audios ={
      rain: new Audio('/sounds/rain.mp3'),
      forest: new Audio('/sounds/forest.mp3'),
      water: new Audio('/sounds/underwater.mp3'),
      whiteNoise: new Audio('/sounds/whitenoise.mp3')
    };

    //모든 음원을 무한 반복 상태로 만들고,처음에는 볼륨을 0으로 세팅하여 소리가 안나게 한다 
    Object.keys(this.audios).forEach((key)=>{
        const audio = this.audios[key]; //각각의 오디오에 대해서 루프를 적용하고 볼륨을 0으로 만드는 초기세팅
        audio.loop = true;
        audio.voloume = 0;
    });
}
start(){
    this.isPlaying = true;
    Object.keys(this.audios).forEach((key)=>{
        const audio = this.audios[key];
        audio.play().catch((err)=>{
            console.warn('Autoplay blocked or play failed for ${key}',err);
        });
    });
}

stop(){
    this.isPlaying = false;
    Object.keys(this.audios).forEach((key)=>{
        const audio = this.audios[key];
        audio.pause();
    });
}
setVolume(soundKey,volumePercent){
    //사용자가 화면을 켜자 마자 재생버튼을 누르지 않고 슬라이드를 조절했을 경우 대비
    this.init();
    const audio = this.audios[soundKey];
    if(audio){
        audio.volume = volumePercent /100;
    }
}
destroy(){
    this.stop()//재생을 멈추고
    this.audios = {};//오디오 객체 연결을 끊는다.
}
}

const ambientSynthInstance = new AmbientSynth();

export default ambientSynthInstance;