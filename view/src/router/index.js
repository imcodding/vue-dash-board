import Vue from 'vue'
import Router from 'vue-router'
import {store} from '../store/store'

/**
 * router set page link
 * @author sooyun, imhojong
 * @since 2023.07.09
 */

Vue.use(Router)
const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path:'/login',
    component: () => import('../views/Login.vue')
  },
  {
    path:'/ssoLogin/:loginUserId',
    component: () => import('../views/SsoLogin.vue')
  },
  {
    path:'/ssoAdminLogin/:loginUserId',
    component: () => import('../views/SsoAdminLogin.vue') //netis web engineer.do를 통해 접근한 경우. vue 자체 편집 모드 사용가능
  },
  {
    path:'/main',
    component: () => import('../views/MainDash.vue'), //MainWidgetResize
    meta: {authRequired: true} // 인증이 필요한 경우
  },
  {
    path:'/main/popup/detail',
    component: () => import('../components/popup/WindowPopup.vue'),
  },
  {
    path: '*',
    component: () => import('../views/NotFound.vue')
  }
]
const router = new Router({
  mode: 'history',
  routes
})

router.beforeEach(function (to, from, next) {
  const user = store.state.user;
  const accessToken = store.state.accessToken;


  /*
  authRequired 값으로 판단하면 컴포넌트 마다 넣어줘야 하겠지만,
  대시보드는 로그인과 메인화면만 있다는 가정 하에 authRequired 값을 컴포넌트에 추가해서 판단
  로그인 페이지는 authRequired=false 여서 아래의 로직을 타지 않음
  */
  if(to.matched.some(r=>r.meta.authRequired)) {
    if(accessToken !== null && user !== null) {
      next();
    } else {
      alert('로그인을 해주세요.')
      next('/login')
    }
  } else {
    next();
  }
})
export default router;
