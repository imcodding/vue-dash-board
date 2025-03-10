import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';
import router from '../router/index'
import dash from './modules/dash'
import rect from './modules/rect'
import set from './modules/set'
import gsap from './modules/gsap';
import map from './modules/map'
import widget from './modules/widget'
import code from './modules/code'
/**
 * store 모듈
 * @author sooyun, imhojong
 * @since 2023.07.09
 */

Vue.use(Vuex);

export const store = new Vuex.Store({
    modules: { rect, dash, set, gsap, map, widget, code },
    state: {
        refreshTime : localStorage.getItem('refreshTime'),
        accessToken: localStorage.getItem('accessToken'),
        userId: localStorage.getItem('userId'),
        userName: localStorage.getItem('userName'),
        win: {stageW: 1920, stageH: 1080},
        popupName: 'Blank',
        mainTitle: '',
        imageLogoPath : '',
        imageMainPath : '',
        processEnv : 'DEV',
        isChangeWidget: false,
        isAdmin: JSON.parse(localStorage.getItem('isAdmin')),
        theme: 'blue'
    },

    mutations: {
        setLoginInfo(state, payload) {
            state.accessToken = payload.token;
            state.userId = payload.userId;
            state.userName = payload.userName;
            state.isAdmin = payload.isAdmin;
        },
        setRefreshTime(state, payload) {
            state.refreshTime = payload;
        },
        setPopupName(state, payload) {
            state.popupName = payload.name;
        },
        setMainTitle(state, payload) {
            state.mainTitle = payload;
        },
        setTheme(state, payload) {
            state.theme = payload;
        },
        setImagePath(state){
            /*
            프로젝트 구성이 개발 / 운영에 따른 이미지 패스 분기
            운영: 외부 디렉토리, 개발: 내부 디렉토리
            - 개발(로컬)은 main.css 에 정의된 background 를 우선시함
            - 운영은 store 값으로 덮어쓰기 됨
            */
            if(process.env.NODE_ENV == 'production') {
                state.imageMainPath = localStorage.getItem('imageMainPath')
                state.imageLogoPath = localStorage.getItem('imageLogoPath')
            }
        },
        setImgPath(state, {img, imgKind2}) {
            let dir = imgKind2 && imgKind2.toLowerCase();
            if(process.env.NODE_ENV == 'production') {
                let imgUrl = 'background: url("/image/vue/' + dir + '/' + img +'.png") no-repeat';
                if(imgKind2 == 'BG') state.imageMainPath = imgUrl;
                else state.imageLogoPath = imgUrl;
            } else {
                let imgUrl  = 'background: url("/static/img/d3/' + dir + '/' + img +'.png") no-repeat';
                if(imgKind2 == 'BG') state.imageMainPath = imgUrl;
                else state.imageLogoPath = imgUrl;
            }
        },

        setIsChangeWidget(state, payload) {
          state.isChangeWidget = payload;
        }
    },

    actions: {
        //params: userId / password
        login: (context, params) => {
            return new Promise((resove, reject) => {
                axios.post('/api/login', params).then(response => {
                    if (response.status) {
                        //token / user 값 localStorage에서 직접 접근이 아닌 store를 통하여
                        //접근하기 위해 mutations->state로 올림
                        response.isAdmin = params.isAdmin;
                        context.commit('setLoginInfo', response);

                        localStorage.setItem('accessToken', response.token);
                        localStorage.setItem('userId', response.userId);
                        localStorage.setItem('userName', response.userName);
                        localStorage.setItem('isAdmin', params.isAdmin);

                        router.push({path:'/main'}) //화면 이동
                    } else {
                        alert(response.message);
                    }

                    resove(response);
                }).catch(err => {
                    console.log(err.message);
                    reject(err.message);
                });
            })
        },

        updateToken: function (context) {
            let params = { userId: store.state.userId }
            axios.post('/api/login/updateToken', params)
                .then(response => {
                    localStorage.setItem('accessToken', response.token);
                    localStorage.setItem('userId', response.userId);
                    localStorage.setItem('userName', response.userName);
                    context.commit('setLoginInfo', response);
                    //토큰 업데이트 후, 화면 갱신 필요
                    //router.go(0);
                    //router.push('/main')
                })
        },

        goThema: (context, params) => {
            if(params == 1) params = '';
            router.push({path:'/login'+params}) //화면 이동
        },

        refreshTime(context) {
            /*axios.get('/api/getRefreshTime').then(res => {
              context.commit('setRefreshTime', res);
            })*/
        },
        dashConf(context) {
            axios.get('/api/getDashConf').then(res => {
              for(let dashConf of res){
                switch(dashConf.dashKey) {
                   case "MAIN_TITLE":
                    context.commit('setMainTitle', dashConf.value);
                    break;
                   case "REFRESH_TIME":
                    context.commit('setRefreshTime', dashConf.value);
                    localStorage.setItem('refreshTime', dashConf.value);
                    break;
                   case "THEME":
                    context.commit('setTheme', dashConf.value);
                    break;
                  case "TAB":
                    context.commit('set/setTabUse', Number(dashConf.value));
                    break;
                   case "TAB_ROTATION":
                     context.commit('set/setTabRotation', Number(dashConf.value));
                    break;
                   case "MAIN_BG":
                    context.commit('setImgPath', {img: dashConf.value, imgKind2: 'BG'});
                    break;
                   case "MAIN_LOGO":
                    context.commit('setImgPath', {img: dashConf.value, imgKind2: 'LOGO'});
                    break;
                }
              }
              if(!store.state.refreshTime) {
                context.commit('setRefreshTime', 60);
                    localStorage.setItem('refreshTime', 60);
              }
            })
        },
        updateImgPath(context, payload) {
            var params = {}
            params.dashKey = 'MAIN_' + payload.imgKind2
            params.value = payload.img

            axios.post('/api/dash/setting/saveDashBg', params).then(res => {
                alert('적용되었습니다.')
                context.commit('setImgPath', payload)
            })
        }
    }
});

