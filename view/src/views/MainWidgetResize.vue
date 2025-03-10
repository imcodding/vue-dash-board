<template>
<div id="dashMain">
  <form ref="hForm" id="hForm"></form>
  <div id="dashBox">
    <div id="hd-All-Content" :style="this.$store.state.imageMainPath">
      <Header
        @openSlide="openSlide"
        @refreshData="refresh"
        @setDashCofig="setDashCofig"
        @isChangeWidget = "isChangeWidget"
        @setParentScale = "setParentScale"
      />
    </div>

    <div style="position:absolute; inset:80px 0 0 0;">
      <VueDragResize v-for="(item, idx) in list"
        :class="borderClass()"
        :key="item.itemSeq"
        :z="999"
        :w="item.width"
        :h="item.height"
        :x="item.x"
        :y="item.y"
        :id="'resizeBox'+idx"
        :data-value="idx"
        :parentW="0"
        :parentH="0"
        :parentLimitation="true"
        :isActive="item.isActive"
        :preventActiveBehavior="item.isPrevent"
        :snapToGrid="true"
        :parentScaleX="parentScaleX"
        :parentScaleY="parentScaleY"
        :gridX="5"
        :gridY="5"
        @dragging="onChangeStop($event, idx)"
        @resizestop="onChangeStop($event, idx)">

        <div class="hd-column" id="hd-Content-main">
          <div class="hd-title-section">
            <!--<div class="hd-tit-icon-section">-->
              <!--<div class="hd-tit-icon LineUse"></div>-->
            <!--</div>-->
            <div class="hd-title">{{item.name}}
              <img src="@/assets/images/hd-Section-Tit-Icon/Set.svg"
                class="panel-btn"
                v-if="slideVisible"
                @click="confPanel(item, idx)"/>
              <img src="@/assets/images/hd-Section-Tit-Icon/Delete.svg"
                class="panel-btn"
                v-if="slideVisible"
                @click="deletePanel(idx)"/>
              <img src="@/assets/images/hd-Section-Tit-Icon/Edit.svg"
                class="panel-btn"
                v-if="slideVisible"
                @click="copyPanel(item)"/>
              <img src="@/assets/images/hd-Section-Tit-Icon/Refresh.svg"
              class="panel-btn"
              v-if="slideVisible"
              @click="restorePanel(item, idx)"/>
            </div>
          </div>
          <div class="hd-section-content">

              <widget-controller
              :display="item.display"
              :wref="item.wref"
              :id="item.id"
              :seq="item.itemSeq"
              :key="item.itemSeq+'_'+item.curTime"
              :refreshKeyTime = "refreshKeyTime"
              :conf="item.conf"
              />

          </div>
        </div>
      </VueDragResize>
    </div>
    <div id="grid" class="d3-grid-box"></div>
  </div>



  <div id="widgetBox" class="widgetBox">
    <div class="hd-top-menu">
      <div><img src="src/assets/images/slide/nav-open.svg"> </div>
      <div>Vue 대시보드
        <button style="float: left" @click="popup(1)">팝업1</button>
        <button style="float: left;" @click="popup(2)">팝업2</button>
        <button style="float: left;" @click="popup(3)">팝업3</button>
      </div>
      <div>
        <button class="btn widgetBtn" @click="addLayoutWidget">추가</button>
        <button class="btn widgetBtn" @click="saveLayoutWidget">저장</button>
      </div>
    </div>
    <widget-slide @setLayout="setLayoutWidget" />

  </div>
  <layer-popup ref="pWindow" :name="popupName" :popupParams="popupParams" @callbackPopup="callbackPopup"></layer-popup>
  <modal-popup v-if="isModal"
  :name="popupName"
  :params="popupParams"
  @completed="completedModal"
  @close="modal"
  />
</div><!-- //dashMain -->
</template>

<script>
import Header from '../components/Header.vue'
import Topology from '../components/panel/Topology.vue';
import VueDragResize from 'vue-drag-resize'
import WidgetController from '../components/WidgetController.vue'
import WidgetSlide from '../components/WidgetSlide.vue';
import LayerPopup from '../components/jqx/LayerPopup.vue';
import SetRefreshTime from '../components/popup/SetRefreshTime.vue';
import WidgetControlJS from '@/js/common/widget/widget.control.js'
import ModalPopup from '../components/popup/ModalPopup.vue';

export default {
  components: {
    VueDragResize,
    WidgetController,
    Header,
    Topology,
    WidgetSlide,
    LayerPopup,
    SetRefreshTime,
    WidgetControlJS,
    ModalPopup
  },

  data() {
    return {
        list: [],
        orgList:[],
        slideVisible: false,
        selectedRectIdx: -1,
        popupParams: {},
        popupName: '',
        gridVisible: 'none',
        refreshKeyTime: 0,
        isModal: false,
        editList: [],
        parentScaleX: 1,
        parentScaleY: 1,
    }
  },

  created() {
    this.$store.commit('setImagePath')
    this.$store.dispatch('dashConf'); //대시보드 전역 설정 관련
  },

  mounted() {
    this.initialize();
  },

  updated(){

  },

  methods: {
    initialize() {
      this.initLayoutWidget();
    },

    initLayoutWidget(){
      this.$axios.get('/api/getWidgetResizeList').then((res) => {
        Object.assign(this.orgList, res);
        Object.assign(this.editList, res);

        /** todo 개별 위젯 새로고침용 구분 :key 값 (curTime)
         query 에서 AS curTime 로 생성하여 전달 하고자 하였지만 sql 에서 Millisecond
         구하기 쉽지 않아 script에서 강제로 key:value 추가... 추후 더 나은 방안으로 개선 필요
         */
        for(let widgetList of res){
            widgetList.curTime = new Date().getTime();
        }

        this.list = res;

        if(!this.slideVisible) this.makeFixLayoutBox();
      })
    },
    refresh(curTime) {
      //컴포넌트 새로고침 key
      //WidgetController.vue props data. input hidden value setting
      this.refreshKeyTime = curTime;
    },

    openSlide() {
      this.slideVisible = !this.slideVisible
      this.makeMoveLayoutBox();
      this.showGridLine();
    },

    /*==============================
      개별 위젯 데이터 변경 유무 감지
      header에서 updated로 변수 세팅 값이 슬라이드 on/off function 보다 해더 늦게 적용 되어 store 사용
    ==============================*/
    isChangeWidget(){
      _.isEqual(this.orgList, this.editList) ? this.$store.commit('setIsChangeWidget', false)  : this.$store.commit('setIsChangeWidget', true);
    },

    borderClass() {
      return this.slideVisible ? 'border-white' : ''
    },

    showGridLine() {
      let visible = this.slideVisible ? 'block' : 'none'
      let gridList = document.getElementsByClassName('axis-grid');
      for(const grid of gridList) grid.style.display = visible;
    },

    /*==============================
      VueDraggable
    ==============================*/
    makeFixLayoutBox() {
      for(const rect of this.list) {
        rect.isActive = false;
        rect.isPrevent = true;
      }
    },

    makeMoveLayoutBox() {


      for(let i = 0; i < this.list.length; i++) {
        let data = this.list[i];
        data.isPrevent = !data.isPrevent;
        data.isActive = false;
        this.list.splice(i, 1, data)
      }
    },

    onChangeStop(rect, idx) {

      let rectList = this.list;

      //이전에 선택한 패널에 대한 active 점선 표시 없애기 위함
      let beforeData = rectList[this.selectedRectIdx]
      if(beforeData) {
        beforeData.isActive = false;
        this.list.splice(this.selectedRectIdx, 1, beforeData)
      }

      let data = rectList[idx];
      data.isActive = true;
      rect.x = rect.left;
      rect.y = rect.top;
      rect = {...data, ...rect};

      this.list.splice(idx, 1, rect);

      //drag,resize 시 데이터 변경 유무 감지
      let editData = {
        ...data,
        x : rect.left,
        y : rect.top
      };
      this.editList.splice(idx, 1, editData);

      this.selectedRectIdx = idx;

    },

    setLayoutWidget(widgetItem) {
      let idx = this.selectedRectIdx;
      if(idx < 0) { alert('레이아웃을 선택해주세요.'); return; }
      if(this.D3Topology.vars.svgGroup != null) {}
      let data = this.list[idx];

      this.list.splice(idx, 1, {...data,...widgetItem})
    },

    /**
     * 화면 크기에 맞게 VueDragResize scale 조정
     * 마우스 커서가 VueDragResize 점선과 동일하게 이동되도록 하기 위해
     */
    setParentScale(scaleX, scaleY) {
      this.parentScaleX = scaleX;
      this.parentScaleY = scaleY;
    },

    /*==============================
      슬라이드 버튼 제어
    ==============================*/
    addLayoutWidget() {

      let resizeDefault={
        width: 350,
        height: 230,
        x: 0,
        y: 0
      };

      if(!this.findDefaultRect()) this.list.push(resizeDefault);
      else {
        let dist = 10; // 간격
        let xMax = -1;
        let yMax = -1;

        for(const rect of this.list) {
          let a = rect.x / dist
          let b = rect.y / dist
          let c = rect.x % dist
          let d = rect.y % dist

          if(a != b) continue
          // if(rect.x % dist != 0 || rect.y % dist != 0) continue

          if(a > xMax) xMax = a;
          if(b > yMax) yMax = b;
        }

        resizeDefault.x = (xMax + 1) * dist;
        resizeDefault.y = (yMax + 1) * dist;

        this.list.push(resizeDefault)
      }
      return;
    },

    findDefaultRect() {
      for(const rect of this.list) {
        if(rect.x == 0 && rect.y == 0) return true;
      }
      return false;
    },

    saveLayoutWidget() {
      this.$axios.post('/api/addWidgetResizeList', {list: this.list})
        .then(() => {
            alert("저장되었습니다.");
            this.initLayoutWidget();
        })
    },

    /*==============================
      패널 버튼 제어
    ==============================*/
    restorePanel(item, index) {
      let restoreData = {};
      //크기 및 위치 설정은 이슈 있어서 제외하고 위젯만 되돌리는 형태
      if(item.itemSeq) { restoreData = this.orgList[index]; }

      restoreData.width = item.width;
      restoreData.height = item.height;
      restoreData.x = item.x;
      restoreData.y = item.y;

      this.list.splice(index, 1, restoreData)
    },

    copyPanel(item) {
      var copyItem = {...item};
      copyItem.x += 50;
      copyItem.y += 50;
      copyItem.itemSeq = this.list[this.list.length - 1].itemSeq + 1;

      this.list.push(copyItem);
    },

    deletePanel(index) {
      if(!confirm('삭제하시겠습니까?')) return;
      this.list.splice(index, 1)
      this.orgList.splice(index, 1)
    },

    /*==============================
      설정 팝업
    ==============================*/
    // popup emit (layer -> custPopup 연결)
    callbackPopup(params){
      const selectIdx = params.idx;
      this.list.splice(selectIdx, 1, params)
    },

    setDashCofig(){
      this.popupName = 'SetDash';
      this.$popup.open(this.$refs.pWindow, '대시보드 설정', 400, 260, {})
    },

    /*==============================
      패널 개별 설정 팝업
    ==============================*/
    confPanel(item, idx) {
      const widgetItems = WidgetControlJS.items[item.id]; //widget.control.js에 선언한 설정팝업 종류 호출 topn, i/o, auth .. 등
      const widgetConf = widgetItems.conf; //선언된 conf 값으로 실제 팝업 명칭 맵핑 ~ + Conf.vue (TopnConf.vue..)

      this.popupName = widgetConf + 'Conf';
      this.popupParams = item;
      this.popupParams.idx = idx;
      this.popupParams.conf = item.conf;
      this.modal();
    },
    modal() {
      this.isModal = !this.isModal;
    },
    completedModal(params) {
      const selectIdx = params.idx;
      this.list.splice(selectIdx, 1, params)
      this.editList.splice(selectIdx, 1, params);
    },

    //퍼블리싱용 샘플 팝업
    popup(type){
      this.popupName = 'temp_'+type;
      this.popupParams = null;
      this.modal();
    }
  }
}
</script>

<style scoped>
  .widgetBtn {
    display: block;
    float: right;
    margin: 5px 10px 0 0;
    background:#363B4C!important;
    color:#ffffff!important;
    border:none!important;
  }
</style>
