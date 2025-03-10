<template>
  <div>
    <setTitle ref="setTitle" :popupParams="this.popupParams"></setTitle>

    <div class="pop_table">
      <table>
        <colgroup>
          <col width="65">
          <col width="">
        </colgroup>
        <tr>
          <th>TOPN</th>
          <td>
            <input type="number" min="1" max="10" class="p_inputTxt" v-model="topnVal"
            oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');">
          </td>
        </tr>
      </table>
    </div>
    <div class="p_bottom_layer">
      <button class="btn" @click="save">적용</button>
      <button class="btn" @click="cancel">취소</button>
    </div>
  </div>
</template>

<script>
import SetTitle from './SetTitle';
export default {
  components: {
    SetTitle
  },
  props: {
    /* 위젯item db data */
    popupParams: Object
  },
  mounted() {
    let data = this.popupParams;

    //SetTitle.vue 기본 위젯의 설정 값 모두 가져오기
    for(let key of Object.keys(this.$refs.setTitle.$refs)){
      this.$refs.setTitle[key] = data[key];
    }

    let conf = JSON.parse(data.conf);
    this.topnVal = conf && conf.topN;
  },
  data() {
    return {
      topnVal: 0
    }
  },

  methods: {
    save() {
      let data = this.popupParams;
      let widgetBasicData = this.$store.state.widget.widgetBasicData;
      let widgetConfData = this.$store.state.widget.widgetConfData;

      this.$store.dispatch('widget/addWidgetConfData', {topN: this.topnVal}); //conf 추가 데이터 add

      let params = {};
      params.conf = JSON.stringify(widgetConfData);

      //data: 전체 위젯 table 데이터
      //widgetBasicData 위젯 설정 기본 데이터
      //widgetConfData conf 설정 데이터
      //params conf json 형 insert 데이터
      let editData = { ...data, ...widgetBasicData, ...widgetConfData, ...params };
      editData.curTime = new Date().getTime();

      this.$emit('completed', editData);

      this.cancel();
    },
    cancel() {
      this.$emit('close')
    }
  },
}
</script>

<style>

</style>
