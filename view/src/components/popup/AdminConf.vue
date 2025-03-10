<template>
  <div>
    <div class="pop_table" style="margin-bottom: 2px;">
      <table>
         <colgroup>
           <col width="65">
           <col width="">
         </colgroup>
        <tr>
          <th>좌우/상하</th>
          <td>
            <div style="float: left; width: 50%;">
              <input ref="left" type="number" name="left" min="1" max="2000" maxlength="4" class="p_inputTxt"
                     v-model="left">
            </div>
            <div style="float: left; width: 50%;">
              <input ref="top" type="number" name="top" min="1" max="1020" maxlength="3" class="p_inputTxt"
                     v-model="top" style="margin-left: 5px;">
            </div>
          </td>
        </tr>
        <tr>
          <th>가로/세로</th>
          <td>
            <div style="float: left; width: 50%;">
              <input ref="width" type="number" name="width" min="135" max="1917" maxlength="4" class="p_inputTxt"
                     v-model="width">
            </div>
            <div style="float: left; width: 50%;">
              <input ref="height" type="number" name="height" min="110" max="1068" maxlength="3" class="p_inputTxt"
                     v-model="height" style="margin-left: 5px;">
            </div>
          </td>
        </tr>
        <tr>
          <th>차트색상</th>
          <td>
            <!--<div style="float: left; width: 50%;">-->
            <div style="float: left; width: 50%;">
              <select class="p_combo" v-model="colorType">
                <option value="false">혼합</option>
                <option value="true">단일</option>
              </select>
            </div>
            <ColorPickerInput
              v-if="colorType == 'true'"
              ref="chartColor"
              class="form-group"
              v-model="chartColor"
            />
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
  import JqxDropDownList from '@/lib/jqwidgets/vue/vue_jqxdropdownlist.vue';
  import ColorPickerInput from "../panel/ColorPickerInput"
 /**
 * 관리자용 위젯 설정
 * 일반 고객사 등의 사용자가 제어 하지 않는 상세/고급 제어
 * store isAdmin 으로 show
 */
export default {
  components: {
    JqxDropDownList,
    ColorPickerInput
  },
  props: {
    popupParams: Object
  },
  //각 설정 위젯 mounted 시 watch 동작으로 store 세팅
  computed: {

  },
  watch: {
    width() {
      this.validation(this.width, this.$refs.width);
      this.setCoordinate('width');
    },
    height() {
      this.validation(this.height, this.$refs.height);
      this.setCoordinate('height');

    },
    left() {
      this.validation(this.left, this.$refs.left);
      this.setCoordinate('left');
    },
    top() {
      this.validation(this.top, this.$refs.top);
      this.setCoordinate('top');
    },

    chartColor(){
      this.setChartColor();
    },
    colorType(){
      this.setChartColor();
    }
  },

  mounted() {
    //컴포넌트 선언 값 & props 일치 데이터 입력
    for(let key of Object.keys(this.$refs)){
      this[key] = this.popupParams[key];
      if(this.popupParams[key] == undefined){
         //ref 속성이 없는 경우(컬럼 필드가 아닐 경우) conf 값 확인
         this[key] = JSON.parse(this.popupParams.conf)[key]
      }
    }

  },
  updated(){

  },

  data() {
    return {
      left: 0,
      top:0,
      width: 0,
      height: 0,
      chartColor: '#000000',
      //conf 값이 없는 빈 위젯 저장시 '혼합', conf 값이 존재하며 색상을 지정 하지 않은 경우 '혼합'
      colorType: this.popupParams.conf == null ? ('false') : (JSON.parse(this.popupParams.conf).hasOwnProperty('chartColor') ? 'true' : 'false')
    }
  },

  methods: {
    //혼합 일 경우 차트색상 obj 제거
    setChartColor(){
      if (this.colorType == 'true') {
        this.$store.dispatch('widget/addWidgetConfData', {chartColor: this.chartColor});
      } else {
        this.$store.dispatch('widget/removeWidgetConfData', 'chartColor');
      }
    },

    //param: store 등록 좌표 타입 (width, left ...)
    setCoordinate(addObjKey){
      let data = this.popupParams;
      let params = {
        width: parseInt(this.width),
        height: parseInt(this.height),
        left: parseInt(this.left),
        top: parseInt(this.top)
      };

      let editData = {...data, ...params};
      this.$store.dispatch('rect/setRect', {id: editData.idx, rect: editData})
      this.$store.dispatch('widget/addWidgetBasicData', {[addObjKey]: parseInt(this[addObjKey])});
    },

    validation(val, target){
      if (val == '') {
        this[target.name] = 1;
      }

      if (parseInt(val)  > parseInt(target.max)) {
        this[target.name] = target.max;
      }
    }
  }
}
</script>

<style>

</style>
