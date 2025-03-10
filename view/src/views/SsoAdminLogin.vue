<template>
  <div id="hd-All-Content">

  </div>
</template>

<script>

export default {
  created(){
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user');

    this.login();
  },

  methods: {

    login() {
      //웹에서 넘기는 param session userId base64 encode 값
      let decodeUserId = atob(this.$route.params.loginUserId);

      const loginParams = {
        userId : decodeUserId,
        password: this.password,
        loginUserId : this.userId,
        isSsoLogin: 'Y', //해당 obj 존재 할 경우 login 체크시 password 는 조건에서 제외. 순수 userId만 검증
        isAdmin: true
      };
      this.$store.dispatch('login', loginParams);
    },

  },

  data() {
    return {
      userId: '',
      password: ''
    }
  }
}
</script>

<style>

</style>
