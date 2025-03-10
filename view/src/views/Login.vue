<template>
  <div id="n_login">
    <div class="login_block">
        <div class="login_box">
            <!-- <div class="login_logo">
                <img src="/image/logo.jpg">
            </div> -->
            <div class="inputBox2">
                <div class="login_form">
                    <div>
                        <img alt="로그인 ID" src="@/assets/images/login/login_id.png">
                        <input type="text" ref="userId" v-model="userId" placeholder="ID" v-on:keyup.enter="login" autofocus>
                    </div>
                    <div>
                        <img alt="로그인 패스워드" src="@/assets/images/login/login_pw.png">
                        <input type="password" v-model="password" placeholder="PASSWORD" v-on:keyup.enter="login">
                    </div>
                </div>
                <div class="login_btn" @click="login">
                  <img src="@/assets/images/login/login_btn.png" alt="로그인버튼" tabindex=0>
                </div>
            </div>
        </div>
    </div>
    <div class="login_copy">
        Copyright ⓒ 2023
        <strong></strong> . All rights reserved.
    </div>
</div>
</template>

<script>

export default {
  created(){
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
  },

  methods: {

    login() {

      if(process.env.NODE_ENV == 'development') {
        this.isAdmin = true;
      }

      if(!this.validation()) return;

      const loginParams = {
        userId : this.userId,
        password: this.password,
        loginUserId : this.userId,
        isAdmin: this.isAdmin
      };

      this.$store.dispatch('login', loginParams);
    },

    goThema(type){
      this.$store.dispatch('goThema', type);
    },

    validation() {
      if(this.$isBlank(this.userId)) {
        alert('아이디를 입력해주세요.');
        this.$refs.userId.focus();
        return false;
      }
      if(this.$isBlank(this.password)){
        alert('비밀번호를 입력해주세요.');
        this.$refs.password.focus();
        return false;
      }
      return true;
    }
  },

  data() {
    return {
      userId: '',
      password: '',
      isAdmin: false
    }
  }
}
</script>

<style>

</style>
