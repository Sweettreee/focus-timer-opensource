// 인증 액션 컨트롤러. 입력 검증은 View에서 끝낸 뒤로 호출한다.
// 로그인/로그아웃 시 task, session를 서버/로컬 기준으로 다시 로드한다.
import { useCallback } from "react";
// import { useStore } from '../../app/AppStore'
import * as authService from "./authService";
// import * as taskService from '../tasks/taskService';
import * as sessionService from "../history/sessionService";

export function useAuthController() {
  const { dispatch } = useStore();

  // 로그인/로그아웃 후 tasks, sessions를 다시 로드해 디스패치
  // 각 service가 토큰 유무로 서버/로컬(or 빈 배열)을 분기한다
  // const reloadData = useCallback(async() => {

  // })

  const login = useCallback(async (creds) => {
    const user = await authService.login(creds);
    disp;
  });
}
