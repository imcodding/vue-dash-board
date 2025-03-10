<template>
<div id="hd-header">
  <VueDragResize v-if="rectLogo"
        :key="rectLogo.itemSeq"
        :w="rectLogo.width"
        :h="rectLogo.height"
        :x="rectLogo.left"
        :y="rectLogo.top"
        :z="9999"
        :parentW="0"
        :parentH="0"
        :parentLimitation="true"
        :snapToGrid="true"
        :gridX="5"
        :gridY="5"
        :preventActiveBehavior="rectLogo.prevent"
        :parentScaleX="parentScaleX"
        :parentScaleY="parentScaleY"
        v-on:dragging="changeRect($event, rectLogo.index)"
        v-on:resizing="changeRect($event, rectLogo.index)"
        >
    <div id="logo" :style="this.$store.state.imageLogoPath"></div>
  </VueDragResize>

    <!-- local 환경에서는 css에서의 background 이용   -->
  <VueDragResize v-if="rectTitle"
      :key="rectTitle.itemSeq"
      :w="rectTitle.width"
      :h="rectTitle.height"
      :x="rectTitle.left"
      :y="rectTitle.top"
      :z="9999"
      :parentW="0"
      :parentH="0"
      :parentLimitation="true"
      :snapToGrid="true"
      :gridX="5"
      :gridY="5"
      :preventActiveBehavior="rectTitle.prevent"
      :parentScaleX="parentScaleX"
      :parentScaleY="parentScaleY"
      v-on:dragging="changeRect($event, rectTitle.index)"
      v-on:resizing="changeRect($event, rectTitle.index)"
      >
    <div class="hd-Main-Title" id="headerTitle">{{rectTitle.name}}</div>

  </VueDragResize>
  <VueDragResize v-if="rectTimeSet"
      :key="rectTimeSet.itemSeq"
      :w="rectTimeSet.width"
      :h="rectTimeSet.height"
      :x="rectTimeSet.left"
      :y="rectTimeSet.top"
      :z="9999"
      :parentW="0"
      :parentH="0"
      :parentLimitation="true"
      :snapToGrid="true"
      :gridX="5"
      :gridY="5"
      :preventActiveBehavior="rectTimeSet.prevent"
      :parentScaleX="parentScaleX"
      :parentScaleY="parentScaleY"
      v-on:dragging="changeRect($event, rectTimeSet.index)"
      v-on:resizing="changeRect($event, rectTimeSet.index)"
      >
  <div id="hd-Admin">
      <div id="hd-Admin-Function">
          <div class="hd-date" id="headerDate"><span>{{currDate}}</span><span>|</span><span>{{currTime}}</span></div>
        <div class="lightAnimation"></div>
          <!--<div class="hd-Refresh"> &lt;!&ndash;새로고침&ndash;&gt;-->
              <!--<div id="Ref-fillbar" class="Ref-fillbar" style="width:0%;"></div>-->
          <!--</div>-->
      </div>
      <div id="hd-Admin-Button">
          <!--<div class="AdmBtn">-->
          <!--</div>-->
          <div class="hd-btn">
              <div class="max" @click="fullScreen(true)"></div>
              <div class="mini" @click="fullScreen(false)" id="mini"></div>
              <div class="volume" @click="sound(true)"></div>
              <div class="mute" @click="sound(false)"></div>
              <div class="setting" @click="setDashCofig()"></div>
          </div>
      </div>
  </div>
  </VueDragResize>
  <div class="slideBtn" @click="showSlide()">
    <img v-if="!isSlideOpen" src="@/assets/images/slide/arrow_open.svg" style="width:30px;height:30px">
    <img v-else src="@/assets/images/slide/arrow_close.svg" style="width:30px;height:30px">
  </div>

  <!-- tab 영역 -->
  <div class="tabs">
    <ul>
      <div v-for="(tab, index) in tabs">
        <li v-if="$store.state.rect.curTabIdx == tab.tabIdx" class="active">
          <a href="#">{{tab.tabName}}</a>
          <!--<a href="#">메뉴명#N</a>-->
        </li>
        <li v-else="" @click="goTab(tab.tabIdx)">
          <a href="#">{{tab.tabName}}</a>
        </li>
      </div>
    </ul>
  </div>

</div>
</template>

<script>
import * as d3 from 'd3';
import LayerPopup from './jqx/LayerPopup.vue'
import VueDragResize from 'vue-drag-resize'

export default {
  props: {

  },
  components: {
    LayerPopup,
    VueDragResize
  },

  data() {
    return {
      currDate: '',
      currTime: '',
      refreshCnt: 0,
      mainTitle: this.$store.state.mainTitle,
      timeCnt: 0,
      isSlideOpen: false,
      gridLineAxisVisible: 'none',
      parentScaleX: 1,
      parentScaleY: 1
    }
  },
  updated(){

  },

  created() {
    d3.select(window).on("resize", this.resizeWin);
    //this.$store.dispatch('refreshTime')
  },

  mounted() {
    this.resizeWin();
    this.createGridLine();
    setInterval(this.timer, 1000);
  },

  computed: {
    rectLogo() {
      return this.getRectByType('LOGO');
    },
    rectTitle() {
      return this.getRectByType('TITLE');
    },
    rectTimeSet() {
      return this.getRectByType('TIMESET');
    },
    tabs() {
      return this.$store.state.set.tabs
    },
    tabRotation() {
      return this.$store.state.set.tabRotation
    }
  },

  watch: {
    refreshCnt() {
      //progress bar reset
      let bar = document.getElementById('Ref-fillbar');
      //bar.style.width = 0; //프로그래스바 제거로 인한 임시 주석
      //time reset
      this.timeCnt = 0;

      //최초 refreshData 함수 실행 시 refreshKeyTime 초기 값이 0 이기에 동일 값 전달. 다른 값 전송 시 페이지 첫 로드에서 2번 새로고침 발생(0에서 변경 되기에)
      //this.$emit('refreshData', 0);
    }
  },

  methods: {
    getRectByType(type) {
      let rects = this.$store.state.rect.rects;
      for(let i = 0; i < rects.length; i++) {
        let rect = rects[i];
        if(rect.type === type) {
          rect.index = i;
          return rect;
        }
      }
    },
    changeRect(newRect, index) {
      this.$store.dispatch('rect/changeRect', {id: index, rect: newRect});
    },
    /*==============================
      버튼 제어
    ==============================*/

    //타이머
    timer() {
      const {yyyy, mm, dd, hour, minute, seconds, dayOfWeek} = this.$curDate();
      // this.currDate = yyyy + '년 ' + mm + '월 ' + dd + '일 ' + '(' + dayOfWeek + ') ' + hour + ":" + minute + ":" + seconds;
      this.currDate = yyyy + '.' + mm + '.' + dd  ;
      this.currTime = hour + ":" + minute + ":" + seconds;
      this.refreshCnt = this.$store.state.refreshTime * 1;

      if(this.isSlideOpen) return; // 일시정지

      const curTime = new Date().getTime();
      if(++this.timeCnt > this.refreshCnt) {
        this.timeCnt = 0;
        // this.$emit('refreshData', curTime) // Main 함수 호출. 새로고침 시 curTime 값을 key로 모든 컴포넌트 새로고침 동작

        //goTab function 자체가 refresh를 포함 하기에 tab rotation 사용/미사용에 새로고침 로직 분기 처리
        if(this.tabRotation == 1) { //로테이션 사용 시
          this.goTabRotation();
        }else{
          this.$store.dispatch('dash/refreshKeyTime', curTime);
        }
      }

      //프로그래스바 제거로 인한 임시 주석
      //let bar = document.getElementById('Ref-fillbar');
      //bar.style.width = (this.timeCnt / this.refreshCnt * 100) + '%'
    },

    //새로고침 주가에 tab 한칸씩 이동
    goTabRotation(){
      const curTabIdx = this.$store.state.rect.curTabIdx;
      const lastTabIdx = this.tabs.length;
      let newTabIdx = curTabIdx + 1;

      if (curTabIdx === lastTabIdx) newTabIdx = 1;
      this.goTab(newTabIdx);
    },

    //스크린 제어
    fullScreen(state) {
      if(state) {
        this.$js.showByClass('mini');
        this.$js.hideByClass('max');

        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {    // Firefox
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {  // Chrome & Safari
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) { //IE
            document.documentElement.msRequestFullscreen();
        }
      } else {
        this.$js.hideByClass('mini');
        this.$js.showByClass('max');

        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
      }
    },

    //음성 제어
    sound(state) {
      if(state) {
        this.$js.showByClass('mute');
        this.$js.hideByClass('volume');
      } else {
        this.$js.hideByClass('mute');
        this.$js.showByClass('volume');
      }
    },

    //대시보드 전체 설정
    setDashCofig() {
      this.$emit('setDashCofig') // Main 함수 호출
    },

    showSlide() {
      //슬라이드 off 시 위젯 데이터 변경 유무 check
      if(this.isSlideOpen) this.$emit('isChangeWidget');

      if(this.$store.state.isChangeWidget)
        if (confirm('변경된 데이터가 존재합니다. \n저장하지 않을 시, 데이터는 반영되지 않습니다. \n설정창을 닫으시겠습니까?')) {
          this.$store.commit('setIsChangeWidget', false);
        } else {
          return
        }

      this.$emit('openSlide'); // Main 함수 호출
      this.resizeSlide();
    },

    /*==============================
      설정
    ==============================*/
    resizeWin() {
      let w = window.innerWidth;
      let h = window.innerHeight;
      let scaleX = w / this.$store.state.win.stageW;
      let scaleY = h / this.$store.state.win.stageH;

      d3.select("#dashMain")
      .style("transform", "scale(" + scaleX + "," + scaleY + ")")
    },

    resizeSlide() {
      this.isSlideOpen = !this.isSlideOpen;

      let slideT = 41;
      let slideW = 350;
      let h = this.$store.state.win.stageH - slideT;
      let w = this.$store.state.win.stageW - slideW;
      let scaleX = w / this.$store.state.win.stageW;
      let scaleY = h / this.$store.state.win.stageH;
      // let scaleY = 1;
      const slideDuration = 500;

      let widgetBox = document.getElementById('widgetBox');

      if(this.isSlideOpen) {

        //widgetBox open
        d3.select("#widgetBox")
        .transition()
        .duration(slideDuration)
        .style("width", slideW + "px")
        .style("height", slideT + "px")

        // 위젯 div 깜박임 이슈 때문에
        setTimeout(function() {
          widgetBox.style.display = 'block'
        }, slideDuration)

      } else { //widgetBox close
        widgetBox.style.display = 'none'
        widgetBox.style.width = 0
        slideW = 0;
        slideT = 0;
        scaleX = 1;
        scaleY = 1;
      }

      d3.select("#dashBox")
        .transition()
        .duration(slideDuration)
        .style("margin-top", slideT +"px")
        .style("margin-left", slideW + "px")
        .style("transform", "scale(" + scaleX + "," + scaleY + ")")

      this.parentScaleX = scaleX;
      this.parentScaleY = (window.innerHeight / this.$store.state.win.stageH) * scaleY;
      this.$emit('setParentScale', this.parentScaleX, this.parentScaleY);

    },

    //눈금선
    createGridLine() {
      let margin = { top: 0, right: 0, bottom: 0, left: 0, leftGap: 0 };

      let svg = d3.select('div#grid').append("svg")
            .attr("width", 1920)
            .attr("height", 1080)
            .attr("preserveAspectRatio", "xMinYMin meet")

      let svgGroup = svg.append("g")
            .attr("class", "svgGroup")
            .attr("width", 1920)
            .attr("height", 1080)

      svgGroup.append("g").attr("class", "grp_gridline");

      let gridLine = svg
                    .select("g.grp_gridline")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

      let svgWidth = this.$store.state.win.stageW - margin.left - margin.right;
      let svgHeight = this.$store.state.win.stageH - margin.top - margin.bottom;
      let gideLineGap = 20; // pix 단위
      let gideAxisGap = 20; // pix 단위

      let xDomain = parseInt(svgWidth * gideLineGap / gideLineGap);
      let yDomain = parseInt(svgHeight * gideLineGap / gideLineGap);

      let x = d3.scaleLinear().domain([0, xDomain]).range([0, svgWidth]);
      let y = d3.scaleLinear().domain([0, yDomain]).range([0, svgHeight]);

      let xAxisGrid = d3.axisBottom(x).tickSize(-svgHeight).tickFormat('').ticks(xDomain/gideLineGap);
      let yAxisGrid = d3.axisLeft(y).tickSize(-svgWidth).tickFormat('').ticks(yDomain/gideLineGap);

      /* x축 눈금선 */
      gridLine
          .append("g")
          .attr('class', 'x axis-grid')
          .attr('transform', 'translate(0,' + svgHeight + ')')
          .style('display', 'none')
          .style("stroke-dasharray", "2")
          .call(xAxisGrid);

      /* y축 눈금선 */
      gridLine
          .append('g')
          .attr('class', 'y axis-grid')
          .style('display', 'none')
          .style("stroke-dasharray", "2")
          .call(yAxisGrid);

      /* 눈금자 */
      let xAxis = d3.axisBottom(x).ticks(xDomain / (5 * gideAxisGap))
      let yAxis = d3.axisRight(y).ticks(yDomain / (5 * gideAxisGap))

      /* x축 눈금자 */
      gridLine
          .append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate('+ margin.left + ',' + '0' + ')')
          .style('display', 'none')
          .call(xAxis);

      /* y축 눈금자 */
      gridLine
          .append('g')
          .attr('class', 'y axis')
          .attr('transform', 'translate(' + margin.leftGap +',' + '0' + ')')
          .style('display', 'none')
          .call(yAxis);
    },

    goTab(tabIdx){
      this.$store.state.rect.curTabIdx = tabIdx;
      this.$store.dispatch('rect/initRects', {});
      if(this.isSlideOpen) this.showSlide(); //탭 이동시 슬라이드 영역 off
    }
  }
}
</script>

<style scoped>
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


.tabs {
	position:absolute; font-size: 14px; line-height: 20px; left:1450px; top: 33px;/*width: 500px;*/ z-index: 9999; margin-left: 0px;
}
.tabs ul:before, .tabs ul:after {
	content: "\0020"; display: block; height: 0; visibility: hidden;
}
.tabs ul:after { clear: both; }
.tabs ul {
	margin:0;
	list-style:none;
	zoom: 1;
}

.tabs ul li {
	position: relative;
	float: left;
	margin: 0 5px;
}
.tabs ul li a {
  background: #2c3662;
  height: 23px;
  line-height: 23px;
  font-weight: bold;
  text-align: center;
  display: block;
  color: #fff;
  padding: 0 10PX;
  text-decoration: none;
  border-radius: 5px;

}
.tabs ul li a:hover {
  background: #4ebbeb;
	color: #fff;
}
.tabs ul li.active a {
	background: #4ebbeb;
	color: #fff;
}
</style>
