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
                             :width="'100%'" :height="25" :autoDropDownHeight="true"
                             :popupZIndex="10000"
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
          <th>조회시간</th>
          <td>
            <JqxDropDownList class="p_combo" ref="perfDataTime"
                             :width="'100%'" :height="25" :autoDropDownHeight="true"
                             :popupZIndex="10000"
                             :source="srcPerfDataTime" :selectedIndex="5">
            </JqxDropDownList>
          </td>
        </tr>
      </table>
    </div>
    <div class="pop_table">
      <table>
        <tr>
          <td colspan="2">
            <table>
              <colgroup>
                <col width="45%">
              </colgroup>
              <tr>
                <td>
                  <!--<grid ref="dev" :id="'devGrid'"></grid>-->
                  <JqxTree class="widgetType" ref="grpTree"
                           :width="270"
                           :height="'500'"
                           :treeStyle="'width:0px;height:200;'"
                           :defaultIdx="0"
                           @itemClick="onItemClick($event)"
                           style="background:#000"
                        />
                </td>
                <td  style="padding-right:0">
                  <table>
                    <tr>
                      <td style="padding-right:0">
                        <!--<div class="pop_gridTitle" style="color: whitesmoke">대상 장비</div>-->
                        <div style="width: 80px; float: left;">
                          <JqxDropDownList class="p_combo" ref="searchTypeDev"
                                           :popupZIndex="10000"
                                           :width="'100%'" :height="25" :autoDropDownHeight="true"
                                           :source="srcSource" :selectedIndex="0">
                          </JqxDropDownList>
                        </div>
                        <div style="float: left; margin-left: 5px; width: 241px;">
                          <input type="text" class="p_inputTxt" v-model="srchTextDev" v-on:keyup.enter="searchDev" style="margin-bottom: 5px;">
                        </div>
                        <grid ref="dev" :id="'devGrid'"></grid>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-right:0">
                        <!--<div class="pop_gridTitle" style="color: whitesmoke">대상 회선</div>-->
                        <div style="width: 80px; float: left;">
                          <JqxDropDownList class="p_combo" ref="searchTypeIf"
                                           :popupZIndex="10000"
                                           :width="'100%'" :height="25" :autoDropDownHeight="true"
                                           :source="srcIfSource" :selectedIndex="0">
                          </JqxDropDownList>
                        </div>
                        <div style="float: left; margin-left: 5px; width: 241px;">
                          <input type="text" class="p_inputTxt" v-model="srchTextIf" v-on:keyup.enter="searchIf" style="margin-bottom: 5px;">
                        </div>
                        <grid ref="if" :id="'ifGrid'"></grid>
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
import HmUtil from '../../js/common/hm.util';
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

    //데이터 세팅
    if(conf) {
      let {grpNo,  mngNo, ifIdx, tableCnt, itemCol, perfDataTime} = conf;

      this.orgConf = {...conf};
      this.grpNo = grpNo ? grpNo : 1;
      this.mngNo = mngNo ? mngNo : -1;
      this.ifIdx = ifIdx ? ifIdx : -1;
      this.period = tableCnt ? tableCnt : 2;
      this.itemCol = itemCol ? itemCol : 'BPS';
      this.perfDataTime = perfDataTime ? perfDataTime : 24;
    }

    this.$refs.perfItemType.val(this.itemCol);
    this.$refs.perfPeriod.val(this.period);
    this.$refs.perfDataTime.val(this.perfDataTime);

    //SetTitle.vue 기본 위젯의 설정 값 모두 가져오기
    for(let key of Object.keys(this.$refs.setTitle.$refs)){
      this.$refs.setTitle[key] = data[key];
    }

    this.createGrpTree();
    this.createDevGrid();
    this.createIfGrid();

  },
  data() {
    return {
      orgConf: null,
      treeData: [],
      grpNo: 1,
      mngNo: -1,
      period: 2,
      itemCol: '',
      devName: '',
      ifName: '',
      source: [
        {label: 'BPS', value: 'BPS'},
        {label: 'BPS(%)', value: 'BPSPER'},
        {label: 'PPS', value: 'PPS'}
      ],
      srcSource: [
        {label: '장비명', value: 'NAME'},
        {label: 'IP', value: 'IP'}
      ],
      srcIfSource: [
        {label: '회선명', value: 'NAME'},
        {label: 'IP', value: 'IP'}
      ],
      srcPerfPeriod: [
        {label:'5분', value: 1},
        {label:'1시간', value: 2},
        {label:'24시간', value: 3},
      ],
      srcPerfDataTime: [
        {label:'4시간', value: 4},
        {label:'8시간', value: 8},
        {label:'12시간', value: 12},
        {label:'16시간', value: 16},
        {label:'20시간', value: 20},
        {label:'24시간', value: 24},
      ],
      srchTextDev: '',
      srchTextIf: '',
      perfDataTime: 24
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

        // this.grpItems = items;
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
        // this.$refs.grpTree.selectItem(this.$refs.grpTree.getItems()[0]);
      })
    },

    /* 트리 click event */
    onItemClick(event) {
      this.mngNo = -1;
      this.ifIdx = -1;
      this.$refs.if.$refs.ifGrid.clear(); //회선 그리드 초기화

      const treeItem = event.args.owner.selectedItem;
      this.grpNo = treeItem.value;

      this.searchDev();
    },

    createDevGrid() {

      this.$hmGrid.create(this.$refs.dev.$refs.devGrid, {
        columns: [
          {text: '그룹', datafield: 'grpName', width: 90},
          {text: '장비명', datafield: 'disDevName', minwidth: 100},
          {text: 'IP', datafield: 'devIp', width: 100, cellsalign: 'center', editable: false },
        ],
        height: '200px',
        autoheight: false,
        selectionmode: 'singlerow'
      });

      // 장비 click event
      this.$refs.dev.onRowclick = (evt) => {
        var rowData = evt.args.row.bounddata;
        this.mngNo = rowData.mngNo;
        this.devName = rowData.disDevName;
        this.ifIdx = -1;
        this.searchIf();
      };

      this.$refs.dev.onBindingcomplete = (evt) => {
        const items = this.$refs.dev.$refs.devGrid.getrows();
        let selectedIdx = -1;
        for(const item of items) {
          if(item.mngNo == this.mngNo) {
            selectedIdx = item.boundindex;
            this.searchIf() // binding 이 여러 번 타서..
            break;
          }
        }
        this.$refs.dev.$refs.devGrid.selectrow(selectedIdx);
      }
    },

    createIfGrid() {
      this.$hmGrid.create(this.$refs.if.$refs.ifGrid, {
        columns: [
          {text: '회선명', datafield: 'ifName', width: 90},
          {text: '별칭', datafield: 'ifAlias', minwidth: 102, cellsalign: 'center', editable: false },
          {text: 'IP', datafield: 'ifIp', width: 100, cellsalign: 'center', editable: false },
        ],
        height: '200px',
        autoheight: false,
        selectionmode: 'singlerow',
      });

      // 회선 click event
      this.$refs.if.onRowclick = (evt) => {
        var rowData = evt.args.row.bounddata;
        this.ifIdx = rowData.ifIdx;
        this.ifName = rowData.ifName;
        this.searchIf();
      };

      this.$refs.if.onBindingcomplete = (evt) => {
        const items = this.$refs.if.$refs.ifGrid.getrows();
        let selectedIdx = -1;
        for(const item of items) {
          if(item.ifIdx == this.ifIdx) {
            selectedIdx = item.boundindex;
            break;
          }
        }
        this.$refs.if.$refs.ifGrid.selectrow(selectedIdx)
      }
    },

    /* 장비 검색 */
    searchDev() {
      let srcParams = {
        text: this.srchTextDev, //검색 키워드
        type: this.$refs.searchTypeDev.getSelectedItem().value, //장비명 or IP
        grpNo: this.grpNo
        // mngNo: this.mngNo
      };

      this.$hmGrid.refreshData(this.$refs.dev.$refs.devGrid, '/api/nms/getDevList', srcParams)

    },

    /* 회선 검색 */
    searchIf() {
      let srcParams = {
        text: this.srchTextIf,
        type: this.$refs.searchTypeIf.getSelectedItem().value,
        mngNo: this.mngNo
      };
      this.$hmGrid.refreshData(this.$refs.if.$refs.ifGrid, '/api/nms/getIfList', srcParams)
    },

    save() {

      if(!this.validation()) return;
      //setTitle 기초 데이터
      let widgetBasicData = this.$store.state.widget.widgetBasicData;
      let widgetConfData = this.$store.state.widget.widgetConfData;

      const itemCol = this.$refs.perfItemType.getSelectedItem().value; //지표
      const period = this.$refs.perfPeriod.val(); //수집주기
      const time = this.$refs.perfDataTime.val(); //조회시간
      const timeInfo = HmUtil.formatDateAgo(time) //조회시간에 따른 시작시간

      let conf = {
        itemCol: itemCol,
        grpNo: this.grpNo,
        mngNo: this.mngNo,
        ifIdx: this.ifIdx,
        tableCnt: period,
        perfDataTime: time
      }
      let paramsConf = {...this.orgConf, ...conf, ...timeInfo};

      const confStr = JSON.stringify(paramsConf);

      let params = {};
      /*params.name = this.$refs.setTitle.setTitleVal;
      params.seqNo = this.popupParams.itemSeq;
      params.icon = this.$refs.setTitle.setIconVal;
      params.title = this.$refs.setTitle.setTitleDisplay;*/

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
      if(this.ifIdx < 0) {
        alert('회선을 선택해주세요.');
        return false;
      }
      return true;
    },

    cancel() {
      this.$parent.close();
    },

  },
}
</script>
