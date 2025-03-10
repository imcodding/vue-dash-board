<template>
  <component ref="windowRef" :is="contentPopup" :params="contentParams" @completed="completed"></component>
</template>

<script>
export default {

  created() {
    // 부모-자식 관계라는 가정 하에 처리
    // 팝업 여러 개일 경우 이슈 발생 가능성 있음(추후 개선)
    const frm = opener.document.getElementById('hForm');
    const inputs = frm.childNodes;

    for(const input of inputs) {
      this.contentParams[input.id] = input.value
    }
    
    const popupUrl = this.contentParams.url;
    this.contentPopup = async() => (await import(`${popupUrl}`)).default
  },

  data() {
    return {
      contentPopup: null,
      contentParams: {}
    }
  },

  methods: {
    completed(data) {
      
    }
  }

}
</script>

<style>
body, html { background: #fff; color: #000}
</style>