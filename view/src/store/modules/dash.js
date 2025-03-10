import widgetCtrl from '../../js/common/widget/widget.control'
import * as d3 from 'd3';

const dash = {
  namespaced: true,

  state: {
    keyTime: 0,

    isPopup: false,
    popupWidth: 0,
    popupHeight: 0,
    popupName: '',
    popupTitle: '',
    popupParams: null,

    isFullScreen: false,
    win: {stageW: 1920, stageH: 1080},
    parentScaleX:1,
    parentScaleY:1,
  },

  getters: {
    parentScaleX(state) { return state.parentScaleX },
    parentScaleY(state) { return state.parentScaleY }
  },

  actions: {
    /** 대시보드 전체 refresh 위해서 필요한 key 값 갱신 */
    refreshKeyTime(context, payload) {
      context.commit('setKeyTime', payload)
    },
    /** 눈금선 & 눈금자 생성 */
    createGridLine(context) {
      context.commit('initGridLine')
    },

    /** 눈금선 & 눈금자 활성화 */
    showGridLine(context, slideVisible) {
      context.commit('setGridLineVisible', slideVisible)
    },

    openPopup(context, {width, height, name, title, params}) {
      context.commit('setPopup', {width, height, name, title, params})
    },
    closePopup(context) {
      context.commit('closePopup')
    },

    /** 화면 확대/축소 */
    fullScreen(context) {
      context.commit('setScreen')
    },

    /** 화면 리사이징 */
    resizeScreen(context) {
      context.commit('setResizeScreen')
    },

    /** 좌측 슬라이드 open 시, 화면 리사이징 */
    resizeSlideScreen(context, slideOpen) {
      context.commit('setResizeSlideScreen', slideOpen)
    }
  },

  mutations: {
    setKeyTime(state, time) {
      state.keyTime = time;
    },
    setPopup(state, {width, height, name, title, params}) {
      state.popupWidth = width;
      state.popupHeight = height;
      state.popupName = name;
      state.popupTitle = title;
      state.popupParams = params;
      state.isPopup = true;
    },
    closePopup(state) {
      state.isPopup = false;
    },
    addTab(state, tab) {
      state.tabs.push(tab)
    },
    setTabs(state, tabs) {
      state.tabs = tabs;
    },

    setScreen(state) {
      state.isFullScreen = !state.isFullScreen;

      if(state.isFullScreen) {
        document.getElementsByClassName('mini')[0].style.display = 'block'
        document.getElementsByClassName('max')[0].style.display = 'none'

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
        document.getElementsByClassName('mini')[0].style.display = 'none'
        document.getElementsByClassName('max')[0].style.display = 'block'

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

    setResizeScreen(state) {
      let w = window.innerWidth;
      let h = window.innerHeight;
      let scaleX = w / state.win.stageW;
      let scaleY = h / state.win.stageH;

      d3.select("#dashMain")
      .style("transform", "scale(" + scaleX + "," + scaleY + ")")
    },

    setResizeSlideScreen(state, slideOpen) {
      let slideT = 41;
      let slideW = 350;
      let h = state.win.stageH - slideT;
      let w = state.win.stageW - slideW;
      let scaleX = w / state.win.stageW;
      let scaleY = h / state.win.stageH;
      // let scaleY = 1;
      const slideDuration = 500;

      let widgetBox = document.getElementById('widgetBox');

      if(slideOpen) { //widgetBox open

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

      state.parentScaleX = scaleX;
      state.parentScaleY = (window.innerHeight / state.win.stageH) * scaleY;
    },

    initGridLine(state) {
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

      let svgWidth = state.win.stageW - margin.left - margin.right;
      let svgHeight = state.win.stageH - margin.top - margin.bottom;
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

    setGridLineVisible(state, slideVisible) {

      let visible = slideVisible ? 'block' : 'none'
      let grid = document.getElementsByClassName('axis-grid');
      let xAxis = document.getElementsByClassName('x axis')[0];
      let yAxis = document.getElementsByClassName('y axis')[0];

      for(const g of grid) g.style.display = visible;
      xAxis.style.display = visible;
      yAxis.style.display = visible
    }
  },
}

export default dash
