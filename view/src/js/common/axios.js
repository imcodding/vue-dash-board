import axios from 'axios';
import {store} from '../../store/store'
import router from '../../router/index'
/**
 * axios 모듈
 * @author sooyun, imhojong
 * @since 2023.07.09
 */

export default {
  install(app) {
    app.prototype.$axios= axios;
  }
}

//axios 발신시 Authorization 토큰 back-end 서버로 전송
axios.interceptors.request.use(function (config) {
    const accessToken = store.state.accessToken;
    config.headers['x-auth-token'] = accessToken;

    let loginUserId = store.state.userId;
    //const loginUserId = store.state.userId;
  
    //login.vue 에서 axios 호출시 localStorage에 userId가 없는 상태이기에 config.data.userId 확인하여 우선 세팅
    if(config.hasOwnProperty('data')){
      if(config.data.userId != null || config.data.userId !== undefined){
          loginUserId = config.data.userId;
      }
    }

    //axios default param userId 세팅 (data -> post, params -> get)
    //todo back-end xml session 관련 param 값은 해당 위치에서 설정 필요?
    config.data  = {...config.data, userId: loginUserId };
    config.params  = {...config.params, userId: loginUserId, authGrpNo:1 };
    return config;
});

//axios 수신 데이터 고정
axios.interceptors.response.use(function (config) {
    //최소 로그인 했을 경우 어케 처리할지 .. /login~ url은
    //백엔드에서 인터셉터를 거치지 않기에 해당 헤더의 x-auth-token 객체를 생성하지 않음
    //로그인 서비스에서 로긴 성공시 헤더 + 토큰 생성? 고민
    if(config.headers['x-auth-token'] != undefined){ 
        const accessToken = config.headers['x-auth-token'];
        console.log("interceptors response accessToken",accessToken);
    }
    const data = config.data.resultData;
    const requestUrl = config.config.url;
    if(data && data.code && data.code.indexOf("TOKEN")) {
      //토큰이 만료일 경우에만 재갱신
      if(data.code == 'EXPIRED_TOKEN') {
        store.dispatch('updateToken');
      } else {
        if(data.code == 'INTERNAL_SERVER_ERROR') {
          console.log(requestUrl, '요청 실패' ,data)
          return []
        } else {
          router.push('/login')
        }
      }
    }
      
    return config.data.resultData;
});


/*
const Axios = {
       post
}*/
