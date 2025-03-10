<template>
  <div :style="`display:${display}`">
    <div class="box">
      <div class="img-box" >
        <!-- <img :src="`static/img/conf/${confImg}.svg`"/> -->
        <img v-if="confImg" :src="require(`@/assets/images/confInfo/${confImg}.svg`)"/>
      </div>
      <div class="text-box">
        <div class="label">{{confName}}</div>
        <div class="text-box count">{{cnt | toFixed}}</div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  components: {

  },
  methods: {
      refreshData(url, params) {
          let $this = this;
          this.confName = params.confName;
          this.confImg = params.confImg;
          this.$axios.get(url, {params:params}).then(res => {
            $this.cnt = res.cnt
          });
          this.display = 'block' //바인딩 속도 때문
      }
  },

  filters: {
      toFixed(value) { return value ? value.toFixed(0) : 0 }
  },

  data() {
    return {
      cnt: 0,
      confName: null,
      confImg: null,
      display: 'none'
    }
  }
}
</script>

<style scoped>
.box {border: 1px solid #a9b0bb;}
.img-box {width:100%;text-align: center;padding: 10px 0 10px 0;}
.text-box {width:100%;text-align: center;font-size: 14px;}
.label {background-color: #1d61b3; font-size:14px}
.count {background-color: #1f487c; font-size:16px}
</style>
