<template>
  <div>
    <setTitle ref="setTitle" :popupParams="this.popupParams"></setTitle>

    <div class="p_bottom_layer">
      <button class="btn" @click="save">적용</button>
      <button class="btn" @click="cancel">취소</button>
    </div>
  </div>
</template>

<script>
import SetTitle from './SetTitle';
export default {
  components:{
    SetTitle,
  },
  props: {
    popupParams: Object
  },
  created() {
    this.$emit('resize', 350, )
  },
  mounted() {
    let data = this.popupParams;
    //SetTitle.vue 기본 위젯의 설정 값 모두 가져오기
    for(let key of Object.keys(this.$refs.setTitle.$refs)){
      this.$refs.setTitle[key] = data[key];
    }

    /*this.$refs.setTitle.setTitleVal = data.name;
    this.$refs.setTitle.setIconVal = data.icon;
    this.$refs.setTitle.setTitleDisplay = data.title;*/
  },
  data() {
    return {
      title: ''
    }
  },
  methods: {
    save() {
      let data = this.popupParams;
      let widgetBasicData = this.$store.state.widget.widgetBasicData;
      let widgetConfData = this.$store.state.widget.widgetConfData;

      let params = {};
      params.conf = JSON.stringify(widgetConfData);

      //let editData = {...data, ...params};
      let editData = { ...data, ...widgetBasicData, ...widgetConfData, ...params };
      editData.curTime = new Date().getTime();

      this.$emit('completed', editData);
      this.cancel();
    },
    cancel() {
      this.$emit('close')
    }
  }
}
</script>

<style>

</style>
