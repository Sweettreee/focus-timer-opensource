import React, { useState, useEffect, useRef } from "react";
import { Video, VideoOff } from "lucide-react";
//구글이 만든 인공지능 엔진 MediaPipe 웹캠 영상 속에서 사람의 눈코입을 찾아 얼굴이 있다 없다를 판별
import { FaceDetector, FilesetResolver } from "@mediapip/tasks-vision";
export default function FaceCamera({
  aiEnabled,
  isAiPaused,
  onFaceLost,
  onFaceReturned,
}) {
  const [webcamActive, setWebcamActive] = useState(false); //카메라가 켜져 있는지 거져 있는지
  const [isFaceDetected, setIsFaceDetected] = useState(false); //현재 화면에 얼굴이 보이는지 안보이는지
  const [isModeLoaded, setIsModelLoaded] = useState(false); //인공지능 모델이 다운로드 완료 되었는지 아직 로딩중인지

  const videoRef = useRef(null); //웹캠에서 들어오는 실시간 카메라 영상과 화면(html)을 연결해준다
  const detectorRef = useRef(null); //AI(얼굴인식)엔진을 안전하게 보관
  const requestRef = useRef(null); //초당 60번 도는 스캔루프를 안전하게 멈추기위해 기록하는 것

  const faceLostTimeRef = useRef(null); //얼굴이 안보이기 시작한 정확한 시각을 적어둠
  const faceReturnedTimeRef = useRef(null); //얼굴이 다시 보이기 시작한 시간을 적어둠

  //비디오 초기값을 -1로 설정해두어 아직 검사한적이 없다는 것을 확실하게 표시하고 첫 프레임을 통과시킴
  const lastVideoTimeRef = useRef(-1);

  //최신 정보를 실시간으로 기록
  const propsRef = useRef({
    aiEnabled,
    isAipaused,
    onFaceLost,
    onFaceReturned,
  });
  //버튼 누르면 카메라 전원 켜기
  useEffect(() => {
    setWebcamActive(aiEnabled);
  }, [aiEnabled]);

  // 1. MediaPipe 모델 초기화
  useEffect(() => {
    const initModel = async () => {
      //async를 통해서 await를 사용
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
        ); //인공지능이 계산을 할 수 있도록 기반환경을 구글 서버에서 받아옴
        detectorRef.current = await FaceDetector.createFromOptions(vision, {
          baseOptions: {
            //구글이 학습시켜둔 고성능 얼굴 인식 기능 다운로드
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
            delegate: "GPU", //로컬의 GPU를 사용하도록 세팅,GPU는 단순 계산 수천 개를 동시에 잘 처리하므로
          },
          runningMode: "VIDEO",
        });
        setIsModelLoaded(true);
      } catch (error) {
        console.error("AI모델 로딩 실폐:", error);
      }
    };
    initModel();
  }, []);

  //웹캠 켜고 끄기
  useEffect(() => {
    let stream = null; //영상데이터가 흘러갈 임시 파이프라인 준비
    if (webcamActive) {
      //브라우저에게 카메라 요청
      navigator.mediaDevices
        .getUserMedia({ video: { width: 320, height: 240 } })
        .then((s) => {
          stream = s; //성공하면 받아온 실시간 영상 데이터(s)를 파이프라인에 연결한다

          //<video>에 영상파이프를 꽂아 얼굴이 나오게 만듦
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch((err) => {
          //사용자가 카메라 권한 거부를 눌렀을 때 대비
          console.error("카메라 권한 오류", err);
          setWebcamActive(false);
        });
    }

    //뒷정리-끄거나 타이머 페이지 나갈시 작동
    return () => {
      //카메라 차단:영상 파이프라인 안에 흐르는 모든 트랙 찾아서 강제로 중지시킨다.
      if (stream) stream.getTracks().forEach((track) => track.stop());
      //ai 루프 취소
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [webcamActive]);

  //3. 매 프레임 스캔
  const predictWebcam = () => {
    //카메라가 꺼져있다면 즉시 루프 중단
    if (!webcamActive) return;
    //모델이랑 영상 태그가 다 로드되었을 때만 루프를 실행하도록 한다
    if (detectorRef.current && videoRef.current) {
      //ai분석기 준비되었는지 확인 및 비디오 장치 켜져 있는지 확인
      try {
        if (videoRef.current.currentTime !== lastVideoTimeRef.current) {
          //비디오의 현재 재생 시간과 직전에 검사했던 시간 비교
          lastVideoTimeRef.current = videoRef.current.currentTime;
        }
        const startTimeMs = performance.now(); //현재 시점의 정밀한 시간을 구함(프레임 간의 시간 간격을 파악하기 위해서)
        //ai분석기에게 웹캠 화면과 현재시간 제공해주고 얼굴 찾으라고 요청, 얼굴 위치및 개수가 변수에 담긴다.
        const detections = detectorRef.current.detectForVideo(
          videoRef.current,
          startTimeMs,
        );

        //분석 보고서라고 할수 있는 detection을 잘 보냈는지 그리고 얼굴이 감지되었는지 확인
        if (detections && detections.detections.length > 0) {
          setIsFaceDetected(true);
          faceLostTimeRef.current = 0; //이탈 타이머 누적 리셋
          if (propsRef.current.aiEnabled && propsRef.current.isAiPaused) {
            //ai기능 켜져 있고 사용자가 자리 멈춘상태
            if (
              faceReturnedTimeRef.current === null ||
              faceReturnedTimeRef.current === 0
            ) {
              //스톱워치가 처음 켜진상태이거나,쓰다 리셋된 상태
              faceReturnedTimeRef.current = Date.now();
            } else {
              const passedTime = Date.now() - faceReturnedTimeRef.current;
              if (passedTime > 3000) {
                propRef.current.onFaceReturned(); //돌아왔음을 알려줌
                faceReturnedTimeRef.current = 0;
              }
            }
          } else {
            faceReturnedTimeRef.current = 0;
          }
        }
        //얼굴이 안보일때
        else {
          setIsFaceDetected(false);
          faceReturnedTimeRef.current = 0;
          if (propsRef.current.aiEnabled) {
            if (
              faceLostTimeRef.current === null ||
              faceLostTimeRef.current === 0
            ) {
              faceLostTimeRef.current = Date.now(); //처음 놓친 시점 적어둠
            } else {
              const passedTime = Date.now() - faceLostTimeRef.current; //경과 시간 계산
              if (passedTime > 5000) {
                propsRef.current.onFaceLost(); //5초 넘으면 이탈 처리
                faceLostTimeRef.current = 0;
              }
            }
          }
        }
      } catch (error) {
        console.log("프레임 스킵됨");
      }
    }
  };
}
