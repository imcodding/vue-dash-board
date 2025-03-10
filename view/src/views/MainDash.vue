<template>
<div>
  <div id="dashMain" :class="this.$store.state.theme + 'Theme'">
  <form ref="hForm" id="hForm"></form>
  <div id="dashBox">
    <div id="hd-All-Content" :style="this.$store.state.imageMainPath" ref="mainDiv">
    <!-- <div style="position:absolute; inset:80px 0 0 0;"> -->
      <VueDragResize v-for="(rect, index) in rects"
        :class="rectClass()"
        :type="rect.type"
        :key="rect.itemSeq + '_' + index"
        :w="rect.width"
        :h="rect.height"
        :x="rect.left"
        :y="rect.top"
        :z="9999"
        :parentW="0"
        :parentH="0"
        :parentLimitation="true"
        :snapToGrid="rect.snapToGrid"
        :gridX="5"
        :gridY="5"
        :id="'resizeBox'+index"
        :data-value="index"
        :preventActiveBehavior="rect.prevent"
        :isActive="rect.active"
        :isResizable="rect.resizable"
        :parentScaleX="parentScaleX"
        :parentScaleY="parentScaleY"
        v-on:activated="activateRect(index, rect)"
        v-on:deactivated="deactivateRect(index)"
        v-on:dragging="changeRect($event, index)"
        v-on:resizing="changeRect($event, index)"
        >
<!--         <div id="hd-header"> -->
          <div class="tabs" v-if="tabUse && rect.type == 'TAB'">
            <ul>
              <div v-for="(tab, index) in tabs">
                <li v-if="tab.useFlag && (currTabSeq == tab.tabSeq)" class="active">
                  <a href="#"><span></span><span></span><span></span><span></span>{{tab.tabName}}</a>
                </li>
                <li v-else-if="tab.useFlag" @click="goTab(tab.tabSeq)">
                  <a href="#"><span></span><span></span><span></span><span></span>{{tab.tabName}}</a>
                </li>
              </div>
            </ul>
          </div>
          <div id="headerTitle" v-if="rect.type == 'TITLE'" class="hd-Main-Title">
            {{ rect.name }}
          </div>
          <div id="logo" v-else-if="rect.type == 'LOGO'" :style="logoPath"></div>
            <div v-else-if="rect.type == 'TIMESET'" id="hd-Admin">
            <div id="hd-Admin-Function">
              <div class="hd-date" id="headerDate"><span>{{currDate}}</span><span>|</span><span>{{currTime}}</span></div>
              <div class="lightAnimation"></div>
            </div>
            <div id="hd-Admin-Button" >
                <div class="hd-btn">
                    <div class="max" @click="fullScreen()"></div>
                    <div class="mini" @click="fullScreen()" id="mini"></div>
                    <div class="volume" @click="sound(true)"></div>
                    <div class="mute" @click="sound(false)"></div>
                    <div class="setting" @click="setDashConfig"></div>
                    <div :class="{'setEdit':!isPanelEdit, 'setEditOn':isPanelEdit}" @click="enablePanelEdit" id="setEdit"></div>
                    <span v-show="!noChange" style="font-size: 11px;color: orange;display: inline-block;width: 300px;right: -3px;position: absolute;top: -15px;">변경사항이 있습니다. 버튼을 다시 클릭하여 저장해주세요.</span>
                </div>
            </div>
          </div>
        <!-- </div> -->
        <div v-if="rect.type == 'WIDGET'" class="hd-column" :id="'hd-Content-main_'+index">
          <div v-if="rect.display == 'Topology'" class="map-grp">
            <div>그룹:</div>
            <div id="map_curGrpNm"></div>
          </div>
          <div :class="titleClass(rect)"> <!-- 타이틀 사용/숨김 -->
              <div class="hd-tit-icon-section" v-if="rect.icon === 'true' && rect.title === 'true'"> <!-- 아이콘 설정 여부(아이콘은 타이틀을 사용 할 경우만) -->
                <i class="icon-arrow"></i>

                <!-- 타이틀 아이콘 설정-->
                <div v-if="rect.titleIcon == null" class="hd-tit-icon" style="background: url('/static/img/LineUse.svg')"></div>
                <div v-else class="hd-tit-icon" :style="titleIconStyle(rect.titleIcon)"></div>
              </div>
              <div class="hd-title">
                <span v-if="rect.title === 'true'">{{rect.name}}</span>
                <div class="hd-setting">
                  <div class="panel-set panel-btn"
                       v-if="slideVisible || isPanelEdit"
                       @click="confPanel(rect, index)"></div>
                  <div
                    class="panel-delet panel-btn"
                    v-if="slideVisible"
                    @click="deletePanel(index)"></div>
                  <div
                    class="panel-edit panel-btn"
                    v-if="slideVisible"
                    @click="copyPanel(rect)"></div>
                  <div
                    class="panel-refre panel-btn"
                    v-if="slideVisible"
                    @click="restorePanel(rect, index)"></div>
                </div>
              </div>
          </div>
          <div class="hd-section-content">
              <widget-controller
              :display="rect.display"
              :wref="rect.wref"
              :id="rect.id"
              :seq="rect.itemSeq"
              :conf="rect.conf"
              :key="rect.itemSeq + '_' + rect.curTime"
              :refreshKeyTime = "refreshKeyTime"
              :idx="index"
              />
          </div>
        </div>
      </VueDragResize>
      <div v-if="this.$store.state.isAdmin" class="slideBtn" @click="showSlide()">
        <img v-if="!isSlideOpen" src="@/assets/images/slide/arrow_open.svg" style="width:30px;height:30px">
        <img v-else src="@/assets/images/slide/arrow_close.svg" style="width:30px;height:30px">
      </div>
    </div>
    <div id="grid" class="d3-grid-box"></div>
  </div>


  <div id="widgetBox" class="widgetBox">
    <div class="hd-top-menu">
      <div><img src="@/assets/images/slide/nav-open.svg"> </div>
      <div>Vue 대시보드</div>
      <div>
        <button class="btn widgetBtn" @click="setDashTab">탭</button>
        <button class="btn widgetBtn" @click="addLayoutWidget">추가</button>
        <button class="btn widgetBtn" @click="saveLayoutWidget">저장</button>
      </div>
    </div>
    <widget-slide @setLayout="setLayoutWidget" />

  </div>
  </div><!-- //dashMain -->

  <modal-popup v-if="isModal"
  :name="popupName"
  :params="popupParams"
  :width="popupWidth"
  :height="popupHeight"
  :title="popupTitle"
  @completed="completedModal"
  @close="modal"
  />
  <!-- 컬럼관리 -->
  <Popup></Popup>

  <div class="speech-bubble" style="float: left; width: 220px;">
    X: {{this.tooltipObj.left}}
    Y: {{this.tooltipObj.top}}
    W: {{this.tooltipObj.width}}
    H: {{this.tooltipObj.height}}
  </div>
</div>
</template>

<script>
import Header from '../components/Header.vue'
import Topology from '../components/panel/Topology.vue';
import VueDragResize from 'vue-drag-resize'
import WidgetController from '../components/WidgetController.vue'
import WidgetSlide from '../components/WidgetSlide.vue';
import SetRefreshTime from '../components/popup/SetRefreshTime.vue';
import WidgetControlJS from '@/js/common/widget/widget.control.js'
import ModalPopup from '../components/popup/ModalPopup.vue';
import * as d3 from 'd3';
import Popup from '../components/popup/Popup.vue';

export default {
  components: {
    VueDragResize,
    WidgetController,
    Header,
    Topology,
    WidgetSlide,
    SetRefreshTime,
    WidgetControlJS,
    ModalPopup,
    Popup
  },

  data() {
    return {
      parentScaleX: 1,
      parentScaleY: 1,
      slideVisible: false,
      selectedRectIdx: -1,

      isModal:false,
      popupName:'',
      popupParams: {},
      popupWidth: 350,
      popupHeight: 170,
      popupTitle: '',

      editRects: [],
      noChange: true,

      currDate: '',
      currTime: '',
      refreshCnt: 0,
      timeCnt: 0,
      isSlideOpen: false,

      isPanelEdit: false,

      audio: null,

      currTabIdx: 0,
      currTabSeq: 1,
      tooltipObj: {}
    }
  },

  created() {
    d3.select(window).on("resize", this.resizeWin);

    this.$store.dispatch('dashConf'); //대시보드 전역 설정 관련
    this.$store.dispatch('set/initTabs'); //탭 설정
    this.$store.dispatch('rect/initRects', {});
    this.$store.dispatch('widget/evtConf'); //이벤트 기본 설정
    this.$store.dispatch('code/initCodes'); //웹설정 관련 기본 코드(WEB_CONF)

    this.audio = new Audio('/static/audio/default.mp3');

  },

  mounted() {
    this.$store.dispatch('dash/createGridLine');

    this.resizeWin();
    setInterval(this.timer, 1000);
    document.onkeydown = this.fkey;
  },

  computed: {
    rects() {
      return this.$store.state.rect.rects
    },
    refreshKeyTime() {
      return this.$store.state.dash.keyTime
    },
    logoPath() {
      return this.$store.state.imageLogoPath
    },
    tabs() {
      this.currTabSeq = this.$store.state.set.currTabSeq;
      return this.$store.state.set.tabs
    },
    tabUse() {
      return this.$store.state.set.tabUse
    }
  },

  methods: {
    templateList(){

      this.popupName = 'TemplateConf';
      this.popupWidth = 350;
      this.popupHeight = 600;
      this.popupTitle = 'TEST';
      this.popupParams.currTabSeq = this.currTabSeq;
      this.modal();
    },
    templateAdd(){
      this.popupName = 'TemplateAdd';
      this.popupWidth = 350;
      this.popupHeight = 200;
      this.popupTitle = 'TEST';
      this.popupParams.currTabSeq = this.currTabSeq;
      this.popupParams.targetRef = this.$refs.mainDiv;
      this.modal();

      return
      //여기
      let myImg;
      let settingCanvas = this.$refs.mainDiv;
      html2canvas(settingCanvas, {backgroundColor: 'black'}).then(canvas => {
          myImg = canvas.toDataURL("image/png");
          myImg = myImg.replace("data:image/png;base64,", "");

          this.$axios.post('/api/addCaptureWidget', {myImg: myImg, width: 200, height:200})
          .then(() => {
            alert("저장되었습니다.");
            //this.initLayoutWidget();
          })

      });
    },
    fkey(e) {
      if(e.keyCode === 116) {
        if(!this.noChange) {
          if(!confirm('변경사항이 있습니다. 저장하시겠습니까?')) return;
          this.enablePanelEdit();
        }
      }
      if (e.keyCode === 27) { //press esc
        this.isModal = false;
      }
    },

    goTab(tabSeq){
      this.currTabSeq = tabSeq;
      // this.currTabIdx = tabIdx;
      this.$store.dispatch('set/editCurrTabSeq', tabSeq);
      this.$store.dispatch('rect/initRects', {mode:'', tabSeq: tabSeq});

      if(this.isSlideOpen) this.showSlide(); //탭 이동시 슬라이드 영역 off
    },

    showCurrPosition(index, rect) {
      $("#hd-Content-main_" + index).mousemove(function (e) {
        if(!rect.active ) return; //선택 하지 않은 다른 위젯에서 마우스 move 일 경우
        //선택 위젯 div 좌상단 좌표값
        var widgetPosition = document.querySelector("#hd-Content-main_" + index).getBoundingClientRect();

        var sWidth = window.innerWidth;
        var sHeight = window.innerHeight;
        var oWidth = $('.speech-bubble').width();
        var oHeight = $('.speech-bubble').height();

        var divLeft = widgetPosition.x; //e.clientX - 10;
        var divTop = widgetPosition.y - 30; //e.clientY - 50;
        //console.log(e.clientX, e.clientY, a.x, a.y)

        // 레이어가 화면 크기를 벗어나는 경우 (우측 끝 짤림 등)
        if (divLeft + oWidth > sWidth) divLeft -= oWidth;
        if (divTop + oHeight > sHeight) divTop -= oHeight;

        // 레이어 좌측 끝 경우. clientXY 값이 현재 0 이 올 수 없음..
        /*if (divLeft < 0) divLeft = 0;
        if (divTop < 0) divTop = 0;*/
        $('.speech-bubble').css({
          "top": divTop,
          "left": divLeft,
          "position": "absolute"
        }).show();
      });
    },

    /**==============================
      Rect 제어
    ==============================*/
    activateRect(index, rect) {
      this.$store.dispatch('rect/setActive', {id: index});
      this.$store.dispatch('rect/setResizable', {id: index});
      this.selectedRectIdx = index;
      this.showCurrPosition(index, rect);
    },

    deactivateRect(index) {
      this.$store.dispatch('rect/unsetResizable', {id: index});
      $('.speech-bubble').hide();
    },

    changeRect(newRect, index) {
      this.tooltipObj = newRect;
      this.$store.dispatch('rect/changeRect', {id: index, rect: newRect});
    },

    setLayoutWidget(widgetItem) {
      this.$store.dispatch('rect/widgetRect', {id: this.selectedRectIdx, widget: widgetItem});
    },

    addLayoutWidget() {
      let newRect = {
        width: 330, height: 230, top: 0, left: 0,
        type: 'WIDGET', icon: "true", title: 'true',
        dist: 15 // 추가될 때 간격
      };

      this.$store.dispatch('rect/addRect', newRect);
    },

    saveLayoutWidget() {
      this.$store.dispatch('rect/saveRects', {mode:'EDIT', tabSeq: this.currTabSeq});
    },

    /**==============================
      패널 버튼 제어
    ==============================*/
    restorePanel(item, index) {
      this.$store.dispatch('rect/restoreRect', {rect:item, id: index});
    },

    copyPanel(item) {
      this.$store.dispatch('rect/copyRect', {rect:item, distX:50, distY:50});
    },

    deletePanel(index) {
      this.$store.dispatch('rect/deleteRect', index);
    },

    confPanel(item, idx) {
      const widgetItems = WidgetControlJS.items[item.id]; //widget.control.js에 선언한 설정팝업 종류 호출 topn, i/o, auth .. 등
      let widgetConf = 'Default';
      if(widgetItems != undefined){
         widgetConf = widgetItems.conf; //선언된 conf 값으로 실제 팝업 명칭 맵핑 ~ + Conf.vue (TopnConf.vue..)
      }

      this.popupName = widgetConf + 'Conf';
      this.popupParams = item;
      this.popupParams.idx = idx;
      this.popupParams.conf = item.conf;
      this.popupParams.curTabIdx = this.currTabSeq
      this.popupWidth = 350;
      this.popupHeight = 170;
      this.popupTitle = '위젯 설정'
      this.modal();
    },

    /**==============================
      팝업
    ==============================*/
    modal() {
      this.isModal = !this.isModal;
    },

    completedModal(params) {
      this.$store.dispatch('rect/setRect', {id: params.idx, rect: params})
      this.noChange = false;
    },

    /**==============================
      대시보드 버튼 제어
    ==============================*/
    fullScreen() {
      this.$store.dispatch('dash/fullScreen')
    },

    sound(state) {
      if(state) {
        this.$js.showByClass('mute');
        this.$js.hideByClass('volume');

        this.audio.pause();

      } else {
        this.$js.hideByClass('mute');
        this.$js.showByClass('volume');

        if(this.$store.state.widget.isEvtAlarm){
          this.audio.play();
          this.audio.loop = true;
        }
      }
    },

    setDashConfig(){
      this.popupName = 'SetDashConf';
      this.popupWidth = 600;
      this.popupHeight = 400;
      this.popupTitle = '위젯설정'
      this.modal();
    },

    enablePanelEdit() {
      var rects = this.$store.state.rect.rects;

      this.isPanelEdit = !this.isPanelEdit;
      if(this.isPanelEdit) {
        Object.assign(this.editRects, this.$store.state.rect.rects)
      }

      this.noChange = JSON.stringify(rects) == JSON.stringify(this.editRects)
      if(!this.noChange) {
        this.$store.dispatch('rect/saveRects', {mode:'CHANGE', tabSeq: this.currTabSeq});
        this.noChange = true;
      }
    },

    setDashTab() {
      this.popupName = 'com/DashTab';
      this.popupWidth = 320;
      this.popupHeight = 400;
      this.popupTitle = '탭설정'
      this.modal();
    },

    showSlide() {
      //슬라이드 off 시 위젯 데이터 변경 유무 check
      if(this.isSlideOpen) this.$emit('isChangeWidget');

      if(this.$store.state.isChangeWidget) {
        if (confirm('변경된 데이터가 존재합니다. \n저장하지 않을 시, 데이터는 반영되지 않습니다. \n설정창을 닫으시겠습니까?')) {
          this.$store.commit('setIsChangeWidget', false);
        } else {
          return
        }
      }

      this.openSlide();
      this.resizeSlide();
    },

    openSlide() {
      this.slideVisible = !this.slideVisible
      for(let i = 0; i < this.$store.state.rect.rects.length; i++) {
        this.$store.dispatch('rect/togglePrevent', {id: i});
        this.$store.dispatch('rect/unsetActive', {id: i});
      }
      this.$store.dispatch('dash/showGridLine', this.slideVisible);
      this.selectedRectIdx = -1;
    },

    resizeSlide() {
      this.isSlideOpen = !this.isSlideOpen;
      this.$store.dispatch('dash/resizeSlideScreen', this.isSlideOpen)
      this.parentScaleX = this.$store.getters['dash/parentScaleX'];
      this.parentScaleY = this.$store.getters['dash/parentScaleY'];
    },

    /*==============================
      그 외
    ==============================*/
    titleIconStyle(iconName){
      return 'background: url("/static/img/' + iconName +'.svg") no-repeat;'
    },
    titleClass(rect){
      if(rect.title === 'false'){
        return 'hd-no-title-section';
      }else{
        return rect.icon === 'true' ? 'hd-title-section': 'hd-title-section-sub'
      }
    },
    rectClass() {
      return this.slideVisible ? 'border-blue' : ''
    },

    timer() {
      const {yyyy, mm, dd, hour, minute, seconds, dayOfWeek} = this.$curDate();
      this.currDate = yyyy + '.' + mm + '.' + dd  ;
      this.currTime = hour + ":" + minute + ":" + seconds;
      this.refreshCnt = this.$store.state.refreshTime * 1;

      if(this.isSlideOpen) return; // 일시정지

      const curTime = new Date().getTime();
      if(++this.timeCnt > this.refreshCnt) {
        this.timeCnt = 0;
        if(this.tabUse && this.$store.state.set.tabRotation && this.tabs.length > 0) {
          this.currTabIdx++;
          if(this.currTabIdx === this.tabs.length) this.currTabIdx = 0;
          this.currTabSeq = this.tabs[this.currTabIdx].tabSeq;
          this.$store.dispatch('set/editCurrTabSeq', this.currTabSeq);
          this.$store.dispatch('rect/initRects', {mode:'', tabSeq:this.currTabSeq})
        } else {
          this.$store.dispatch('dash/refreshKeyTime', curTime);
        }
      }
    },

    resizeWin() {
      this.$store.dispatch('dash/resizeScreen')
    },

  }
}
</script>

<style scoped>
  .widgetBtn {
    /* display: block; */
    /* float: right; */
    margin: 5px 0;
    background:#363B4C!important;
    color:#ffffff!important;
    border:none!important;
  }
  .vdr.active:before {
    outline: 2px dashed white
  }
  .slideBtn {
    z-index: 9999;
    position: absolute;
    top: 0;
    left: 0;
    cursor: pointer;
    opacity: 0;
  }
  .slideBtn:hover {
    opacity: 1;
  }

  .speech-bubble {
    width: 30%;
    float: left;
    position: relative;
    background: #37393b;
    border-radius: .4em;
    text-align: center;
    margin-bottom: 5px;
    font-size: 15px;
  }

  .speech-bubble:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 0;
    border: 6px solid transparent;
    border-top-color: #37393b;
    border-bottom: 0;
    border-left: 0;
    margin-left: -3px;
    margin-bottom: -6px;
  }

</style>
