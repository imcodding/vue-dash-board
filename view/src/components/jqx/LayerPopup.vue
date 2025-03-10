<template>
  <jqx-window ref="jqxWindow" :autoOpen="false" :width="100" :height="100">
    <div></div>
    <div><component :is="loader" :popupParams="popupParams" @callbackPopup="callbackPopup"></component></div>
  </jqx-window>
</template>

<script>
import JqxWindow from '@/lib/jqwidgets/vue/vue_jqxwindow.vue'
export default {
  props: {
    name: String,
    popupParams: Object //각 팝업에 전달할 고정 params 값 (부모에 기본 선언 해야함)
  },
  components: {
    JqxWindow
  },
  computed: {
    loader() {
      this.content = this.name ? this.name : 'Blank';
      return () => import('../popup/' + this.content);
    }
  },
  methods: {
    callbackPopup(params){
      this.$emit('callbackPopup', params);
    }
  },
  data() {
    return {
      content: ''
    }
  }
}
</script>

<style>

</style>
