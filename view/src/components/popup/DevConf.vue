<template>
  <div class="popBox">
    <setTitle ref="setTitle" :popupParams="this.popupParams"></setTitle>

    <div class="pop_table">
      <table>
        <colgroup>
          <col width="65">
        </colgroup>
        <tr>
          <th>지표</th>
          <td>
            <JqxDropDownList class="p_combo" ref="perfItemType"
                             :width="'100%'" :height="25" :autoDropDownHeight="true" :popupZIndex="10000"
                             :source="source" :selectedIndex="0">
            </JqxDropDownList>
          </td>
        </tr>
        <tr>
          <th>수집주기</th>
          <td>
            <JqxDropDownList class="p_combo" ref="perfPeriod"
                             :width="'100%'" :height="25" :autoDropDownHeight="true"
                             :popupZIndex="10000"
                             :source="srcPerfPeriod" :selectedIndex="1">
            </JqxDropDownList>
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <table>
              <colgroup>
                <col width="50%">
              </colgroup>
              <tr>
                <td>
                  <JqxTree class="widgetType" ref="grpTree"
                           :width="300"
                           :height="'400'"
                           :treeStyle="'width:0px;height:200;'"
                           :defaultIdx="0"
                           @itemClick ="onItemClick($event)"
                        />
                </td>
                <td>
                  <table>
                    <tr>
                      <td>
                        <div style="width: 80px; float: left;">
                          <JqxDropDownList class="p_combo" ref="searchTypeDev"
                                           :width="100" :height="25" :autoDropDownHeight="true" :popupZIndex="10000"
                                           :source="srcSource" :selectedIndex="0">
                          </JqxDropDownList>
                        </div>
                        <div style="float: left; margin-left: 5px; width: 195px;">
                          <input type="text" class="p_inputTxt" v-model="srchTextDev" v-on:keyup.enter="searchDev" style="margin-bottom: 5px;">
                        </div>
                        <grid ref="dev" :id="'devGrid'"></grid>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
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
import JqxTree from '@/lib/jqwidgets/vue/vue_jqxtree.vue'
import SetTitle from './SetTitle';
import DropDownTree from '../../components/jqx/DropDownTree';
import Grid from '../jqx/Grid'
import JqxDropDownList from '@/lib/jqwidgets/vue/vue_jqxdropdownlist.vue';
export default {
  components:{
    DropDownTree,
    SetTitle,
    Grid,
    JqxTree,
    JqxDropDownList
  },
  props: {
    /* 위젯item db data */
    popupParams: Object,
    id: String ,
    url: String
  },
  mounted() {
    this.$emit('resize', 650, 250)

    let data = this.popupParams;
    let conf = JSON.parse(data.conf);
    if(conf) {
      let {grpNo,  mngNo, tableCnt, itemType} = conf;
      this.grpNo = grpNo ? grpNo : 1;
      this.mngNo = mngNo ? mngNo : -1;
      this.period = tableCnt ? tableCnt : 2;
      this.itemType = itemType ? itemType : 1;

      this.orgConf = {...conf};
    }
    this.$refs.perfItemType.val(this.itemType);
    this.$refs.perfPeriod.val(this.period);


    //SetTitle.vue 기본 위젯의 설정 값 모두 가져오기
    for(let key of Object.keys(this.$refs.setTitle.$refs)){
      this.$refs.setTitle[key] = data[key];
    }

    this.createGrpTree();
    this.createDevGrid();

  },
  data() {
    return {
      orgConf: null,
      treeData: [],
      grpNo: 1,
      mngNo: -1,
      period: 2,
      itemType: 1,
      source: [
        {label: 'CPU', value: '1'},
        {label: 'MEMMORY', value: '2'},
        {label: '온도', value: '5'},
        {label: '응답시간', value: '6'},
        {label: '세션', value: '11'}
      ],
      srchTextDev: '',
      srcSource: [
        {label: '장비명', value: 'NAME'},
        {label: 'IP', value: 'IP'}
      ],
      srcPerfPeriod: [
        {label:'5분', value: 1},
        {label:'1시간', value: 2},
        {label:'24시간', value: 3},
      ],
    }
  },

  methods: {
    createGrpTree: function (event) {
      const cur = this;
      //todo url 값 변수로 처리 하여 공통 컴포넌트로 사용 필요
      this.$axios.get('/api/nms/getGrpDevList').then((res) => {
        for (let i in res) {
          let iconName = 'mono-dev.svg';
          if(res[i].devKind2 == 'GROUP') iconName = 'mono-grp.svg'
          cur.treeData.push({
            valueName: res[i].grpNo,
            displayName: res[i].grpName,
            icon: '../../../static/img/tree/'+iconName,
            parentName: res[i].grpParent,
            test: res[i].devKind2
          });
        }

        var adapter = new $.jqx.dataAdapter(
          {
            datatype: 'json',
            datafields: [
              {name: 'parentName'},
              {name: 'displayName'},
              {name: 'valueName'},
              {name: 'icon'}

            ],
            localdata: this.treeData
          },
          {
            autoBind: false,
            async: false
          }
        );
        adapter.dataBind();

        this.$refs.grpTree.source = adapter.getRecordsHierarchy('valueName', 'parentName', 'items',
          [
            {name: 'displayName', map: 'label'},
            {name: 'valueName', map: 'value'},
            {name: 'parentName', map: 'parentType' },
          ]);

        this.$refs.grpTree.expandAll();

        const items = this.$refs.grpTree.getItems();
        let selected;
        for(const item of items) {
          if(item.value == this.grpNo) {
            selected = item;
            break;
          }
        }
        this.$refs.grpTree.selectItem(selected);
        this.searchDev();
      })
    },
    
    /* 트리 click event */
    onItemClick(event) {
      this.mngNo = -1;

      const treeItem = event.args.owner.selectedItem;
      this.grpNo = treeItem.value;

      this.searchDev();
    },

    createDevGrid() {
      this.$hmGrid.create(this.$refs.dev.$refs.devGrid, {
        columns: [
          {text: '장비명', datafield: 'disDevName', minwidth: 100},
          {text: 'IP', datafield: 'devIp', width: 102, cellsalign: 'center', editable: false },
        ],
        //height: '300px',
        autoheight: false,
        selectionmode: 'singlerow'
      });

      // 장비 click event
      this.$refs.dev.onRowclick = (evt) => {
        var rowData = evt.args.row.bounddata;
        this.mngNo = rowData.mngNo;
      };

      const mngNo = this.mngNo;
      this.$refs.dev.onBindingcomplete = (evt) => {
        const items = this.$refs.dev.$refs.devGrid.getrows();
        let selectedIdx = -1;
        
        for(const item of items) {
          if(item.mngNo == mngNo) {
            selectedIdx = item.boundindex;
            break;
          }
        }
        this.$refs.dev.$refs.devGrid.selectrow(selectedIdx);
      }
    },

    cancel() {
      this.$parent.close();
    },

    searchDev() {
      let srcParams = {
        text: this.srchTextDev,
        type: this.$refs.searchTypeDev.getSelectedItem().value,
        grpNo: this.grpNo
      };
      this.$hmGrid.refreshData(this.$refs.dev.$refs.devGrid, '/api/nms/getDevList', srcParams)
    },

    save() {
      if(!this.validation()) return;
      let widgetBasicData = this.$store.state.widget.widgetBasicData;
      let widgetConfData = this.$store.state.widget.widgetConfData;
      const itemType = this.$refs.perfItemType.getSelectedItem().value; //지표
      const period = this.$refs.perfPeriod.val(); //수집주기

      let conf = {
        grpNo: this.grpNo,
        mngNo: this.mngNo, 
        itemType: itemType, 
        icon: this.$refs.setTitle.setIconVal,
        tableCnt: period
      }
      let paramsConf = {...this.orgConf, ...conf};

      const confStr = JSON.stringify(paramsConf);

      let params = {};
      params.conf = confStr;

      let editData = { ...this.popupParams, ...widgetBasicData, ...widgetConfData, ...params };
      editData.curTime = new Date().getTime();
      this.$emit('completed', editData);

      this.cancel();
    },

    validation() {
      if(this.mngNo < 0) {
        alert('장비를 선택해주세요.');
        return false;
      }
      return true;
    }
  },
}
</script>

<style>
  

</style>
