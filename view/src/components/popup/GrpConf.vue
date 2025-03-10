<template>
  <div>
    <setTitle ref="setTitle" :popupParams="this.popupParams"></setTitle>

    <div class="pop_table">
      <table>
        <colgroup>
          <col width="65">
        </colgroup>
        <tr>
          <th>그룹</th>
          <td>
            <DropDownTree ref="myPanel" :width= "150" :height="50" @bindingCompleted="bindingCompleted" :url="url"></DropDownTree>
          </td>
        </tr>
      </table>
    </div>
    <div class="p_bottom_layer">
      <button class="btn" @click="save">저장</button>
      <button class="btn" @click="cancel">취소</button>
    </div>
  </div>
</template>

<script>
import SetTitle from './SetTitle';
import DropDownTree from '../../components/jqx/DropDownTree';
export default {
  components:{
    DropDownTree,
    SetTitle
  },
  props: {
    /* 위젯item db data */
    popupParams: Object
  },
  mounted() {
    this.$emit('resize', 350, 170)

    let data = this.popupParams;

    //SetTitle.vue 기본 위젯의 설정 값 모두 가져오기
    for(let key of Object.keys(this.$refs.setTitle.$refs)){
      this.$refs.setTitle[key] = data[key];
    }

    let conf = JSON.parse(data.conf);
    this.topoGrpNo = conf && conf.topoGrpNo;
    
  },
  data() {
    return {
      grpItems: null,
      topoGrpNo: 0,
      url: '/api/com/getD3TopoGrpTreeList'
    }
  },

  methods: {

    save() {
      let data = this.popupParams;
      let selectedItem = this.$refs.myPanel.$refs.myTree.getSelectedItem(); //다른 방안 생각
      let widgetBasicData = this.$store.state.widget.widgetBasicData;
      let widgetConfData = this.$store.state.widget.widgetConfData;

      this.$store.dispatch('widget/addWidgetConfData', {topoGrpNo: selectedItem.value});

      let params = {};
      params.conf = JSON.stringify(widgetConfData);

      let editData = { ...data, ...widgetBasicData, ...widgetConfData, ...params };
      editData.curTime = new Date().getTime();

      this.$emit('completed', editData);
      this.cancel();
    },

    cancel() {
      this.$parent.close();
    },

    bindingCompleted(items) {
      this.grpItems = items;

      let selected;
      for(const item of items) {
        if(item.value == this.topoGrpNo) {
          selected = item;
          break;
        }
      }
      this.$refs.myPanel.$refs.myTree.selectItem(selected)
    }
  },
}
</script>

<style>

</style>
