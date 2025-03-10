<template>
  <div class="slide">
    <div>
      <!-- <div class="widgetType"> -->
      <tree class="widgetType" ref="tree"
      :theme="'dark'"
      :defaultIdx="1"
      :treeStyle="'width:260px;height:1002px;padding-top:30px'"
      @bindingCompleted="changeWidget" />
      <!-- </div> -->
      <div class="widgetItemBox">
        <input id="widgetTitle" type="hidden"/>
        <div class="widgetItem">
          <ul>
            <li v-for="item, key in widgetRefIds" :key="key">
              <div class="ctrl"
              :id="item.id + key"
              :data-id="item.id"
              :data-display="item.display"
              :data-title="item.title"
              :data-thumbnail="item.thumbnail"
              @click="handleMoveBox(item.id+key)">
                <div style="text-align:center;">
                  <img :src="require(`@/assets/images/thumbnail/${item.thumbnail}.svg`)" />
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Tree from './jqx/Tree.vue';
import Widget from '../js/common/widget/widget.control';
export default {
  components: {
    Tree
  },

  mounted() {
    this.$refs.tree.onSelect = (event) => {
      const item = event.owner.selectedItem;
      if(item.level == 1){ //유형이 아닌 위젯 아이템을 눌렀을 경우
        this.changeWidget(item)
      }
    };
  },

  methods: {
    changeWidget(widgetInfo) {
      //위젯 이름은 트리 선택 값의 label로 기본 세팅
      document.getElementById('widgetTitle').value = widgetInfo.label;

      this.widgetRefIds = [];

      const type = widgetInfo.parentType.toUpperCase(); // NMS, AP, SMS ...
      const item = widgetInfo.value; // cpuTopN, memoryTopN ...
      const displayList = Widget.itemInfo[item]; //grid, BarChart, ColumnChart ... types

      for(let display of Object.keys(displayList)){
        var info = {};
        info.wref = type;
        info.id = item;
        info.display = display;
        info.thumbnail = displayList[display].thumbnail ? displayList[display].thumbnail : display;
        info.title = widgetInfo.title;

        this.widgetRefIds.push(info)
      };
    },

    /* widget box event handler */
    handleMoveBox(widgetItemId) {
      const widgetItem = document.getElementById(widgetItemId);
      const dataset = widgetItem.dataset;
      const defaultConf = Widget.itemInfo[dataset.id][dataset.display].params

      let params = {}
      params.wref = dataset.id;
      params.id = dataset.id;
      params.display = dataset.display;
      params.name = document.getElementById('widgetTitle').value; //위젯의 타이틀은 상단 input box
      params.conf = JSON.stringify(defaultConf)

      this.$emit('setLayout', params)
    },
  },
  data() {
    return {
      widgetRefIds: [],

    }
  }
}
</script>

<style scoped>

.widgetType {
  width: 206px;
  height: 1002px;
  float: left;
}
.widgetItemBox{
  float: right;
  /*margin-right: 10px;*/
  /*margin-top: 5px;*/
  margin-right: 14px;
  margin-top: 17px;
}
#widgetTitle {
  width: 255px;
  height: 20px;
  margin-bottom: 5px;
  border: 1px solid #b4b4b4;
}

.widgetItem div {
  /*background-color: #2B3042;*/
  position:relative;
  opacity: 0.85;
  width: 58px;
  height: 62px;
  background: #232936;
  border-radius: 7px;
  cursor:pointer;
}
.widgetItem ul li{
  margin-bottom: 20px;
}
.widgetItem div:hover {
  opacity:1;
  background: #226cff;
}
.ctrl .jqx-widget-content {
  background: transparent;
  border: transparent;
  color: #fff;
}
.widgetBtn {
  display: block;
  float: right;
  margin: 5px 10px 0 0;
  background:#363B4C!important;
  color:#ffffff!important;
  border:none!important;
}
</style>
