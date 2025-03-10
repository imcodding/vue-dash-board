<template>
  <div class="modalBox">
    <div class="modal-wrap">
      <div class="modal-container" :style="popupStyle">
        <div class="modal-title">{{ title }}</div>
        <div class="modal-close" @click="close"></div>

        <component class="modal-content"
        :is="popupContent"
        :popupParams="params"
        @completed="completed"
        @close="close"
        @resize="resize"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    params: Object,
    name: String,
    width: Number,
    height: Number,
    title: String
  },
  created() {
    let contentUrl = './' + this.name
    let width = this.width ? this.width : 350;
    let height = this.height ? this.height : auto;
    this.popupStyle = 'width:'+ width +'px;height:' + height + 'px'
    this.popupParams = this.params;

    this.popupContent = async() => (await import(`${contentUrl}`)).default;

  },
  mounted() {

  },
  data() {
    return {
      popupContent: null,
      popupParams: {},
      popupStyle: ''
    }
  },
  methods: {
    /** 팝업 완료 - 완료 후, 처리할 로직이 있을 경우 */
    completed(data) {
      this.$emit('completed', data);
    },
    /** 팝업 닫기 - 단순히 팝업을 닫을 경우 */
    close() {
      this.$store.dispatch('dash/closePopup');
      this.$emit('close')
    },
    /**
     * 팝업 크기 resize
     * 자식 컴포넌트에서 호출
     */
    resize(width, height) {
      this.popupStyle = 'width:'+ width +'px;height:' + height + 'px'
    }
  }
}
</script>

<style>

</style>
