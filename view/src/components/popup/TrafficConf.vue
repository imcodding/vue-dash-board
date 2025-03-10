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
        <tr>
          <th>그룹</th>
          <td>
            <DropDownTree ref="grpTree" :width= "150" :height="50"
            :url="url"
            @bindingCompleted="bindingCompleted"></DropDownTree>
          </td>
        </tr>
        <tr>
          <th>I/O</th>
          <td>
            <JqxDropDownList class="p_combo" ref="myPanel"
                             :popupZIndex="10000"
                             :width= "'100%'" :height="25" :autoDropDownHeight="true"
                             :source="source" :selectedIndex="1">
            </JqxDropDownList>
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
import JqxDropDownList from '@/lib/jqwidgets/vue/vue_jqxdropdownlist.vue';
import DropDownTree from '../../components/jqx/DropDownTree';
import SetTitle from './SetTitle';
export default {
  components:{
    JqxDropDownList,
    SetTitle,
    DropDownTree
  },
  props: {
    /* 위젯item db data */
    popupParams: Object
  },
  created() {
    this.$emit('resize', 350, 237)
  },
  mounted() {
    let data = this.popupParams;
    //SetTitle.vue 기본 위젯의 설정 값 모두 가져오기
    for(let key of Object.keys(this.$refs.setTitle.$refs)){
      this.$refs.setTitle[key] = data[key];
    }

    let conf = JSON.parse(data.conf);
    this.topnVal = conf && conf.topN;
    this.$refs.myPanel.val((conf && conf.ifInout));
    this.ifGrpNo = conf && conf.ifGrpNo || this.ifGrpNo;
  },
  data() {
    return {
      topnVal: 0,
      source: [
        {label: 'inbps + outbps', value: 'SUM'},
        {label: 'inbps / outbps', value: 'IO'},
        {label: 'inbps', value: 'IN'},
        {label: 'outbps', value: 'OUT'},
        {label: 'inbps(%) + outbps(%)', value: 'SUM_PER'},
        {label: 'inbps(%) / outbps(%)', value: 'IO_PER'},
        {label: 'inbps(%)', value: 'IN_PER'},
        {label: 'outbps(%)', value: 'OUT_PER'}
      ],
      ifGrpNo: 1,
      grpItems: null,
      url: '/api/com/getGrpTreeList'
    }
  },

  methods: {
    save() {
      let data = this.popupParams;
      let params = {};
      let treeItem = this.$refs.grpTree.$refs.myTree.getSelectedItem();
      let widgetBasicData = this.$store.state.widget.widgetBasicData; //name 등의 테이블 단일 컬럼 데이터
      let widgetConfData = this.$store.state.widget.widgetConfData; //conf 컬럼의 복합 데이터

      //conf 추가 데이터 add
      this.$store.dispatch('widget/addWidgetConfData', {topN: this.topnVal});
      this.$store.dispatch('widget/addWidgetConfData', {ifInout: this.$refs.myPanel.getSelectedItem().value});
      this.$store.dispatch('widget/addWidgetConfData', {ifGrpNo: treeItem.value});

      params.conf = JSON.stringify(widgetConfData);

      let editData = { ...data, ...widgetBasicData, ...widgetConfData, ...params };
        editData.curTime = new Date().getTime();

        this.$emit('completed', editData);
        this.cancel();
    },
    cancel() {
      this.$emit('close')
    },
    bindingCompleted(items) {
      this.grpItems = items;

      let selected;
      for(const item of items) {
        if(item.value == this.ifGrpNo) {
          selected = item;
          break;
        }
      }
      this.$refs.grpTree.$refs.myTree.selectItem(selected)
    }
  },
}
</script>

<style>

</style>
