// import * as d3 from 'd3';
import '@/lib/jqwidgets/js/jqxcore.js';
import d3 from './d3-context-menu'
import TopoConst from '../d3map/hm.topo.resource'
import TopoItem from '../d3map/topo.item'
import TopoUtil from '../d3map/topo.util'
import TopoLink from '../d3map/topo.link'
import TopoFlow from '../d3map/topo.flow'
import TopoSpline from '../d3map/topo.spline'
import topo_menu from './topo.menu';
import topo_menu_action from './topo.menu.action'
import axios from 'axios';
import TopoDraw from '../d3map/topo.draw'
import TopoLinkLabel from "./topo.link.label";
import { store } from '../../../store/store'

export default {
  install(app) {
    app.prototype.D3Topology = D3Topology;
  }
}
const $axios = axios;
var clickMapGrpNo = 1;
var objTopo = null, resizeFn = null, node_call = null, getBBox = null, node = null, link = null, shape = null;
var sourceX = 0, targetX = 0, sourceY = 0, targetY = 0;
var img = null, canvas =null, imgData = null, defs = null;
var shape_call = null, rotates = null;
var p, s, d, move;
var colorArr = [], lvAlarms = [];
var _color = null, _id = null, radialGradient = null;
var nodeIds = null, addedNodes = null;
var _selectionShapes = null;
var _selectedNodes = null, _selectedShapes = null, _selectedClock = null, _selectedSplinePoint = null, _selectedHelpLine = null;
var  elm = null, fnData = null, execFunc = null;
var evt1Cnt = 0, evt2Cnt = 0, evt3Cnt = 0, evt4Cnt = 0, evt5Cnt = 0, evtHtml = null, evtColorClass = "normal";
var audioInterval = null;
var keyPosition = null, moveValue = 0;
var setCurGrpNo = null;
var xDragVal = 0, yDragVal = 0, xCalcVal = 0, yCalcVal = 0;
var keepPoint = {};
var _d, urlItem = null;
var keyNodes = null, keyShapes = null;
var tWidth = 0, tHeight = 0, osImg = null, haFilterImg = null,  healthFilterImg = null, xCalc = 0, yClac = 0;
var removeNodes = [], linkLabelItem = null;
var menuValue = null;
var grpPathName = null, stringByteLength = 0;
var findValue = null;
var linkLabelCall = null;
var saveData = null;
var lineD = null;
var _linkConf = null, _dx = 0, _dy = 0, _dr = 0, _tmpVal = 0;
var slideArrIdx = 0;

var D3Topology = {

    topo_type: 'TOPO',
    rtTimer: null,
    objGis: null,
    // audioInterval: null,
    audio: null,
    evtTimer: null,
    slideTimer: null,
    viewType: 'default',
    vars: {
        svg: null,
        svgGroup: null,
        back: null,
        simulation: null,
        nodes: [],
        links: [],
        linkLabels: [],
        flows:[],
        draws: [],
        splines: [],
        shapeArr: [],
        textArr: [],
        textAreaArr: [],
        width: null,
        height: null,
        scaleX: 1,
        scaleY: 1,
        initW: null,
        initH: null,
        stageW: 1920,
        stageH: 1020,
        topGrpNo: 1,
        curGrpNo: 1,
        curGrpNm: '전체',
        curGrpParent: 0,
        topoTopCnt: 1,
        sessUserId: $('#sUserId').val(),
        mapMode: TopoConst.mapMode.SEARCH,
        viewType: TopoConst.viewType.TOPO,
        mapCanvas: null,
        findItemNo: null,
        isChgGrp: false,
        isChgItem: false,
        isChgFlow: false,
        isChgLink: false,
        isChangeTopo: false,
        isModeChg: false,
        isMove: false,
        isViewClock: false,
        isViewHelpLine: false,
        isViewGridAxis: false,
        isViewGridLine: false,
        isChgLinkLablePosition: false,
        isSoundOnOff: null,
        digitClockConf: null,
        selectItemNode: [],
        selectPathLink: [],
        selectLinkLabel: [],
        mousePosition: null,
        isShareGroupNo: null,
        isShareAccount: null,
        isShareArrGrps : [],
        isPrevGrpNo : null,
        isGrpMoveHistory: [],
        // isAlignEdit: false,
        currGrpItem: null,
        flowIconType: null,
        flowIconStr: null,
        grpFullPath: null,
        isSlideShow: false,
        mousePoint: {},
        isEnvItemChange: false,
        isEnvLinkChange: false,
    },

    /**
     * 토폴로지 초기화
     */
    initialize: function () {
        objTopo = this;
        this.vars.mapCanvas = $('#mapCanvas');
        this.vars.initW = this.vars.mapCanvas.width();
        this.vars.initH = this.vars.mapCanvas.height();
        this.createSvg('div#mapCanvas');
        this.addRectSelection(this.vars.svg);
        this.setTopoMapMode(objTopo);

        /** 장비, 회선 tooltip **/
        d3.select("div#section").append("div")
            .attr("id", "topoTooltip")
            .attr("class", "topoTooltip")
            .style("opacity", 0);

        /* tooltip 출력 DIV **/
        d3.select("div#section").append("div")
            .attr("class", "infoTooltip")
            .style("opacity", 0);

        /** 방향키 이벤트 설정 **/
        d3.select("body").on("keydown", function () {
            if ( objTopo.isManageMode(objTopo) && d3.event.keyCode >= 37 && d3.event.keyCode <= 40) {
                if (HmWindowStatus.isStatus === 'open') return;
                objTopo.nodeMoveKeyDown(d3.event.keyCode);
            }
            else {
                objTopo.hotKeyExecution(d3.event);
            } //단축키 실행
        });

        this.vars.simulation = d3.forceSimulation()
            .force("charge", d3.forceManyBody().strength(-10))
            .force("link", d3.forceLink().id(function (d) {
                return d.id;
            }))
            .force("x", d3.forceX(0))
            .force("y", d3.forceY(0))
            .on("tick", this.tick);
        this.vars.simulation.stop();

        // add event
        this.addEventListener();

        // 환경설정 조회
        $axios.get('/api/d3map/getTopoEnvSetting').then((result) => {
            if(result != null) {
                TopoConst.setEnvSetting(result);
            }
        })

        // 알람 sound 파일(MP3) 경로 조회
        /*$axios.get('/d3map/topo/getSoundPath.do', {
            success: function (result) {
                if (result != null) {
                    TopoConst.envSetting.soundFilePath = result.soundFilePath;
                }
            }
        });*/

        // 토폴로지 편집모드 확인
        TopoConst.envSetting.topoEditYn = 'N';

        // var clickMapGrpNo = $("#clickMapGrpNo").val();
        D3Topology.vars.curGrpNo = clickMapGrpNo;
    },

    /*
        단축키 실행
     */
    hotKeyExecution: function (e) {
        if (e && e.ctrlKey ) {  //ctrl
            if (e.altKey) { //ctrl+alt
                switch (e.code) {
                    case 'KeyS' : // 환경설정
                        if (objTopo.isManageMode(objTopo)) menuValue = "save_envSetting"; break;
                }
            } else {
                // debugger
                switch (e.code) {
                    case 'KeyE' : // 조회모드 <=> 관리모드
                        if (TopoConst.envSetting.topoEditYn == 'N') {
                            alert("토폴로지 편집 권한이 없습니다.");
                            // d3.select('.d3-context-menu').style('display', 'none');
                            return false;
                        }
                        else {
                            if (objTopo.vars.mapMode == TopoConst.mapMode.LINE_EDIT) {
                                alert("곡선 편집 종료 후 변경 가능합니다.");
                                return false;
                            }

                            if (objTopo.vars.mapMode == TopoConst.mapMode.SEARCH) {
                                menuValue = "modechg_manage";
                            }
                            else if (objTopo.vars.mapMode == TopoConst.mapMode.MANAGE) {
                                menuValue = "modechg_search";
                            }
                        }
                        break;

                    case 'KeyS' : // 저장
                        if (objTopo.isManageMode(objTopo))  menuValue = "save_map"; break;

                    case 'KeyD' : // 삭제
                        if (objTopo.vars.svg.selectAll("g.node rect.nodeactive").data().length > 0) menuValue = "del_multiIcon";
                        else if (objTopo.vars.svg.selectAll("g.shape.shapeactive").data().length > 0) menuValue = "del_drawTool";
                        break;

                }
            }
        }
        else if (e && e.altKey) {  //altKey
            switch (e.code) {
                case 'KeyT' : // 최상위그룹
                    menuValue = "gotoTop"; break;
                case 'KeyU' : // 상위그룹
                    menuValue = "gotoUp"; break;
                case 'KeyG' : // 그룹보기
                    menuValue = "view_grp"; break;
                case 'KeyF' : // 장비찾기
                    menuValue = "findDev"; break;
                case 'KeyD' : // 디지털시계
                    menuValue = "view_digitClock"; break;
                case 'KeyS' : // 사운드On/Off
                    menuValue = "soundOnOff"; break;
                case 'KeyV' : // 슬라이드
                    menuValue = "slideGrpSet"; break;
            }
        }

        if (menuValue) {
            objTopo.actionMenu(menuValue);
            menuValue = null;
        }

        if (e.ctrlKey && e.altKey &&  e.code == "KeyS") {
            e.preventDefault();
        }

        if (e.ctrlKey && ( e.code == "KeyE" || e.code == "KeyS" || e.code == "KeyD" )) {
            e.preventDefault();
        }

        if (e.altKey && ( e.code == "KeyT" || e.code == "KeyU" || e.code == "KeyG" ||
            e.code == "KeyD" || e.code == "KeyS" || e.code == "KeyV")) {
            e.preventDefault();
        }
    },



    /*
        menuBar 단축 Icon 설정
     */
    initMenuBarStyle: function () {

        if (TopoConst.envSetting.smallIconMenu == 1) {
            $('.viewNav label').css('display', 'none');
            $('.manageNav label').css('display', 'none');
            $('.leftNav ul li').css({'width':'40px', 'height':'23px'});
            $('.leftNav section').css({'width':'28px', 'padding-left':'2px'});
            $('.menuBars').css({'left':'40px', 'width':'240px'} );
            // $('.menuBars li').contents().filter(function () {
            //     return this.nodeType === 3;
            // }).css('display', 'none');
        }
        else {
            $('.viewNav label').css('display', 'block');
            $('.manageNav label').css('display', 'block');
            $('.leftNav ul li').css({'width':'60px', 'height':'36px'});
            $('.leftNav section').css({'width':'44px', 'padding-left':'7px'});
            $('.menuBars').css({'left':'60px', 'width':'300px'} );
            // $('.menuBars li').contents().filter(function () {
            //     return this.nodeType === 3;
            // }).css('display', 'block');
        }


    },

    /**
     * 이벤트 등록
     */
    addEventListener: function () {
        // svg resizing event
        resizeFn = this.resizeSvg;//, objTopo = this;
        d3.select(window).on("resize.updatesvg", function () {
            setTimeout(resizeFn.call(objTopo), 100);
        });

        // contextmenu event
        this.vars.svgGroup
            .on("contextmenu", d3.contextMenu(this.clickMenu, null, this));

        // 우측상단 버튼이벤트 > 모드변경
        $('input:radio[name=map_mode]').change(function (event) {
            if ($(this).val() == TopoConst.mapMode.MANAGE) {
                topo_menu_action.modechg_manage(null, null, null, D3Topology);
            } else {
                topo_menu_action.modechg_search(null, null, null, D3Topology);
            }
        });
        // 화면유형 > 토폴로지 or GIS
        $('input:radio[name=map_viewType]').change(function (event) {
            if ($(this).val() == TopoConst.viewType.GIS) {
                topo_menu_action.view_gis(null, null, null, D3Topology);
                $('#mapBtnBox').css('display', 'none');
            }
            else {
                // if (D3Topology.objGis != null) {
                topo_menu_action.view_topo(D3Topology);
                // }
            }
        });

        // const button_slideShow = document.querySelector(".button_slideShow");
        // const button_text = document.getElementById("button_text");

        //슬라이드쇼 시작/중지
        $(".slideShow_button").click(function() {
            objTopo.slideShowControll();
        });

        /* 슬라이드쇼 정지 */
        // $(".slideStop").click(function() {
        //     $('.slideStop').css('display','none');
        //     $('.slideStart').css('display','block');
        //     objTopo.stopSlideTimer();
        //     $('#btnSlideSetting').disabled = false;
        // });

    },

    slideShowControll: function () {
        /*objTopo.vars.isSlideShow = !objTopo.vars.isSlideShow;
        // 환경설정에서 슬라이드쇼 그룹 조회
        $axios.get('/d3map/popup/setting/modeSetting/getTopoEnvSetting.do', {
            success: function (result) {
                if (result != null) {
                    // slideShow
                    var slideGrpConf = JSON.parse(result.slideGrpConf);
                    if(slideGrpConf) {
                        var keys = Object.keys(slideGrpConf);
                        for(var idx = 0; idx < keys.length; idx++) {
                            var field = keys[idx];
                            if(slideGrpConf.hasOwnProperty(field)) {
                                if (field === 'group') TopoConst.slideGrpSetting[field] = slideGrpConf[field].split(',');
                                else TopoConst.slideGrpSetting[field] = slideGrpConf[field];
                            }
                        }
                    }
                }

                if (objTopo.vars.isSlideShow && TopoConst.slideGrpSetting.group.length === 0) {
                    alert("슬라이드쇼 설정된 그룹이 없습니다.");
                    objTopo.stopSlideTimer();
                    return false;
                }
                // $('.slideStart').css('display','none');
                // $('.slideStop').css('display','block');
                if (objTopo.vars.isSlideShow) {
                    // button_text.innerText = "슬라이드쇼...";
                    objTopo.startSlideTimer();
                    if($('#slideShow_buttonText')) {
                        $('#slideShow_buttonText').css('display','none');
                        $('#slideShow_buttonText2').css('display','block');
                    }

                }
                else {
                    // button_text.innerText = "슬라이드쇼";
                    objTopo.stopSlideTimer();
                    if($('#slideShow_buttonText')) {
                        document.documentElement.style.setProperty('--button-slide-left', '-100%');
                        $('#slideShow_buttonText').css('display', 'block');
                        $('#slideShow_buttonText2').css('display', 'none');
                    }
                }
                if($('#btnSlideSetting')) $('#btnSlideSetting').disabled = true;

            }
        });*/
    },



    /** SVG 생성 **/
    createSvg: function (selector) {
        this.vars.width = this.vars.mapCanvas.innerWidth() || this.vars.mapCanvas.width();
        this.vars.height = this.vars.mapCanvas.innerHeight() || this.vars.mapCanvas.height();
        this.vars.scaleX = this.vars.initW / this.vars.stageW;
        this.vars.scaleY = this.vars.initH / this.vars.stageH;

        // create svg
        this.vars.svg = d3.select(selector).append("svg")
            .attr("width", this.vars.width)
            .attr("height", this.vars.height)
            .attr("preserveAspectRatio", "xMinYMin meet")
            .classed("svg-content-responsive", true);

        /**
         * not used 2020.11.26
         * 그라데이션에서 단색으로 변경 (topo.css 사용)
         */
        this.createEvtBubble();

        // svg에 g 엘리먼트를 추가하여 리사이징 이벤트가 발생할때 scale 을 조절하여 리사이징 처리한다.
        this.vars.svgGroup = this.vars.svg.append("g")
            .attr("class", "svgGroup")
            .attr("width", this.vars.stageW)
            .attr("height", this.vars.stageH)
            .attr("transform", "scale(" + [this.vars.scaleX, this.vars.scaleY].join(",") + ")");

        // 이벤트용 back image 추가
        /**
         * IE에서 svg태그에 background-image로 배경설정시 이미지 저장시 배경 export가 되지 않는 문제가 있음.
         * 이로 인해 image태그를 추가하여 배경을 표시하도록 변경
         * 2018.04.04 by jjung
         */
        this.vars.back = this.vars.svgGroup.append("image")
            .attr("class", "bg_image")
            .attr("width", this.vars.stageW)
            .attr("height", this.vars.stageH)
            .attr("preserveAspectRatio", "none") //비율무시
            // .attr("xlink:href", "/static/img/d3/topo/topoBg.png") // 기본배경 제거
            .attr("fill", "transparent");

        // 격자선용 <g> tag
        this.vars.svgGroup.append("g")
            .attr("class", "grp_gridline");

        // draw, item, link <g> tag
        this.vars.svgGroup.append("g")
            .attr("class", "grp_object");

        // tool rotator 용 <g> tag
        this.vars.svgGroup.append("g")
            .attr("class", "grp_rotator");

        // clock 용 <g> tag
        this.vars.svgGroup.append("g")
            .attr("class", "grp_clock");
        // .attr("display", "none");

        // Help Line (안내선)용 <g> tag
        this.vars.svgGroup.append("g")
            .attr("class", "grp_helpline");

    },

    /** refresh 타이머 */
    startTimer: function () {
        // var objTopo = this;
        if (objTopo.rtTimer != null) return;
        objTopo.rtTimer = setInterval(function () {
            if (objTopo.vars.mapMode == TopoConst.mapMode.SEARCH) {
                objTopo.vars.isChgGrp = false;
                objTopo.search();
            }
        }, TopoConst.envSetting.refreshTime * 1000);
    },

    clearTimer: function () {
        // var objTopo = this;
        if (objTopo.rtTimer != null) {
            clearInterval(objTopo.rtTimer);
        }
        objTopo.rtTimer = null;
        objTopo.clearAudioInterval();

        if (objTopo.evtTimer != null) {
            clearInterval(objTopo.evtTimer);
        }
        objTopo.evtTimer = null;

        if (objTopo.slideTimer != null) {
            clearInterval(objTopo.slideTimer);
            // $('.slideStop').css('display','none');
            // $('.slideStart').css('display','block');
            $('#slidePrograssBar').css('width', '0%');
            $('#btnSlideSetting').disabled = false;
        }
        objTopo.slideTimer = null;

        if (typeof TopoFlow.flowInterval !== "undefined" && TopoFlow.flowInterval) {
            clearInterval(TopoFlow.flowInterval);
            TopoFlow.flowInterval = null;
        }

        if (typeof TopoSpline.flowSplineInterval !== "undefined" && TopoSpline.flowSplineInterval) {
            clearInterval(TopoSpline.flowSplineInterval);
            TopoSpline.flowSplineInterval = null;
        }


    },

    resetTimer: function () {
        this.clearTimer.call(this);
        this.startTimer.call(this);
    },

    evtStartTimer: function() {
        if (objTopo.evtTimer != null) return;
        objTopo.evtTimer = setInterval(function () {
            //objTopo.searchErrorList();
        }, TopoConst.envSetting.refreshTime * 1000);
    },

    /** slide 타이머 start */
    startSlideTimer: function () {
        // var objTopo = this;
        let timeCnt = 0;
        let refreshCnt = parseInt(TopoConst.slideGrpSetting.period);
        if (objTopo.slideTimer != null) return;


        objTopo.slideTimer = setTimeout(function slideGrpShow() {
            if (objTopo.vars.mapMode == TopoConst.mapMode.SEARCH) {
                if (objTopo.vars.isSlideShow) {
                    ++timeCnt;
                    if(timeCnt > refreshCnt) {
                        if (objTopo.vars.isSlideShow) objTopo.slideChgGrp();
                        timeCnt = 0;
                    }
                    //$('#slidePrograssBar').css('width', (timeCnt/refreshCnt * 100) + '%');
                    document.documentElement.style.setProperty('--button-slide-left', (100 - (timeCnt/refreshCnt * 100)) * -1 + '%');
                }

            }
            objTopo.slideTimer = setTimeout(slideGrpShow, 1000);
        }, 1000);
    },

    slideChgGrp: function () {

        if (objTopo.vars.isSlideShow) {
            if (TopoConst.slideGrpSetting.group.length-1 < slideArrIdx) slideArrIdx = 0;

            if (  objTopo.getAccountGroups() || objTopo.vars.isShareGroupNo ) {
                objTopo.vars.isShareGroupNo = objTopo.vars.curGrpNo = parseInt(TopoConst.slideGrpSetting.group[slideArrIdx]);
            }
            else {
                objTopo.vars.curGrpNo = parseInt(TopoConst.slideGrpSetting.group[slideArrIdx]);
            }
            objTopo.vars.isChgGrp = true;
            objTopo.chgGrp();
            slideArrIdx++;
            //$('#slidePrograssBar').css('width', (timeCnt/refreshCnt * 100) + '%');
        }

    },

    stopSlideTimer: function () {
        if (objTopo.slideTimer != null) {
            clearTimeout(objTopo.slideTimer);
            // $('#slidePrograssBar').css('width', '0%');
        }
        objTopo.slideTimer = null;
    },

    /**
     *  단축메뉴 아이콘 실행
     */
    actionMenu: function (menuValue) {
        // console.log(menuValue);
        elm = this;
        fnData = null;
        execFunc = topo_menu_action[menuValue];
        // d3-context-menu.js

        if (menuValue === "moveGrp" && objTopo.vars.svg.selectAll("g.node rect.nodeactive").data().length === 0) {
            alert("선택된 장비가 없습니다.");
            return;
        }

        if (typeof(execFunc) === "function") {
            execFunc(elm, fnData, 0, objTopo);
        }
        else {
            console.log("nothing function");
        }

    },

    /**
     * 최상위 그룹번호 조회
     */
    getTopGrp: function () {
        // var objTopo = this;

      $axios.get('/api/d3map/getMapTopGrpInfo', {
        params: {
            /** 상속X */
            isTopGrp: true,
            tabSeq: store.state.set.currTabSeq
        }}).then((result) => {

            if (result.grpNo != 1 && result.cnt == 1) {
                objTopo.vars.topGrpNo = objTopo.vars.curGrpNo = result.grpNo;
            }
            else {
                // objTopo.vars.topGrpNo = objTopo.vars.curGrpNo = 1;
                // objTopo.vars.topGrpNo = objTopo.vars.curGrpNo = $("#clickMapGrpNo").val();
                if (result.grpNo != 1 && result.cnt > 1) {
                    // 상속계정이며 권한 설정 그룹이 2개 이상인 경우
                    objTopo.vars.isShareAccount = 1;//result[0].isShare;
                    objTopo.vars.isShareGroupNo = null;
                    objTopo.vars.isGrpMoveHistory.push(null);
                } else {
                    objTopo.vars.topGrpNo = objTopo.vars.curGrpNo = result.grpNo;
                    objTopo.vars.isGrpMoveHistory.push(objTopo.vars.topGrpNo);
                }
            }
            objTopo.vars.topoTopCnt = result.cnt;
            objTopo.getTopoGrpInfo();
            // objTopo.search();
      })
    },

    clearArray: function () {
        objTopo.vars.isGrpMoveHistory = [];
    },

    setTopoMapMode: function (objTopo) {
        $('#map_modeNm').text(objTopo.isManageMode(objTopo) ? '관리모드' : '조회모드' );
        // $('#topoMapMode').css('background', objTopo.isManageMode(objTopo) ? '#fbac2d' : '#e0eaf1' );

    },

    setTopoPath: function (grpNm) {
        $('#map_curGrpNm').text(grpNm);
        objTopo.vars.curGrpNm = grpNm;
    },

    getIsShareGroupRoot: function () {
        if (objTopo.vars.isShareAccount !== 1) {
            // 본계정
            return false;
        } else if (objTopo.vars.isShareAccount === 1 && objTopo.vars.isShareGroupNo) {
            // 상속계정이며 상속계정에 설정된 그룹 권한 중 선택된 그룹이 있을 경우
            return false;
        } else {
            return true;
        }

    },

    getAccountGroups: function () {
        if (objTopo.vars.isShareAccount === 1 && objTopo.vars.topoTopCnt > 1) {
            return true;
        }
        else {
            return false;
        }
    },

    /**
     * 조회 (timer callback function)
     */
    search: function () {
        if (this.vars.viewType == TopoConst.viewType.GIS) {
            this.objGis.search();
        }
        else {
            // SVG 화면 초기화
            this.setSvgClear();
            // drawTool 조회
            this.searchDrawTool();
            // 해당 그룹의 BG 이미지 설정
            this.searchItem();
            this.searchBgImg();
            this.searchSplineTool(); //그리기(도형, 텍스트 등)


            /* 장애 Count 및 목록 조회
              장애 목록 조회 후 Item조회, Link 조회
             */
            //this.searchErrorList();

        }

    },

    setSvgClear: function () {
        // debugger
        // objTopo.vars.svgGroup.selectAll(function (d) {
        //     return this.childNodes;
        // })
        //     .filter(function () {
        //         return !$(this).hasClass('bg_image') &&
        //             !$(this).hasClass('grp_clock') &&
        //             // !$(this).hasClass('rect') &&
        //             !$(this).hasClass('grp_helpline') &&
        //             !$(this).hasClass('grp_rotator') &&
        //             !$(this).hasClass('grp_object') &&
        //             !$(this).hasClass('grp_gridline');
        //
        //
        //     })
        //     .remove();

        /**
         item, draw, path, (flow 아이콘 제외)등 remove 처리 (g.grp_object 하위 객체)
         */
        removeNodes = objTopo.vars.svgGroup.select("g.grp_object").selectAll(function (d) {
            return this.childNodes;
        });



        if (removeNodes.nodes().length > 0) {
            $.each(removeNodes.nodes(), function(idx, node) {
                // if (node) node.remove();
                if (node && d3.select(node).attr("class") != 'ellipse_flow') node.remove();
                else d3.select(node).style("display", "none");
            });
        }

    },

    /**
     * 장애 Count 및 목록 조회
     */
    searchErrorList: function () {

        setCurGrpNo = objTopo.getIsShareGroupRoot() ? 1 : objTopo.vars.curGrpNo;

        $axios.get("/d3map/topo/getTopoErrorList.do", {
            data: {grpNo: setCurGrpNo, userId: objTopo.vars.sessUserId, topoTopCnt: objTopo.vars.topoTopCnt},
            success: function (result) {
                // console.log("getTopoErrorList " + JSON.stringify(result));
                evt1Cnt = 0, evt2Cnt = 0, evt3Cnt = 0, evt4Cnt = 0, evt5Cnt = 0;
                evtColorClass = "normal";
                evtHtml = '';
                if (result.length > 0) {
                    $.each(result, function (i, v) {

                        if (v.evtLevel === 5) {
                            evt5Cnt++, evtColorClass = "critical";
                        }
                        else if (v.evtLevel === 4) {
                            evt4Cnt++, evtColorClass = "major";
                        }
                        else if (v.evtLevel === 3) {
                            evt3Cnt++, evtColorClass = "minor";
                        }
                        else if (v.evtLevel === 2) {
                            evt2Cnt++, evtColorClass = "warning";
                        }
                        else if (v.evtLevel === 1) {
                            evt1Cnt++, evtColorClass = "info";
                        }

                        grpPathName = v.pathName
                        if (objTopo.getBytes( grpPathName) > 37) grpPathName = objTopo.sliceByByte(v.pathName, 40);

                        i === 0 ? evtHtml = "<div>" : evtHtml += "<div>";
                        evtHtml += "<table>";
                        evtHtml += "<tr><td><div class='evtSquare " +  evtColorClass + "'>" + v.evtLevelStr + "</div><div>" + v.ymdhms + "</div></td></tr>";
                        evtHtml += "<tr><td><ul><li>" + grpPathName + "</li><li>" + v.srcTypeStr + "</li><li>" + v.evtName + "</li></ul></td></tr>";
                        evtHtml += "<tr><td title='" + v.srcInfo + "'>" + v.srcInfo + "</td></tr>";
                        evtHtml += "</table>";
                        evtHtml += "<div class='errEvtBtn' data-grpNo='" + v.grpNo + "' data-itemNo='" + v.itemNo + "'>";
                        // evtHtml += "<img src='/image/d3/menu/navi/topoEvtBtn.svg'></div>";
                        evtHtml += "</div></div>";
                    });

                }
                else {
                    // 장애 없을 경우
                    evtHtml = "<span class='ErrNon'>발생장애가 없습니다.</span>";
                }

                $("#evtCntLv5").text(evt5Cnt);
                $("#evtCntLv4").text(evt4Cnt);
                $("#evtCntLv3").text(evt3Cnt);
                $("#evtCntLv2").text(evt2Cnt);
                $("#evtCntLv1").text(evt1Cnt);

                $("#topoErrList").html(evtHtml);

                $("#topoErrList .errEvtBtn").click(function () {
                    if ($(this).data('grpno')) {
                        objTopo.vars.findItemNo = $(this).data('itemno');
                        if (objTopo.getAccountGroups()) objTopo.vars.isShareGroupNo = objTopo.vars.curGrpNo = $(this).data('grpno');
                        else objTopo.vars.curGrpNo = $(this).data('grpno');
                        objTopo.clearObject(objTopo);
                        objTopo.search();
                        // objTopo.chgGrp(true);
                    }

                });

                objTopo.searchSplineTool();
                objTopo.searchItem();
            }
        });
    },

    /* 이벤트 발생 그룹 Path 의 한글/영문 byte 계산 */
    getBytes: function (patnName) {
        // console.time("개선된FOR방식");
        stringByteLength = (function(s,b,i,c){
            for(b=i=0;c=s.charCodeAt(i++);b+=c>>11?3:c>>7?2:1);
            return b
        })(patnName);
        // console.log(stringByteLength + " Bytes");
        // console.timeEnd("개선된FOR방식");
        return stringByteLength;
    },

    /* Byte 에 맞는 한글 자르기 */
    sliceByByte: function sliceByByte(patnName, maxByte) {
        var b, c, i;
        for(b=i=0; c=patnName.charCodeAt(i);) {
            b+=c>>7?2:1;
            if (b > maxByte)
                break;
            i++;
        }
        return patnName.substring(0,i) + ' ...';
    },


    /**
     * 아이템 조회
     */
    searchItem: function () {
        var objTopo = this;
        let data = { grpNo: objTopo.vars.curGrpNo, topoTopCnt: objTopo.vars.topoTopCnt };

        $axios.post('/api/d3map/getTopoItemList', data).then((result) => {
            objTopo.vars.nodes = TopoItem.setNodeData(result, objTopo);
            objTopo.vars.simulation.nodes(objTopo.vars.nodes);

            var node_call = objTopo.createDrags(objTopo, objTopo.dragstart, objTopo.dragmove, objTopo.dragend);
            var getBBox = objTopo.createBBox;

            if (objTopo.vars.isChangeTopo || objTopo.vars.isModeChg) {
                objTopo.vars.svgGroup.select("g.grp_object").selectAll('g.node').remove();
                TopoItem.refresh(objTopo, objTopo.vars.svg, objTopo.vars.nodes, node_call, getBBox);
            }

            TopoItem.refresh(objTopo, objTopo.vars.svg, objTopo.vars.nodes, node_call, getBBox);

            // 회선 조회
            objTopo.searchLink();
        })
    },

    /**
     * 회선 조회
     */
    searchLink: function () {
        var objTopo = this;
        let data = { grpNo: objTopo.vars.curGrpNo, userId: objTopo.vars.sessUserId }

        $axios.post('/api/d3map/getTopoLinkList', data).then((result) => {
            objTopo.vars.links = TopoLink.setLinkData(result);
            objTopo.vars.simulation.force("link").links(objTopo.vars.links);
            TopoLink.refresh(objTopo, objTopo.vars.svg, objTopo.vars.links);

            if (objTopo.vars.isChangeTopo || objTopo.vars.isModeChg) {
                objTopo.vars.svgGroup.select("g.grp_object").selectAll('path.link').remove();
                objTopo.vars.svgGroup.select("g.grp_object").selectAll('circle.ellipse_flow').remove();
                TopoLink.refresh(objTopo, objTopo.vars.svg, objTopo.vars.links);
            }
             /** flow Image 생성 **/
            if (result.findIndex(findValue => findValue.lineFlowEffect !== 'None') > -1 ) objTopo.createImageFlow(objTopo);   // 회선 flow icon Animation 효과
            /** 회선 흐름 효과 */
            if (result.findIndex(findValue => findValue.lineTrafficEffect !== 'None') > -1 ) objTopo.ani_traffic(objTopo); // 회선 흐름 효과

            objTopo.tick(objTopo);
            objTopo.ani_bubble(objTopo);
            linkLabelCall = objTopo.createLinkLabelDrags(objTopo);
            objTopo.vars.linkLabels = TopoLinkLabel.refresh(objTopo, objTopo.vars.svg, objTopo.vars.links, linkLabelCall);
            //objTopo.playSound(objTopo);
        })
    },

    /**
     * OS Image, HA Image, Health Image Position reset
     */
    itemOptionImageRePostion: function () {
        tWidth = 0;
        tHeight = 0;
        osImg = objTopo.vars.svg.select(".svgGroup").selectAll("g.osImg");
        osImg
            .attr("transform", function (d) {
                tWidth = parseInt(d3.select(d3.select(this).select("image").node()).style("width").replace("px", ""));
                tHeight = parseInt(d3.select(d3.select(this).select("image").node()).style("height").replace("px", ""));
                if (!Number.isNaN(tWidth) && !Number.isNaN(tWidth) ) {
                    xCalc = (55 / 2) * TopoUtil.getItemScale(d.itemSize) - (tWidth / 2);
                    yClac = (55 / 2) * TopoUtil.getItemScale(d.itemSize) + (tHeight / 2);
                    return "translate(" + xCalc + "," + yClac + ")";
                } else {
                    return null;
                }

            });

        /*
        // H/A 표시 사용시
        if (TopoConst.envSetting.showHA === 1) {
            haFilterImg = objTopo.vars.svg.select(".svgGroup").selectAll("g.haImg");
            haFilterImg
                .attr("transform", function (d) {
                    tWidth = parseInt(d3.select(d3.select(this).select("image").node()).style("width").replace("px", ""));
                    xCalc = (55 / 2) * TopoUtil.getItemScale(d.itemSize) - (tWidth / 2);
                    yClac = 0;
                    return "translate(" + xCalc + "," + yClac + ")";
                });
        }

        // health 체크 사용시
        if (TopoConst.envSetting.showIcmpPoll === 1) {
            healthFilterImg = objTopo.vars.svg.select(".svgGroup").selectAll("g.healthImg");
            healthFilterImg
                .attr("transform", function (d) {
                    tWidth = parseInt(d3.select(d3.select(this).select("image").node()).style("width").replace("px", ""));
                    xCalc = (55 / 2) * TopoUtil.getItemScale(d.itemSize) - (tWidth / 2);
                    yClac = d.bbox.y - 15;
                    return "translate(" + xCalc + "," + yClac + ")";
                });
        }
        */
    },

    /**
     * Flow 설정
     */
    createImageFlow: function () {
        // var objTopo = this;
        objTopo.vars.flows = TopoFlow.setFlowData(objTopo, objTopo.vars.links);
        if (objTopo.vars.isChangeTopo || objTopo.vars.isChgFlow)
            TopoFlow.refresh(objTopo, objTopo.vars.svg, objTopo.vars.flows);
    },

    /**
     * 배경이미지 조회
     * @param   flag    이벤트 발생객체가 gis viewer이면 true
     */
    searchBgImg: function () {
        if (objTopo.getIsShareGroupRoot()) {
            objTopo.vars.svgGroup.select("image.bg_image").attr("xlink:href", "/image/d3/topo/topoBg.png")
            objTopo.setTopoPath('');
        }
        else {
            // var objTopo = this;
          const currEnv = process.env.NODE_ENV;
          $axios.get('/api/d3map/getTopoGrpInfo', {params: {grpNo: objTopo.vars.curGrpNo}}).then((result) => {

            img = new Image();
            img.onload = function () {
                canvas = document.createElement("canvas");
                canvas.width = img.width, canvas.height = img.height;
                canvas.getContext("2d").drawImage(img, 0, 0);
                imgData = canvas.toDataURL("image/png");

                objTopo.vars.svgGroup.select("image.bg_image").attr("xlink:href", imgData);
            };

            if(result) {
                let url = currEnv == 'development' ? '/static/img/d3/bg/{0}.png' : '/image/d3/bg/{0}.png';
                img.src = url.substitute(result.bgFileNm);
            }

            objTopo.setTopoPath(result.grpName);
          })
        }

    },

    /**
     * drawtool
     */
    searchDrawTool: function () {

        if (!objTopo.getIsShareGroupRoot()) {
            let data = { grpNo: objTopo.vars.curGrpNo, topoTopCnt: objTopo.vars.topoTopCnt };
            $axios.post('/api/d3map/getDrawToolList', data).then((result) => {
              $.each(result, function (i, v) {
                v.id = 'draw{0}'.substitute(v.drawNo)
              });

              shape_call = objTopo.createShapeDrags(objTopo, objTopo.shapeDragstart, objTopo.shapeDragmove, objTopo.shapeDragend);
              var getBBox = objTopo.createBBox;
              objTopo.vars.draws = TopoDraw.refresh(objTopo, objTopo.vars.svg, result, shape_call, getBBox);
              //objTopo.createRotateTool(objTopo); //???
              objTopo.resizeSelection();
            })
        }
        return true;

    },

    /**
     * splinetool
     */
    searchSplineTool: function () {
      //let data = { grpNo: objTopo.vars.curGrpNo, topoTopCnt: objTopo.vars.topoTopCnt };
      //
      //         $axios.post('/api/d3map/getTopoItemList', data).then((result) => {


        if (!objTopo.getIsShareGroupRoot()) {

          let data = { grpNo: objTopo.vars.curGrpNo};
          $axios.post('/api/d3map/getSplineToolList', data).then((result) => {
            objTopo.vars.splines = TopoSpline.refresh(objTopo, objTopo.vars.svg, result);
          })

        }
        return true;
    },

    /**
     * rotate tool
     */
    createRotateTool: function (objTopo) {

        if (!objTopo.getIsShareGroupRoot()) {
            objTopo.vars.draws = objTopo.vars.svgGroup.selectAll("g.shape");
            getBBox = objTopo.createBBox;
            objTopo.vars.rotates = TopoRotate.setRotateData(objTopo.vars.draws, getBBox);
            rotates = TopoRotate.refresh(objTopo, objTopo.vars.svg, objTopo.vars.rotates, null);
        }

    },

    /**
     * drag selection 처리
     * 마우스 드래그로 아이템 멀티 선택시..
     */
    addRectSelection: function (svg) {
        // var objTopo = this;
        svg.on("mousedown", function (e) {

            objTopo.setMousePoint(d3.event);

            d3.select('.d3-context-menu').style('display', 'none');

            //우클릭일때
            if (d3.event.which == 3 || objTopo.vars.mapMode == TopoConst.mapMode.SEARCH) {
                objTopo.vars.mousePosition = d3.mouse(this);
                return;
            } else {
                if (d3.event.which != 3 &&  objTopo.vars.mapMode == TopoConst.mapMode.MANAGE) {
                    // console.log("addRectSelection ======> selectItemNode init");
                    objTopo.vars.selectItemNode = [];
                    objTopo.vars.selectLinkLabel = [];

                    if (!d3.event.ctrlKey) {
                        objTopo.vars.selectPathLink = [];
                        objTopo.vars.svg.select(".svgGroup").selectAll("path.link").style("stroke-width", function (d) {
                            return d.lineSize;
                        });
                    }
                }
            }

            D3Topology.selectObjectSet('menu');

            // svg.selectAll('path.helpline').classed("helplineSelected", false);
            // svg.selectAll("g.node rect.nodeactive").classed("nodeactive", false);
            // svg.selectAll("g.shape").classed("shapeactive", false).selectAll("rect.shapeselection").style("display", "none");
            // svg.select("rect#clockSelect").classed("clockactive", false).style("display", "none");
            // svg.select(".svgGroup").selectAll('circle.splinePoints').classed("splinePointSelected", false);

            var p = d3.mouse(this);
            var s = svg.select("rect.selection");
            if (!s.empty()) return;

            svg.append("rect")
                .attr("rx", 6)
                .attr("ry", 6)
                .attr("class", "selection")
                .attr("x", p[0])
                .attr("y", p[1])
                .attr("width", 0)
                .attr("height", 0);

        })
            .on("mousemove", function () {
                var s = svg.select("rect.selection");

                if (!s.empty()) {

                    var p = d3.mouse(this),
                        d = {
                            x: parseFloat(s.attr("x"), 10),
                            y: parseFloat(s.attr("y"), 10),
                            width: parseFloat(s.attr("width"), 10),
                            height: parseFloat(s.attr("height"), 10)
                        },

                        move = {
                            x: p[0] - d.x,
                            y: p[1] - d.y
                        };
                    if (move.x < 1 || (move.x * 2 < d.width)) {
                        d.x = p[0];
                        d.width -= move.x;
                    }
                    else {
                        d.width = move.x;
                    }

                    if (move.y < 1 || (move.y * 2 < d.height)) {
                        d.y = p[1];
                        d.height -= move.y;
                    }
                    else {
                        d.height = move.y;
                    }
                    s.attr("x", d.x).attr("y", d.y).attr("width", d.width).attr("height", d.height);

                    svg.select(".svgGroup").selectAll("rect.state").each( function (node, i) {

                        var sx = parseFloat(d.x, 10), sy = parseFloat(d.y, 10),
                            ex = parseFloat(d.x, 10) + parseFloat(d.width, 10),
                            ey = parseFloat(d.y, 10) + parseFloat(d.height, 10);

                        sx = sx / objTopo.vars.width * objTopo.vars.stageW,
                            sy = sy / objTopo.vars.height * objTopo.vars.stageH,
                            ex = ex / objTopo.vars.width * objTopo.vars.stageW,
                            ey = ey / objTopo.vars.height * objTopo.vars.stageH;

                        if (node.x >= sx && (node.cx + node.xgap) <= ex && node.y >= sy && (node.cy + node.ygap) <= ey) {
                            svg.select("g#" + String(node.id)).select("rect.state").classed("nodeactive", true);
                            if (objTopo.vars.selectItemNode.indexOf(node.id) < 0)  objTopo.vars.selectItemNode.push(node.id);
                        }

                    });
                }
            })
            .on("mouseup", function () {
                objTopo.activeRelease();

                var s = svg.select("rect.selection");

                if (!s.empty()) {
                    try {
                        var sx = parseFloat(s.attr("x"), 10), sy = parseFloat(s.attr("y"), 10),
                            ex = parseFloat(s.attr("x"), 10) + parseFloat(s.attr("width"), 10),
                            ey = parseFloat(s.attr("y"), 10) + parseFloat(s.attr("height"), 10);

                        // local -> stage 좌표로 변환
                            sx = sx / objTopo.vars.width * objTopo.vars.stageW,
                            sy = sy / objTopo.vars.height * objTopo.vars.stageH,
                            ex = ex / objTopo.vars.width * objTopo.vars.stageW,
                            ey = ey / objTopo.vars.height * objTopo.vars.stageH;

//                        console.log([sx, sy, ex, ey].join(", "));

                        objTopo.vars.simulation.nodes().forEach(function (d) {
                            if (d.x >= sx && (d.x + 55) <= ex && d.y >= sy && (d.y + 55) <= ey) {
                                svg.select("g#" + String(d.id)).select("rect.state").classed("nodeactive", true);
                            }
                        });
                        // console.log("addRectSelection ======> mouseup");
                        // console.log("addRectSelection ======> " + objTopo.vars.selectItemNode.length);
                    } catch (e) {
                        console.log(e);

                    } finally {
                        s.remove();
                    }
                }
            });
    },

    /**
     * 마우스 Click 포인트값 저장
     */
    setMousePoint: function(event) {
        var randomX = 0, randomY = 0, helpX = 0, helpY = 0;
        randomX = (Math.random() * (100 - 20)) - (Math.random() * (200 - 20));
        randomY = (Math.random() * (100 - 20)) - (Math.random() * (200 - 20));
        helpX = randomX > objTopo.vars.stageW ? objTopo.vars.stageW - 100 : randomX;
        helpY = randomY > objTopo.vars.stageH ? objTopo.vars.stageH - 100 : randomY;
        objTopo.vars.mousePoint.x = event.clientX + (event.clientX - event.offsetX) + helpX;
        objTopo.vars.mousePoint.y = event.clientY + (event.clientY - event.offsetY) + helpY;
    },

    /** BBox 생성 **/
    createBBox: function (selection) {

        return selection.each(function (d) {
            d.bbox = this.getBBox();

            /**
             * 장비명 배경 박스 사이즈 조절 (폰트길이 15기준으로 줄넘김 처리)
             * by jjung     2019.1.22
             var cnt = 0;
             for(var i = 0; i < this.textContent.length; i++) {
                if(this.textContent.charCodeAt(i) > 127) cnt+= 2;
                else cnt++;
            }
             if(cnt > 16) {
                d.bbox.height = d.bbox.height * 2 + 4;
                d.bbox.width = (8 + (d.fontSize - 2)) * (cnt - 16 < 16? 16 : cnt - 16);
            }
             */
        });
    },

    /**
     * 토폴로지 표시 그룹 변경 (그룹이동)
     */
    chgGrp: function () {
        // var objTopo = this;
        // if (isChgView === undefined) {
        //     isChgView = false;
        // }
        this.hideTooltip();

        /* 그룹이동시 Link 및 Flow 아이콘 remove */
        if (objTopo.vars.isChgGrp) {

            objTopo.vars.svgGroup.select("g.grp_object").selectAll('g').remove();
            objTopo.vars.svgGroup.select("g.grp_object").selectAll('g.shape').remove();
            objTopo.vars.svgGroup.select("g.grp_object").selectAll('path.link').remove();
            objTopo.vars.svgGroup.select("g.grp_object").selectAll("path.spline").remove();
            objTopo.vars.svgGroup.select("g.grp_object").selectAll('circle.splinePoints').remove();
            objTopo.vars.svgGroup.select("g.grp_object").selectAll('circle.ellipse_flow').remove();

            // debugger
            // objTopo.vars.svgGroup.select("g.grp_object").selectAll('text').remove();

        }

        // group viewType check
        objTopo.getTopoGrpInfo();
    },

    /**
     * 현재 Grooup의 전체 경로
     */
    getTopoGrpInfo: function() {

        $axios.get('/api/d3map/getTopoGrpInfo', {params: {grpNo: objTopo.vars.curGrpNo}})
            .then((result) => {
                if (result) {

                    if ((result.viewType || 'TOPO') == TopoConst.viewType.GIS) {
                        topo_menu_action.view_gis(null, null, null, objTopo);
                    }
                    else {
                        objTopo.vars.curGrpParent = result.grpParent;
                        objTopo.vars.grpFullPath = result.pathName;
                        $('#mapBtnBox').css('display', 'block');
                        $('input:radio[name=map_viewType][value="TOPO"]').prop('checked', true);
                        objTopo.vars.isChgGrp = true;
                        objTopo.vars.viewType = TopoConst.viewType.TOPO
                        objTopo.search();
                    }
                }
        })
    },

    /** 툴팁 hide */
    hideTooltip: function () {
        var div = d3.select('div#section').select('div.tooltip');
        div.transition().duration(100).style("opacity", 0);
    },

    /** 메뉴 클릭 **/
    clickMenu: function (data) {

        // var objTopo = this;
        // 관리모드

        if (objTopo.vars.mapMode == TopoConst.mapMode.MANAGE) {
            //debugger
            //D3Topology.selectObjectSet('menu');
            _selectedHelpLine = objTopo.vars.svg.selectAll('path.helpline.helplineSelected').nodes();
            _selectedNodes = objTopo.vars.svg.selectAll("g.node rect.nodeactive").data();
            _selectedShapes = objTopo.vars.svg.selectAll("g.shape.shapeactive").data();
            _selectedClock = objTopo.vars.svg.selectAll("rect#clockSelect.clockactive").data();
            _selectedSplinePoint = objTopo.vars.svg.selectAll('circle.splinePoints.splinePointSelected').data();

            if (_selectedHelpLine.length > 0) { // 안내선 메뉴
                return topo_menu.m_menu_helpline
            }
            else if (_selectedNodes.length > 0) { // 그룹, 장비 메뉴
                if (_selectedNodes.length > 2) {
                    return topo_menu.m_menu_multi_item;
                }
                else if (_selectedNodes.length == 2) {
                    return topo_menu.m_menu_two_item;
                }
                else if (_selectedNodes.length == 1) {
                    if (_selectedNodes[0].devKind1 == "DEV") {
                        return topo_menu.m_menu_item;
                    } else if (_selectedNodes[0].devKind1 == "GRP") {
                        return topo_menu.m_menu_grp;
                    } else if (_selectedNodes[0].devKind1 == "RACK") {
                        return topo_menu.m_menu_rack;
                    } else if (_selectedNodes[0].devKind1 == "SVR") {
                        return topo_menu.m_menu_svr;
                    } else if (_selectedNodes[0].devKind1 == "POINT") {
                        return topo_menu.m_menu_point;
                    } else if (_selectedNodes[0].devKind1 == "ETC") {
                        return topo_menu.m_menu_etc;
                    } else if (_selectedNodes[0].devKind1 == "SENSOR") {
                        return topo_menu.m_menu_rack;
                    } else if (_selectedNodes[0].devKind1 == "AP_CONTROLLER") {
                        return topo_menu.m_menu_ap;
                    } else if (_selectedNodes[0].devKind1 == "LMS") {
                        return topo_menu.m_menu_item;
                    }else {
                        return topo_menu.m_menu_other;
                    }
                }
            }
            else if (_selectedShapes.length > 0) {  // 그리기도구 메뉴
                objTopo.vars.shapeArr = [];
                objTopo.vars.textArr = [];
                objTopo.vars.textAreaArr = [];

                $.each(_selectedShapes, function (i, d) {
                    if (d.devKind1 == "DRAW_SHAPE") objTopo.vars.shapeArr.push(d);
                    if (d.devKind1 == "DRAW_TEXT") objTopo.vars.textArr.push(d);
                    if (d.devKind1 == "DRAW_TEXT_AREA") objTopo.vars.textAreaArr.push(d);
                });

                if ((objTopo.vars.shapeArr.length > 0 && objTopo.vars.textArr.length > 0) ||
                    (objTopo.vars.shapeArr.length > 0 && objTopo.vars.textAreaArr.length > 0) ||
                    (objTopo.vars.textArr.length > 0 && objTopo.vars.textAreaArr.length > 0)) {
                    return topo_menu.m_menu_shape_default;
                } else if (_selectedShapes.length == 2) {
                    if (objTopo.vars.shapeArr.length > 1) {
                        return topo_menu.m_menu_shape_two;
                    } else if (objTopo.vars.textArr.length > 1) {
                        return topo_menu.m_menu_text_two;
                    } else if (objTopo.vars.textAreaArr.length > 1) {
                        return topo_menu.m_menu_text_area_two;
                    }
                } else if (_selectedShapes.length > 2) {
                    if (objTopo.vars.shapeArr.length > 1) {
                        return topo_menu.m_menu_shape_multi;
                    } else if (objTopo.vars.textArr.length > 1) {
                        return topo_menu.m_menu_text_multi;
                    } else if (objTopo.vars.textAreaArr.length > 1) {
                        return topo_menu.m_menu_text_area_multi;
                    }
                } else if (_selectedShapes.length == 1) {
                    if (data.devKind1 == 'DRAW_SHAPE') {
                        return topo_menu.m_menu_shape;
                    } else if (data.devKind1 == 'DRAW_TEXT') {
                        return topo_menu.m_menu_text;
                    } else if (data.devKind1 == 'DRAW_TEXT_AREA') {
                        return topo_menu.m_menu_text_area;
                    }
                }
            }
            else if (_selectedClock.length > 0) { // 디지털 시계 메뉴
                return topo_menu.m_menu_clock;
            }
            else if (_selectedSplinePoint.length > 0) { // spline Point 메뉴
                return topo_menu.m_menu_spline_point_del;
            }
            else {  // 기타 메뉴
                if (data == "close") {
                    $(".d3-context-menu").hide();
                } else if (data == undefined) {
                    return topo_menu.m_menu_back;
                } else if (data.devKind1 == 'DRAW_SHAPE') {
                    return topo_menu.m_menu_shape;
                } else if (data.devKind1 == 'DRAW_TEXT') {
                    return topo_menu.m_menu_text;
                } else if (data.devKind1 == 'DRAW_TEXT_AREA') {
                    return topo_menu.m_menu_text_area;
                } else if (data.itemType == 'link') {
                    //멀티회선
                    // if (data.isMulti == 1) {
                    if (objTopo.vars.selectPathLink.length === 1) {
                        objTopo.vars.selectPathLink.length = [];
                        objTopo.vars.svg.select(".svgGroup").selectAll("path.link").style("stroke-width", function (d) {
                            return d.lineSize;
                        });
                    }
                    if (objTopo.vars.selectPathLink.length > 1) {
                        if (data.curveX1 > 0)
                            return topo_menu.m_menu_curve_multi_link;
                        else
                            return topo_menu.m_menu_multi_link;
                    } else {
                        if (data.curveX1 > 0)
                            return topo_menu.m_menu_curve_link;
                        else
                            return topo_menu.m_menu_link;
                    }
                } else if (data.itemType == 'spline') {
                    return topo_menu.m_menu_spline;
                } else {
                    if (data.devKind1 == "DEV") {
                        return topo_menu.m_menu_item;
                    } else if (data.devKind1 == "GRP") {
                        return topo_menu.m_menu_grp;
                    } else if (data.devKind1 == "RACK") {
                        return topo_menu.m_menu_rack;
                    } else if (data.devKind1 == "SVR") {
                        return topo_menu.m_menu_svr;
                    } else if (data.devKind1 == "POINT") {
                        return topo_menu.m_menu_point;
                    } else if (data.devKind1 == "ETC") {
                        return topo_menu.m_menu_etc;
                    } else if (data.devKind1 == "SENSOR") {
                        return topo_menu.m_menu_rack;
                    } else if (data.devKind1 == "AP_CONTROLLER") {
                        return topo_menu.m_menu_ap;
                    } else if (data.devKind1 == "LMS") {
                        return topo_menu.m_menu_item;
                    }
                    else {
                        return topo_menu.m_menu_other;
                    }
                }
            }
        }
        // 조회모드
        else if (objTopo.vars.mapMode == TopoConst.mapMode.SEARCH) {


            if (data == "close") {
                $(".d3-context-menu").hide();
            }
            else if (data == undefined) {
                return topo_menu.s_menu_back;
            }
            else if (data.itemType == "link") {
                /* 폴링회선이 아닌경우 메뉴 표시 안함 */
                var sMenu = null;
                if (data.ifIdx1 || data.ifIdx2) sMenu = topo_menu.s_menu_link;
                else sMenu = '';

                return sMenu;
                // $(".d3-context-menu").hide();
            }
            else if (data.devKind1 == "DEV") {

                //URL 탬플릿 호출 추가로  별도메뉴처리
                //K사 (패키지공통적용)

                return; // vue적용X

                var dataList = new Array();

                var devData = new Object();
                devData.local_burette= "rMenu_detail";
                devData.title      = "장비상세정보";
                devData.action = topo_menu_action.view_devDetail;
                dataList.push(devData);

                var devData = new Object();
                devData.local_burette= "rMenu_compose";
                devData.title      = "장비구성정보";
                devData.action = topo_menu_action.view_devCpst;
                dataList.push(devData);


                var devData = new Object();
                devData.local_burette= "rMenu_compose";
                devData.title      = "장비선번정보";
                devData.action = topo_menu_action.view_lineDetail;
                dataList.push(devData);

                var devData = new Object() ;
                devData.local_burette= "rMenu_operTool";
                devData.title      = "운영도구";
                devData.children_burette = "tool";
                devData.action = function (elm, d, i) {};
                devData.childrenItems = [
                        {
                            sub_burette: "sMenu_operationTools",
                            title: "Ping",
                            action: topo_menu_action.tool_ping
                        },
                        {
                            sub_burette: "sMenu_operationTools",
                            title: "Tracert",
                            action: topo_menu_action.tool_tracert
                        },
                        {
                            sub_burette: "sMenu_operationTools",
                            title: "SSH",
                            action: topo_menu_action.tool_ssh
                        }

                    ];



                dataList.push(devData);
                var devData = new Object() ;
                devData.local_burette= "rMenu_urlCall";
                devData.title      = "URL호출";
                devData.children_burette = "urlTem";
                devData.action = function (elm, d, i) {};

                //URL 탬플릿 조회.
                var dataList2 = new Array() ;
                $axios.get('/d3map/popup/setting/itemSetting/getUrlTemplete.do', {
                    data: {},
                    success: function (result) {
                        if(result.length > 0){
                            for(var i=0; i<result.length; i++){
                                var devData2 = new Object() ;
                                devData2.sub_burette = "sMenu_setUrlTemplet";
                                devData2.title =result[i].memo;
                                devData2.action = topo_menu_action.url_template_call;
                                devData2.codeId = result[i].codeId;
                                dataList2.push(devData2);
                            }
                        }else{
                            var devData2 = new Object() ;
                            devData2.sub_burette = "sMenu_setUrlTemplet";
                            devData2.title ='URL 탬플릿 설정 필요';
                            devData2.action = '';
                            dataList2.push(devData2);
                        }
                    }
                });

                devData.childrenItems = dataList2;
                dataList.push(devData);

                return dataList;
            }
            else if (data.devKind1 == "LMS") {

                var dataList = new Array();
                var devData = new Object();
                devData.local_burette= "rMenu_compose";
                devData.title      = "장비선번정보";
                devData.action = topo_menu_action.view_lineDetail;
                dataList.push(devData);

                return dataList;

            }
            else if (data.devKind1 == "GRP") {
                return topo_menu.s_menu_grp;
            }
            else if (data.devKind1 == "SVR") {
                return topo_menu.s_menu_svr;
            }
            else if (data.devKind1 == "RACK") {
                return topo_menu.s_menu_rack;
            }
            else if (data.devKind1 == "AP_CONTROLLER") {
                return topo_menu.s_menu_ap;
            }
            else if (data.devKind1 == "SENSOR") {
                return topo_menu.s_menu_sensor;
            }
            else if (data.devKind1 == "WAS") {
                return topo_menu.s_menu_was;
            }
            else if (data.devKind1 == "DBMS") {
                return topo_menu.s_menu_dbms;
            }
            else if (data.devKind1 == "ETC") {
                return topo_menu.s_menu_none;
            }
            // 부산교통공사 임시메뉴
            // else if (data.devKind1 == "AAA") {
            //     return humetro_menu
            // }
            else {
                return topo_menu.s_menu_back;
            }
        }
        else if (objTopo.vars.mapMode == TopoConst.mapMode.LINE_EDIT) {
            return topo_menu.l_menu;
        }
    },

    /**
     * svg resizing event handler
     */
    resizeSvg: function (objTopo) {
        var w = this.vars.mapCanvas.width(),
            h = this.vars.mapCanvas.height();

        this.vars.svg.attr("width", w).attr("height", h);
        this.vars.width = w;
        this.vars.height = h;
        this.vars.scaleX = w / this.vars.stageW;
        this.vars.scaleY = h / this.vars.stageH;
        // console.log(w + " , " + h + " //// " + D3Topology.vars.scaleX + " , " + D3Topology.vars.scaleY)

        this.vars.svg.select(".svgGroup")
            .attr("transform", "scale(" + [this.vars.scaleX, this.vars.scaleY].join(",") + "), translate(0,0)");
    },

    /** Node - Bubble 이벤트 radialGradient 정의 */
    createEvtBubble: function () {
        defs = this.vars.svg.append("defs").attr("id", "defs");

        colorArr = [
            ["#5456b4", "#393cb7", "#1e219a"],  //information
            ["#f8f49f", "#f5ec3e", "#fff30c"],	//warning
            ["#f8dd67", "#f0cc31", "#ecc106"],	//minor
            ["#f2b251", "#f0a534", "#f19100"],	//major
            ["#f47469", "#ec594d", "#e23b2d"],	//critical
            ["#53C9AE", "#53C9AE", "#53C9AE"],	//action
            ["#072DEB", "#072DEB", "#072DEB"],	//work
        ];
        for (var i = 1; i <= colorArr.length; i++) {
            _color = colorArr[i - 1];
            _id = i > 5 ? (6 - i) - 1 : i + 1;
            radialGradient = defs.append("radialGradient")
                .attr("id", "radial-gradient" + _id)
                .attr("gradientUnits", "objectBoundingBox")
                .attr("cx", "50%")
                .attr("cy", "50%")
                .attr("r", "100%");

            radialGradient.append("stop")
                .attr("offset", "0%")
                .attr("stop-color", "#FFFFFF");
            radialGradient.append("stop")
                .attr("offset", "30%")
                .attr("stop-color", _color[0]);
            radialGradient.append("stop")
                .attr("offset", "40%")
                .attr("stop-color", _color[1]);
            radialGradient.append("stop")
                .attr("offset", "50%")
                .attr("stop-color", _color[2]);
        }
    },

    /**
     * 아이콘 좌표값 계산
     */
    // DB 좌표를 Canvas 좌표로 변환
    convertMapLocation: function (point) {
        return [(point[0] / 1040) * this.vars.stageW, (point[1] / 740) * this.vars.stageH];
    },

    // Canvas 좌표를 DB 좌표로 변환
    convertSaveLocation: function (point) {
        return [(point[0] / this.vars.stageW) * 1040, (point[1] / this.vars.stageH) * 740];
    },

    convertLocalToGlobalLocation: function (point) {
        return [(point[0] / this.vars.width) * this.vars.stageW, (point[1] / this.vars.height) * this.vars.stageH];
    },

    addItemTick: function (result) {
        // var objTopo = this;

        nodeIds = objTopo.vars.nodes.map(function (d) {
            return d.id;
        });
        addedNodes = result.filter(function (d) {
            return $.inArray("g" + d.itemNo, nodeIds) === -1;
        });

        objTopo.vars.nodes = objTopo.vars.nodes.concat(TopoItem.setNodeData(addedNodes, objTopo));
        objTopo.vars.simulation.nodes(objTopo.vars.nodes);
        // var node_call = objTopo.createDrags(objTopo, objTopo.dragstart, objTopo.dragmove, objTopo.dragend);
        TopoItem.refresh(objTopo, objTopo.vars.svg, objTopo.vars.nodes, node_call, getBBox);

        // 회선 조회
        objTopo.searchLink();

        objTopo.tick(objTopo);
        objTopo.tickLinkLabels(objTopo);
    },

    editItemTick: function (addData, type) {
        // var objTopo = this;
        $.each(objTopo.vars.nodes, function (idx, value) {

            switch (type) {
                case TopoConst.editTypeString.GN:
                    if (value.mngNo == addData.mngNo) {
                        objTopo.vars.nodes[idx].itemName = addData.grpName;
                    }
                    break;
                case TopoConst.editTypeString.IA:
                    if (value.itemNo == addData.itemNo) {
                        objTopo.vars.nodes[idx].itemAlias = addData.itemAlias;
                    }
                    break;
                case TopoConst.editTypeString.FS:
                    $.each(addData.itemNos, function (i, v) {
                        if (value.itemNo == v) {
                            objTopo.vars.nodes[idx].fontSize = addData.fontSize;
                        }
                    });
                    break;
                case TopoConst.editTypeString.IS:
                    $.each(addData.itemNos, function (i, v) {
                        if (value.itemNo == v) {
                            objTopo.vars.nodes[idx].itemSize = addData.itemSize;
                        }
                    });
                    break;
                case TopoConst.editTypeString.IT:
                    if (value.itemNo == addData.itemNo) {
                        objTopo.vars.nodes[idx].devKind2 = addData.devKind2;
                    }
                    break;
                case TopoConst.editTypeString.LP:
                    $.each(addData.itemNos, function (i, v) {
                        if (value.itemNo == v) {
                            objTopo.vars.nodes[idx].itemConf.labelPosition = JSON.parse(addData.itemConf).labelPosition;
                        }
                    });
                    break;
            }

        });

        objTopo.vars.simulation.nodes(objTopo.vars.nodes);
        TopoItem.callRefresh(objTopo);

        // 회선 조회
        objTopo.searchLink.call(objTopo);
        objTopo.tick(objTopo);
        objTopo.tickLinkLabels(objTopo);
    },

    delItemTick: function (result, type) {
        var idIdxs = [];
        // var objTopo = this;

        if (type == "d") {
            for (var i = 0; i < objTopo.vars.nodes.length; i++) {
                if (result.itemNo == objTopo.vars.nodes[i].itemNo) {
                    idIdxs.push(i);
                }
            }
        } else {
            for (var i = 0; i < result.length; i++) {
                $.each(objTopo.vars.nodes, function (idx, value) {
                    if (value.itemNo == result[i].itemNo) {
                        idIdxs.push(idx);
                    }
                });
            }
        }

        var spliceCnt = 0;

        $.each(idIdxs, function (idx, value) {
            objTopo.vars.nodes.splice(value + spliceCnt, 1);
            spliceCnt--;
        });

        objTopo.vars.simulation.nodes(objTopo.vars.nodes, objTopo);
        // var node_call = objTopo.createDrags(objTopo, objTopo.dragstart, objTopo.dragmove, objTopo.dragend);
        // var getBBox = objTopo.createBBox;
        TopoItem.refresh(objTopo, objTopo.vars.svg, objTopo.vars.nodes, node_call, getBBox);

        // 회선 조회
        objTopo.searchLink();

        objTopo.tick(objTopo);
        objTopo.tickLinkLabels(objTopo);
    },

    /* Shape Text 생성 및 변경, 삭제 */
    // drawShapeTextTick: function(result) {
    //     TopoDraw.drawShapeTextRefresh(result);
    // },

    delDrawTick: function (result, type) {
        // var objTopo = this;
        for (var i = 0; i < result.length; i++) {
            $.each(objTopo.vars.svg.selectAll("g.shape").nodes(), function (idx, value) {
                if (d3.select(value).data()[0].drawNo == result[i].drawNo) {
                    d3.select(value).remove();
                }
            });
        }

        objTopo.vars.draws = objTopo.vars.svg.selectAll("g.shape");
        TopoRotate.shapeRotatorReDraw(objTopo);
        objTopo.tick(objTopo);
    },

    delSplineTick: function (result, type) {
        // var objTopo = this;
        for (var i = 0; i < result.length; i++) {
            $.each(objTopo.vars.svg.selectAll("path.spline").nodes(), function (idx, value) {
                if (d3.select(value).data()[0].splineNo == result[i].splineNo) {
                    objTopo.vars.svg.select(".svgGroup").select("g.grp_spline_" + result[i].splineNo).remove();
                    // objTopo.vars.svg.select(".svgGroup").select("g.grp_spline_" + result[i].splineNo).selectAll('circle.splinePoints').remove();
                    d3.select(value).remove();
                    objTopo.vars.svg.select(".svgGroup").selectAll("circle.flow").filter(function (d) {
                        return d.splineNo == result[i].splineNo;
                    }).remove()
                }
            });
        }
        objTopo.vars.splines = objTopo.vars.svg.selectAll("path.spline");
    },

    tick: function (objTopo) {
        if (objTopo === undefined) objTopo = this;
        // var node = objTopo.vars.svg.select(".svgGroup").selectAll("g.node");
        objTopo.vars.svg.select(".svgGroup").selectAll("g.node").attr("transform", function (d) {
            // var scale = TopoUtil.getItemScale(d.itemSize);
            return "translate({0},{1})"
                .substitute(d.cx - (55 * TopoUtil.getItemScale(d.itemSize) / 2), d.cy - (55 * TopoUtil.getItemScale(d.itemSize) / 2));
        });
        objTopo.vars.svg.select(".svgGroup").selectAll("g.node").filter(function (d) {
            return d.devKind1 != 'POINT';
        }).style('display', 'block');

        objTopo.vars.simulation.force("link").links(objTopo.vars.links);

        if (objTopo.vars.links.length != 0) {
            // var link = objTopo.vars.svg.selectAll("path.link");
            objTopo.vars.svg.selectAll("path.link").attr("d", function (d) {
                /**
                 * 높낮이 조정
                 */
                sourceX = d.source.devKind2 == "POINT" ? d.source.cx : (d.linePointLR1) + d.source.cx;
                targetX = d.target.devKind2 == "POINT" ? d.target.cx : (d.linePointLR2) + d.target.cx;
                sourceY = d.source.devKind2 == "POINT" ? d.source.cy : (d.linePointUD1) + d.source.cy;
                targetY = d.target.devKind2 == "POINT" ? d.target.cy : (d.linePointUD2) + d.target.cy;

                /**
                 * IE/Chrome간 path 값 접근시 index차이가 발생하여 구분자를 ',' -> ' ' 으로 변경함
                 *  2018.03.06 by jjung
                 */
                _linkConf = JSON.parse(d.lineLabelConf);
                _dx = targetX - sourceX;
                _dy = targetY - sourceY;
                if (d.lineType == 3 || d.lineType == 4) {
                    _tmpVal = Math.abs(_dx * (11 - parseInt(_linkConf.fixCurveAngle||1))) + Math.abs(_dy * (11 - parseInt(_linkConf.fixCurveAngle||1))) ;
                    _dr = Math.sqrt(_dx * _dx + _dy * _dy) + _tmpVal;
                }

                // _dr = 1000 - (500 + ((50 * labelConf.fixCurveAngle||0) - 1));
                // _dr = 500 - ((50 * labelConf.fixCurveAngle||0) - 1);

                lineD = null;
                if (d.lineType == 1)    // 직선
                    lineD = ["M", sourceX, sourceY, "L", targetX, targetY].join(" ");
                else if (d.lineType == 2)   // 곡선
                    lineD = ["M", sourceX, sourceY, "C", d.curveX1, d.curveY1, d.curveX2, d.curveY2, targetX, targetY].join(" ");
                else if (d.lineType == 3)   // 고정 상향 곡선
                    lineD = ["M", sourceX, sourceY, "A", _dr, _dr, 0, 0, 1, targetX, targetY].join(" ");
                else if (d.lineType == 4)   // 고정 하향 곡선
                    lineD = ["M", sourceX, sourceY, "A", _dr, _dr, 1, 0, 0, targetX, targetY].join(" ");

                return lineD;
            });
        }



        objTopo.vars.svg.select(".svgGroup").selectAll("g.shape").attr("transform", function (d) {
            return "translate({0},{1})".substitute(d.posX, d.posY);
        });

        objTopo.itemOptionImageRePostion();
    },

    tickLinkLabels: function (objTopo) {
        if (objTopo === undefined) objTopo = this;

        linkLabelItem = objTopo.vars.svg.select("g.grp_object").selectAll("g.linkLabel").selectAll("text").filter( function (d, i) {
            TopoLinkLabel.labelConf = JSON.parse(d.lineLabelConf) ? JSON.parse(d.lineLabelConf) : {lineLabel : '0', linePerf : '0'};
            return labelConf.lineLabel == '1' || labelConf.linePerf == '1'? d : null;
        });

        if (!Array.isArray(linkLabelItem) &&  linkLabelItem.nodes().length > 0) {
            linkLabelCall = objTopo.createLinkLabelDrags(objTopo);
            objTopo.vars.linkLabels = TopoLinkLabel.refresh(objTopo, objTopo.vars.svg, objTopo.vars.links, linkLabelCall);
        }
    },

    /**
     * node 및 shape 방향키 이동
     *
     */
    nodeMoveKeyDown: function(keyCode){

        keyNodes = objTopo.vars.svg.selectAll("g.node rect.nodeactive").data();
        keyShapes = objTopo.vars.svg.selectAll("g.shape.shapeactive").data();

        if (keyNodes && keyNodes.length > 0 ) {

            if (keyCode === 37)  {  // 방향키 좌
                keyPosition = 'X', moveValue = -1;
            } else if (keyCode === 38) { // 방향키 상
                keyPosition = 'Y',  moveValue = -1;
            } else if (keyCode === 39) { // 방향키 우
                keyPosition = 'X', moveValue = 1;
            } else if (keyCode === 40) { // 방향키 하
                keyPosition = 'Y', moveValue = 1;
            }

            if ( !objTopo.nodeDragMoveLimitCheck(keyNodes)) {
                var retValue = 0;
                if (keyPosition === 'X') {
                    if (moveValue < 0) retValue = 2;
                    else if (moveValue > 0) retValue = -2;
                }
                else { // 'Y'
                    if (moveValue < 0) retValue = 2;
                    else if (moveValue > 0) retValue = -2;
                }
                objTopo.nodeMoveKey(keyNodes, keyPosition, retValue );
                return;
            }
            else {
                objTopo.nodeMoveKey(keyNodes, keyPosition, moveValue );
            }
            // 갭체 이동 여부
            objTopo.vars.isMove = true;
        }
        else if (keyShapes && keyShapes.length > 0) {

            if (keyCode === 37)  {  // 방향키 좌
                keyPosition = 'X', moveValue = -1;
            } else if (keyCode === 38) { // 방향키 상
                keyPosition = 'Y', moveValue = -1;
            } else if (keyCode === 39) { // 방향키 우
                keyPosition = 'X', moveValue = 1;
            } else if (keyCode === 40) { // 방향키 하
                keyPosition = 'Y', moveValue = 1;
            }

            if ( !objTopo.shapeDragMoveLimitCheck(keyShapes) ) {
                var retValue = 0;
                if (keyPosition === 'X') {
                    if (moveValue < 0) retValue = 2;
                    else if (moveValue > 0) retValue = -2;
                }
                else { // 'Y'
                    if (moveValue < 0) retValue = 2;
                    else if (moveValue > 0) retValue = -2;
                }
                objTopo.shapeMoveKey(keyShapes, keyPosition, retValue );
                return;
            }
            else {
                objTopo.shapeMoveKey(keyShapes, keyPosition, moveValue );
            }

            // 갭체 이동 여부
            objTopo.vars.isMove = true;
        }

    },

    nodeMoveKey: function (nodes, position, value) {
        for (var i = 0; i < nodes.length; i++) {
            var _d = nodes[i];
            if (position === "X") {
                _d.px += value;
                _d.x += value;
                _d.cx += value;
            }
            else if (position === "Y") {
                _d.py += value;
                _d.y += value;
                _d.cy += value;
            }
        }
        objTopo.tick(objTopo);
    },

    shapeMoveKey: function (shapes, position, value) {
        for (var i = 0; i < shapes.length; i++) {
            var _d = shapes[i];
            if (position === "X") _d.posX += value;
            else if (position === "Y")  _d.posY += value;
        }
        objTopo.tick(objTopo);
    },

    /** Items mouseDrag 생성 **/
    createDrags: function (objTopo, dragStart, dragMove, dragEnd) {
        return d3.drag()
            .on("start", function () {
                dragStart.call(objTopo);
            })
            .on("drag", function () {
                dragMove.call(objTopo);
            })
            .on("end", function () {
                dragEnd.call(objTopo);
            });
    },

    dragstart: function (d) {
        // var objTopo = this;

        /* 회선 명칭 이동하였을 경우 장비 Item dragmove 시 회선명칭 위치 저장 후 진행 가능 */
        if (objTopo.vars.isChgLinkLablePosition) {
            // console.log("objTopo.vars.isChgLinkLablePosition ==> ",objTopo.vars.isChgLinkLablePosition);
            /* 회선명칭 위치 저장 함수 호출*/
            if (!confirm('위치변경된 회선명칭 or 성능명칭이 있습니다.' +
                '\r\n저장 후 이동 가능합니다.' +
                '\r\n저장하시겠습니까?')) return false;
            TopoLinkLabel.linkLabelPositionSave(objTopo);
            //objTopo.vars.isChgLinkLablePosition = false;
            return false;
        }


        _selectedShapes = null;
        if (objTopo.vars.mapMode != TopoConst.mapMode.MANAGE) return;

        // // shape 선택 해제
        // objTopo.vars.svgGroup.selectAll("g.shape").classed("shapeactive", false)
        //     .selectAll("rect.shapeselection")
        //     .style("display", "none");
        //
        // // clock active 해제
        // objTopo.vars.svgGroup.select("rect#clockSelect").classed("clockactive", false).style("display", "none");
        //
        // // rotator block 처리
        // objTopo.vars.svg.select(".svgGroup").selectAll(".rotator").style("display", "block");
        //
        // //spline circle active 해제
        // objTopo.vars.svg.select(".svgGroup").selectAll('circle.splinePoints').classed("splinePointSelected", false);
        //
        // // help line 해제
        // objTopo.vars.svg.selectAll('path.helpline').classed("helplineSelected", false);
        //
        // // findMark 해제
        // objTopo.vars.svg.select("g.grp_object").selectAll('.imgFindMark').style("display", "none");

        objTopo.selectObjectSet('item');

        //objTopo.vars.isDrag = true;
        // state = this.querySelector("rect.state"),
        var state = d3.event.sourceEvent.target.parentNode.querySelector("rect.state"); //타겟의 rect.state 찾기
        var isSelected = d3.select(state).classed("nodeactive");
        // console.log(e.ctrlKey + " --- " + e.sourceEvent.ctrlKey);

        if (d3.event.sourceEvent.shiftKey) {
            keepPoint.x = d3.event.x;
            keepPoint.y = d3.event.y;
        }
        else if (!d3.event.sourceEvent.ctrlKey) {
            objTopo.vars.selectItemNode = [];
            objTopo.vars.selectPathLink = [];
            if (isSelected) return;
            d3.selectAll("g.node rect.nodeactive").classed("nodeactive", false);
            d3.select(state).classed("nodeactive", true);
            // objTopo.vars.selectItemNode.push(d3.select(state).data()[0].id);
        }
        else {
            d3.select(state).classed("nodeactive", !isSelected);
            // objTopo.vars.selectItemNode.push(d3.select(state).data()[0].id);
        }

        // 이벤트 대상이 선택모드가 아니면 선택모드로 전환
        // node아이템에서 mousedown이벤트가 발생하지 않음. dragstart이벤트 때문인듯..
        if (!isSelected) {
            d3.select(state).classed("nodeactive", true);
            objTopo.vars.selectItemNode.push(d3.select(state).data()[0].id);
        }
    },

    dragmove: function (d) {
        // var objTopo = this;
        objTopo.vars.isMove = true;
        _selectedNodes = objTopo.vars.svg.selectAll("g.node rect.nodeactive").data();
        if (_selectedNodes != null && _selectedNodes.length > 0) {
            xDragVal = keepPoint.x > d3.event.x ? keepPoint.x - d3.event.x : d3.event.x - keepPoint.x;
            yDragVal = keepPoint.y > d3.event.y ? keepPoint.y - d3.event.y : d3.event.y - keepPoint.y;

            if ( !objTopo.nodeDragMoveLimitCheck(_selectedNodes) ) return;
            var i;
            if (d3.event.sourceEvent.shiftKey) {
                if ( xDragVal > yDragVal ) {
                    for (i = 0; i < _selectedNodes.length; i++) {
                        _d = _selectedNodes[i];
                        _d.px += d3.event.dx;
                        _d.x += d3.event.dx;
                        _d.cx += d3.event.dx;
                        _d.xpoint = _d.x;
                    }
                }
                else {
                    for (i = 0; i < _selectedNodes.length; i++) {
                        _d = _selectedNodes[i];
                        _d.py += d3.event.dy;
                        _d.y += d3.event.dy;
                        _d.cy += d3.event.dy;
                        _d.ypoint = _d.y;
                    }

                }
            }
            else {

                for (i = 0; i < _selectedNodes.length; i++) {
                    _d = _selectedNodes[i];
                    _d.px += d3.event.dx;
                    _d.py += d3.event.dy;
                    _d.x += d3.event.dx;
                    _d.xpoint = _d.x;
                    _d.y += d3.event.dy;
                    _d.cx += d3.event.dx;
                    _d.cy += d3.event.dy;
                    _d.ypoint = _d.y;
                }
            }
            objTopo.tick(objTopo);
            objTopo.tickLinkLabels(objTopo);
        }
    },

    nodeDragMoveLimitCheck: function(_nodes) {
        // 선택된 아이들의 rect 영역을 구한다.
        var minx = _nodes[0].x;
        var miny = _nodes[0].y;
        var maxx = _nodes[0].x + TopoUtil.getItemWidth(_nodes[0].itemSize);
        var maxy = _nodes[0].y + TopoUtil.getItemWidth(_nodes[0].itemSize);
        for (var y = 0; y < _nodes.length; y++) {
            var _sd = _nodes[y];
            if (minx > _sd.x) {
                minx = _sd.x;
            }
            if (miny > _sd.y) {
                miny = _sd.y;
            }
            if (maxx < _sd.x + TopoUtil.getItemWidth(_sd.itemSize)) {
                maxx = _sd.x + TopoUtil.getItemWidth(_sd.itemSize);
            }
            if (maxy < _sd.y + TopoUtil.getItemWidth(_sd.itemSize)) {
                maxy = _sd.y + TopoUtil.getItemWidth(_sd.itemSize);
            }
        }

        if (minx < 0 || miny < 0 || maxx > objTopo.vars.stageW || maxy > objTopo.vars.stageH) {
            return false;
        } else {
            return true;
        }

    },

    dragend: function (d) {
        // var objTopo = this;
        //objTopo.vars.isDrag = false;

        _selectedNodes = objTopo.vars.svg.selectAll("g.node rect.nodeactive").data();
        if (_selectedNodes != null && _selectedNodes.length > 0) {
            for (var i = 0; i < _selectedNodes.length; i++) {
                _d = _selectedNodes[i];
                if (_d.x + TopoUtil.getItemWidth(_d.itemSize) >= objTopo.vars.stageW) {
                    _d.x = objTopo.vars.stageW - TopoUtil.getItemWidth(_d.itemSize);
                    _d.cx = _d.x + _d.xgap;
                }
                if (_d.y + TopoUtil.getItemWidth(_d.itemSize) >= objTopo.vars.stageH) {
                    _d.y = objTopo.vars.stageH - TopoUtil.getItemWidth(_d.itemSize);
                    _d.cy = _d.y + _d.ygap;
                }
                if (_d.x < 0) {
                    _d.x = 0;
                    _d.cx = _d.x + _d.xgap;
                }
                if (_d.y < 0) {
                    _d.y = 0;
                    _d.cy = _d.y + _d.ygap;
                }
                _d.xpoint = _d.x;
                _d.ypoint = _d.y;
            }
            objTopo.tick(objTopo);
            objTopo.tickLinkLabels(objTopo);
        }

    },

    /** shapes mouseDrag 생성 **/
    createShapeDrags: function (objTopo, shapeDragstart, shapeDragMove, shapeDragEnd) {
        return d3.drag()
            .on("start", function () {
                shapeDragstart.call(objTopo);
            })
            .on("drag", function () {
                shapeDragMove.call(objTopo);
            })
            .on("end", function () {
                shapeDragEnd.call(objTopo);
            });
    },

    shapeDragstart: function (d) {
        // var objTopo = this;
        _selectedNodes = null;
        if (objTopo.vars.mapMode != TopoConst.mapMode.MANAGE) return;



        // // 장비(그룹) 아이콘 선택 해제
        // d3.selectAll("g.node rect.nodeactive").classed("nodeactive", false);
        //
        // // clock active 해제
        // objTopo.vars.svgGroup.selectAll("rect#clockSelect").classed("clockactive", false).style("display", "none");
        //
        // //spline circle active 해제
        // objTopo.vars.svg.select(".svgGroup").selectAll('circle.splinePoints').classed("splinePointSelected", false);
        //
        // // help line 해제
        // objTopo.vars.svg.selectAll('path.helpline').classed("helplineSelected", false);

        objTopo.selectObjectSet('shape');

        var e = d3.event,
            shape = d3.event.sourceEvent.currentTarget,
            isSelected = d3.select(shape).classed("shapeactive");

        // var state = d3.event.sourceEvent.target.parentNode.querySelector("rect.state"); //타겟의 rect.state 찾기
        // var isState = d3.select(state).classed("nodeactive");

        var rotator = objTopo.vars.svg.select(".svgGroup").selectAll(".rotator")
            .filter(function(d,i){
                return d.rTargetId == shape.id;
            });

        // console.log("shapeDragstart : ===> " + e.ctrlKey + " --- " + e.sourceEvent.ctrlKey);
        if (d3.event.sourceEvent.shiftKey) {
            keepPoint.x = d3.event.x;
            keepPoint.y = d3.event.y;
        } else if (!e.sourceEvent.ctrlKey) {
            if (isSelected) return;

            objTopo.vars.svgGroup.selectAll("g.shape")
                .classed("shapeactive", false)
                .selectAll("rect.shapeselection")
                .style("display", "none");

            d3.select(shape)
                .classed("shapeactive", true)
                .select("rect.shapeselection")
                .style("display", "block");

            /* 네모, 둥근네모, 원 선택영역 */
            objTopo.vars.svgGroup.selectAll("g.shape")
                .selectAll("rect.drawselection")
                .style("display", "none");

            // debugger
            d3.select(shape)
                .selectAll("rect.drawselection")
                .style("display", "block");
            /* 네모, 둥근네모, 원 선택영역 */

            objTopo.vars.svg.select(".svgGroup").selectAll(".rotator")
                .classed("shapeactive", false);

            rotator.classed("shapeactive", true);

        }
        else {
            var isView = !isSelected ? "block" : "none";
            d3.select(shape)
                .classed("shapeactive", !isSelected)
                .selectAll("rect.shapeselection")
                .style("display", isView);

            d3.select(shape)
                .selectAll("rect.drawselection")
                .style("display", isView);

            rotator.classed("shapeactive", !isSelected)

        }

        // objTopo.activeRelease();

        // 이벤트 대상이 선택모드가 아니면 선택모드로 전환
        // node아이템에서 mousedown이벤트가 발생하지 않음. dragstart이벤트 때문인듯..
        if (!isSelected) {
            d3.select(shape).classed("shapeactive", true);
            d3.select(shape).selectAll("rect.drawselection").style("display", "block");
        }
    },

    shapeDragmove: function (d) {
        // var objTopo = this;
        objTopo.vars.isMove = true;
        _selectedShapes = objTopo.vars.svg.selectAll("g.shape.shapeactive").data();
        if (_selectedShapes != null && _selectedShapes.length > 0) {

            yDragVal = keepPoint.y > d3.event.y ? keepPoint.y - d3.event.y : d3.event.y - keepPoint.y;
            if ( !objTopo.shapeDragMoveLimitCheck(_selectedShapes) ) return;
            var i;
            if (d3.event.sourceEvent.shiftKey) {
                if ( xDragVal > yDragVal ) {
                    for (i = 0; i < _selectedShapes.length; i++) {
                        _d = _selectedShapes[i];
                        _d.posX += d3.event.dx;
                    }
                }
                else {
                    for (i = 0; i < _selectedShapes.length; i++) {
                        _d = _selectedShapes[i];
                        _d.posY += d3.event.dy;
                    }

                }
            }
            else {
                for (i = 0; i < _selectedShapes.length; i++) {
                    _d = _selectedShapes[i];
                    _d.posX += d3.event.dx;
                    _d.posY += d3.event.dy;
                }
            }


            objTopo.tick(objTopo);
        }
    },

    shapeDragMoveLimitCheck: function(_shapes) {
        // 선택된 아이들의 rect 영역을 구한다.


        let minx, miny, maxx, maxy, y, textCnt;
        let correctVal = _shapes[0].devKind1 === "DRAW_TEXT" || _shapes[0].devKind1 === "DRAW_TEXT_AREA" ? 35 : 0;

        if (_shapes[0].devKind1 === "DRAW_TEXT_AREA") {
            textCnt =_shapes[0].textContent.split('\n').length - 1;
            if (textCnt > 0) miny = _shapes[0].posY - ((_shapes[0].height/textCnt)/2);
            else miny = _shapes[0].posY - (_shapes[0].height/2);
        }
        else {
            miny = _shapes[0].posY - (_shapes[0].devKind1 === "DRAW_TEXT"  ? _shapes[0].height/2 : 0);
        }

        minx = _shapes[0].posX - (_shapes[0].devKind1 === "DRAW_TEXT" || _shapes[0].devKind1 === "DRAW_TEXT_AREA" ? _shapes[0].width/2 : 0);
        //miny = _shapes[0].posY - (_shapes[0].devKind1 === "DRAW_TEXT" || _shapes[0].devKind1 === "DRAW_TEXT_AREA" ? _shapes[0].height/2 : 0);
        maxx = _shapes[0].posX + _shapes[0].width - (_shapes[0].devKind1 === "DRAW_TEXT" || _shapes[0].devKind1 === "DRAW_TEXT_AREA" ? _shapes[0].width : 0);
        maxy = _shapes[0].posY + _shapes[0].height - (_shapes[0].devKind1 === "DRAW_TEXT" || _shapes[0].devKind1 === "DRAW_TEXT_AREA" ? _shapes[0].height : 0);

        // console.table( _shapes[0].posX);
        for (y = 0; y < _shapes.length; y++) {
            let _sd = _shapes[y];
            if (minx > _sd.posX) {
                minx = _sd.posX;
            }
            if (miny > _sd.posY) {
                miny = _sd.posY;
            }
            if (maxx < _sd.posX + _sd.width) {
                maxx = _sd.posX + (_sd.devKind1 === "DRAW_TEXT" || _sd.devKind1 === "DRAW_TEXT_AREA" ? _sd.width/2 : _sd.width) ;
            }
            if (maxy < _sd.posY + _sd.height) {
                maxy = _sd.posY + (_sd.devKind1 === "DRAW_TEXT" || _sd.devKind1 === "DRAW_TEXT_AREA" ? _sd.height/2 - 15 : _sd.height);
            }
        }

        if (minx < 0 || miny < 0 || maxx > objTopo.vars.stageW || maxy > objTopo.vars.stageH) {
            return false;
        } else {
            return true;
        }

    },

    shapeDragend: function (d) {
        // var objTopo = this;
        //objTopo.vars.isDrag = false;
        _selectedShapes = objTopo.vars.svg.selectAll("g.shape.shapeactive").data();
        if (_selectedShapes != null && _selectedShapes.length > 0) {
            for (var i = 0; i < _selectedShapes.length; i++) {

                var _d = _selectedShapes[i];
                var stX, stY, _dWidth, _dHeight, textCnt;

                if (_d.devKind1 === "DRAW_TEXT" || _d.devKind1 === "DRAW_TEXT_AREA") {

                    stX = _d.width/2;
                    if (_d.devKind1 === "DRAW_TEXT_AREA") {
                        textCnt = _d.textContent.split('\n').length - 1;
                        stY = textCnt > 0 ? _d.height/(textCnt-1)/2 : _d.height/2;
                    }
                    else {
                        stY = _d.height/2;
                    }
                    // stY = _d.devKind1 === "DRAW_TEXT_AREA" ? _d.height/textCnt : _d.height/2;
                    _dWidth = _d.width/2;
                    _dHeight = _d.height/2;
                }
                else {
                    stX = 0;
                    stY = 0;
                    _dWidth = _d.width;
                    _dHeight = _d.height;
                }

                if (_d.posX + _dWidth >= objTopo.vars.stageW) {
                    //_d.posX = _d.posX - 15;
                    //debugger
                    if (_d.devKind1 === "DRAW_TEXT") _d.posX = objTopo.vars.stageW - (_dWidth);
                    else if (_d.devKind1 === "DRAW_TEXT_AREA") _d.posX = objTopo.vars.stageW - (_dWidth);
                    else _d.posX = objTopo.vars.stageW - (_dWidth + 15);

                }
                if (_d.posY + _dHeight >= objTopo.vars.stageH) {
                    // _d.posY = _d.posY - 15;
                    if (_d.devKind1 === "DRAW_TEXT") {
                        _d.posY = objTopo.vars.stageH - (_dHeight/2);
                    }
                    else if (_d.devKind1 === "DRAW_TEXT_AREA") {

                        if (textCnt > 1)  _d.posY = objTopo.vars.stageH - ( _d.height - (_d.height / textCnt) );
                        else  _d.posY = objTopo.vars.stageH - (_dHeight);
                    }
                    else {
                        _d.posY = objTopo.vars.stageH - (_dHeight + 15);
                    }

                    // _d.posY = _d.devKind1 === "DRAW_TEXT" || _d.devKind1 === "DRAW_TEXT_AREA" ? objTopo.vars.stageH - (_d.height + 5) : objTopo.vars.stageH - (_d.height + 15);
                }
                if (_d.posX - stX < 0) {

                    if (_d.devKind1 === "DRAW_TEXT" || _d.devKind1 === "DRAW_TEXT_AREA") _d.posX = stX + 5;
                    else  _d.posX = 0;


                }
                if (_d.posY - stY < 0) {

                    if (_d.devKind1 === "DRAW_TEXT" ) {
                        _d.posY = stY + 5;
                    }
                    else if (_d.devKind1 === "DRAW_TEXT_AREA") {

                        _d.posY = textCnt > 0 ? stY + 5: stY + 5;
                    }
                    else  {
                        _d.posY = 0;
                    }
                }
            }

            objTopo.tick(objTopo);
        }

        // TopoRotate.shapeRotatorReDraw(objTopo);
        objTopo.activeRelease();
    },


    /** LinkLabel mouseDrag 생성 **/
    createLinkLabelDrags: function (objTopo) {
        return d3.drag()
            .on("start", function (d) {
                if (objTopo.vars.mapMode != TopoConst.mapMode.MANAGE) return;
                TopoLinkLabel.linkTextDragStart(this, d, objTopo);
            })
            .on("drag", function (d) {
                if (objTopo.vars.mapMode != TopoConst.mapMode.MANAGE) return;
                objTopo.vars.isChgLinkLablePosition = true;
                TopoLinkLabel.linkTextDragMove(this, d, objTopo);
            })
            .on("end", function (d) {
                if (objTopo.vars.mapMode != TopoConst.mapMode.MANAGE) return;
            });
    },




    ani_bubble: function (objTopo) {
        TopoItem.animation(objTopo);
        // TopoLink.animation();
    },

    // 회선 흐름효과
    ani_traffic: function(objTopo) {
        if (objTopo.vars.mapMode == TopoConst.mapMode.SEARCH) TopoLink.animationTraffic(objTopo);
    },

    /*
    * 조회모드/관리모드 상태에 따른 설정
     */
    modeConditionSet: function(objTopo) {
        objTopo.clearObject(objTopo);
        if (objTopo.vars.mapMode == TopoConst.mapMode.SEARCH) {
            /* 조회모드 */

            // objTopo.clearObject(objTopo);

            // objTopo.vars.svgGroup.selectAll("g.node.point").style("display", "none");
            // objTopo.vars.svg.selectAll("g.node rect.nodeactive").classed("nodeactive", false);
            // objTopo.vars.svgGroup.selectAll("g.shape image").style("display", "none");
            // objTopo.vars.svgGroup.selectAll("g.shape rect.shapeselection").style("display", "none");
            //
            // objTopo.ani_traffic(objTopo);
            // objTopo.createImageFlow();
            // objTopo.tick(objTopo);

            $('.slideShow').css('display','block');
            $('.slideThree').find("input:checkbox").prop('checked', false);
            $('.slideThree').css("background","#e0e0e0");
            $('.slideThree label').css({"background":"url(../../img/Btn/IconBtn-Refresh.svg)", 'background-color' : '#a3a3a3', 'background-size' : 'contain','background-repeat' : 'no-repeat', 'background-position':'center center'});

            $('.modeSlide').css("background","#191e3a");
            $('.modeSlide #topoMapMode').css("color","#fff").css("left","17px");
            $('.modeSlide label').css({"background":"url(../../img/Btn/mode01.svg)", 'background-color' : '#fff', 'background-repeat' : 'no-repeat', 'background-position':'center center'});

            $('.viewNav').css("display","block");
            $('.manageNav').css("display","none");
            // $('.nonBox').css("display","none");

            // objTopo.createDigitalClock();
            objTopo.vars.isViewHelpLine = false;
            objTopo.vars.isViewGridLine = false;
            objTopo.vars.isViewGridAxis = false;
            objTopo.startTimer();
            objTopo.search();

        } else {
            $('.slideShow').css('display','none');
            // $('.nonBox').css('display','block');

            // if (objTopo.slideTimer != null) {
            //     clearInterval(objTopo.slideTimer);
            //     $('.slideStop').css('display','none');
            //     $('.slideStart').css('display','block');
            //     $('#slidePrograssBar').css('width', '0%');
            //     $('#btnSlideSetting').disabled = false;
            // }
            // objTopo.slideTimer = null;
            //
            //
            // if (objTopo.rtTimer != null) {
            //     clearInterval(objTopo.rtTimer);
            // }
            // objTopo.rtTimer = null;
            // objTopo.clearAudioInterval();
            //
            // if (typeof TopoFlow.flowInterval !== "undefined" && TopoFlow.flowInterval) {
            //     clearInterval(TopoFlow.flowInterval);
            //     TopoFlow.flowInterval = null;
            // }
            //
            // if (typeof TopoSpline.flowSplineInterval !== "undefined" && TopoSpline.flowSplineInterval) {
            //     clearInterval(TopoSpline.flowSplineInterval);
            //     TopoSpline.flowSplineInterval = null;
            // }

            objTopo.vars.svgGroup.selectAll("g.node.point").style("display", "block");
            objTopo.vars.svgGroup.selectAll("g.shape image").style("display", "block");
            objTopo.vars.svgGroup.selectAll('circle.splinePoints').style("display", "block");

            // objTopo.vars.svgGroup.selectAll("rect.clockselection").style("display", "block").classed("clockactive", true);
            // objTopo.vars.svgGroup.selectAll("image.flow").style("display", "none");
            // objTopo.vars.svg.select(".svgGroup").selectAll("image.flow").remove();

            $('.slideThree').find("input:checkbox").prop('checked', true);
            $('.slideThree').css("background","#e0e0e0");
            $('.slideThree label').css({"background":"url(../../img/Btn/IconBtn-WidgetSetting.svg)", 'background-color' : '#fbac2d', 'background-size' : 'contain','background-repeat' : 'no-repeat', 'background-position':'center center'});

            $('.modeSlide').css("background","#f0ad1f");
            $('.modeSlide #topoMapMode').css("color","#000").css("left","0");
            $('.modeSlide label').css({"background":"url(../../img/Btn/mode02.svg)", 'background-color' : '#fff', 'background-repeat' : 'no-repeat', 'background-position':'center center'});

            $('.viewNav').css("display","none");
            $('.manageNav').css("display","block");

            objTopo.clearTimer();
            TopoLink.stopOffset();
            TopoGridLine.refresh(objTopo);
        }
        objTopo.setTopoMapMode(objTopo);
        objTopo.activeRelease();
    },

    /* 아이템 선택 class 해제 */
    activeRelease: function () {
        // var objTopo = this;
        if (objTopo.vars.mapMode == TopoConst.mapMode.SEARCH) {

            objTopo.vars.svg.selectAll('path.helpline').classed("helplineSelected", false);
            objTopo.vars.svg.selectAll("g.node rect.nodeactive").classed("nodeactive", false);
            objTopo.vars.svg.selectAll("g.shape").classed("shapeactive", false).selectAll("rect.shapeselection").style("display", "none");
            objTopo.vars.svg.select("g.grp_object").selectAll("g.shape").selectAll("rect.drawselection").style("display", "none");

            objTopo.vars.svg.select(".svgGroup").selectAll(".rotator").style("display", "none");
            objTopo.vars.svg.select(".svgGroup").select("rect#clockSelect").classed("clockactive", false).style("display", "none");
            objTopo.vars.svg.select(".svgGroup").selectAll('circle.splinePoints').classed("splinePointSelected", false).style("display", "none");

            objTopo.vars.svg.select(".svgGroup").selectAll('path.spline').attr("marker-start", function(d){
                return JSON.parse(d.splineConf).startMarker != 'none' ? 'url(#marker_s_' + JSON.parse(d.splineConf).startMarker + '_' + d.splineNo  + ')' : '';
            });
            objTopo.vars.svg.select(".svgGroup").selectAll('path.spline').attr("marker-end", function(d){
                return JSON.parse(d.splineConf).endMarker != 'none' ? 'url(#marker_e_' + JSON.parse(d.splineConf).endMarker + '_' + d.splineNo  + ')' : '';
            });
            objTopo.vars.svgGroup.selectAll("circle.evtBubble").style("display", "block");
            objTopo.vars.svgGroup.selectAll(".grp_helpline").style("display", "none");

        } else {
            if (objTopo.vars.svg.selectAll("g.shape.shapeactive").data().length == 0) {
                objTopo.vars.svg.select(".svgGroup").selectAll(".rotator").style("display", "block");
            } else {
                objTopo.vars.svg.select(".svgGroup").selectAll(".rotator").style("display", "none");
            }

            objTopo.vars.svg.select(".svgGroup").selectAll('path.spline').attr("marker-start", null);
            objTopo.vars.svg.select(".svgGroup").selectAll('path.spline').attr("marker-end", null);
            objTopo.vars.svgGroup.selectAll("circle.evtBubble").style("display", "none");
            // objTopo.vars.svg.select(".svgGroup").selectAll("g.linkLabel_g").style("display", "none");
        }

        objTopo.vars.svg.select(".grp_object").selectAll("g.node").attr("cursor", objTopo.isManageMode(objTopo) ? "pointer" : "default");
        objTopo.vars.svg.select(".svgGroup").selectAll("g.shape").attr("cursor", objTopo.isManageMode(objTopo) ? "pointer" : "default");
        objTopo.vars.svg.select(".svgGroup").selectAll(".rotator").attr("cursor", objTopo.isManageMode(objTopo) ? "pointer" : "default");
        objTopo.vars.svg.select(".svgGroup").selectAll("path.link").attr("cursor", objTopo.isManageMode(objTopo) ? "pointer" : "default");
        objTopo.vars.svg.select(".svgGroup").selectAll('path.spline').attr("cursor", objTopo.isManageMode(objTopo) ? "pointer" : "default");
        objTopo.vars.svg.select(".svgGroup").selectAll('circle.splinePoints').attr("cursor", objTopo.isManageMode(objTopo) ? "pointer" : "default");
        objTopo.vars.svg.select(".svgGroup").select("g.grp_clock").attr("cursor", objTopo.isManageMode(objTopo) ? "pointer" : "default");
        objTopo.vars.svg.select("g.grp_object").selectAll("g.linkLabel").selectAll("text").attr("cursor", objTopo.isManageMode(objTopo) ? "pointer" : "default");

    },

    resizeSelection: function () {
        // var objTopo = this;
        _selectionShapes = objTopo.vars.svg.selectAll("rect.shapeselection").data();
        $.each(_selectionShapes, function (i,node) {
            if(node.devKind1 == 'DRAW_TEXT' || node.devKind1 == 'DRAW_TEXT_AREA') {
                d3.select("g#" + node.id).select("rect.shapeselection")
                    .attr("width", function(d) {
                        return d.bbox.width;
                    })
                    .attr("height", function(d) {
                        return d.bbox.height;
                    })
                    .attr("x", function(d) { return d.bbox.x; }).attr("y", function(d) { return d.bbox.y; })
            }
        });

    },


    selectObjectSet: function (selectObj) {
        if (selectObj === 'menu') {
            // 장비(그룹) 아이콘 선택 해제
            d3.selectAll("g.node rect.nodeactive").classed("nodeactive", false);
            // clock active 해제
            objTopo.vars.svgGroup.select("rect#clockSelect").classed("clockactive", false).style("display", "none");
            // help line 해제
            objTopo.vars.svg.selectAll('path.helpline').classed("helplineSelected", false);
            // findMark 해제
            objTopo.vars.svg.select("g.grp_object").selectAll('.imgFindMark').style("display", "none");
            // shape 해제
            objTopo.vars.svg.select("g.grp_object").selectAll("g.shape").classed("shapeactive", false).selectAll("rect.shapeselection").style("display", "none");
            objTopo.vars.svg.select("g.grp_object").selectAll("g.shape").selectAll("rect.drawselection").style("display", "none");
            // splinePoint 해제
            objTopo.vars.svg.select(".svgGroup").selectAll('circle.splinePoints').classed("splinePointSelected", false);
            // linkLabel 해제
            objTopo.vars.svg.select("g.grp_object").selectAll("g.linkLabel").selectAll("text").classed("linkTextSelected", false);
            /* Ctrl 키 관련 배열 변수 초기화*/
            objTopo.vars.selectItemNode = [];
            // objTopo.vars.selectPathLink = [];
            objTopo.vars.selectLinkLabel = [];
        }
        else if (selectObj === 'item') {
            // 장비(그룹) 아이콘 선택 해제
            // d3.selectAll("g.node rect.nodeactive").classed("nodeactive", false);
            // clock active 해제
            objTopo.vars.svgGroup.select("rect#clockSelect").classed("clockactive", false).style("display", "none");
            // help line 해제
            objTopo.vars.svg.selectAll('path.helpline').classed("helplineSelected", false);
            // findMark 해제
            objTopo.vars.svg.select("g.grp_object").selectAll('.imgFindMark').style("display", "none");
            // shape 해제
            objTopo.vars.svg.select("g.grp_object").selectAll("g.shape").classed("shapeactive", false).selectAll("rect.shapeselection").style("display", "none");
            objTopo.vars.svg.select("g.grp_object").selectAll("g.shape").selectAll("rect.drawselection").style("display", "none");
            // splinePoint 해제
            objTopo.vars.svg.select(".svgGroup").selectAll('circle.splinePoints').classed("splinePointSelected", false);
            // linkLabel 해제
            objTopo.vars.svg.select("g.grp_object").selectAll("g.linkLabel").selectAll("text").classed("linkTextSelected", false);
            // path 선택 해제
            objTopo.vars.svg.select("g.grp_object").selectAll("path.link").style("stroke-width", function (d) {
                return d.lineSize;
            });
            /* Ctrl 키 관련 배열 변수 초기화*/
            // objTopo.vars.selectItemNode = [];
            objTopo.vars.selectPathLink = [];
            objTopo.vars.selectLinkLabel = [];
        }
        else if (selectObj === 'link') {
            // 장비(그룹) 아이콘 선택 해제
            d3.selectAll("g.node rect.nodeactive").classed("nodeactive", false);
            // clock active 해제
            objTopo.vars.svgGroup.select("rect#clockSelect").classed("clockactive", false).style("display", "none");
            // help line 해제
            objTopo.vars.svg.selectAll('path.helpline').classed("helplineSelected", false);
            // findMark 해제
            objTopo.vars.svg.select("g.grp_object").selectAll('.imgFindMark').style("display", "none");
            // shape 해제
            objTopo.vars.svg.selectAll("g.shape").classed("shapeactive", false).selectAll("rect.shapeselection").style("display", "none");
            // splinePoint 해제
            objTopo.vars.svg.select(".svgGroup").selectAll('circle.splinePoints').classed("splinePointSelected", false);
            // linkLabel 해제
            objTopo.vars.svg.select("g.grp_object").selectAll("g.linkLabel").selectAll("text").classed("linkTextSelected", false);
            /* Ctrl 키 관련 배열 변수 초기화*/
            objTopo.vars.selectItemNode = [];
            // objTopo.vars.selectPathLink = [];
            objTopo.vars.selectLinkLabel = [];
        }
        else if (selectObj === 'shape') {
            // 장비(그룹) 아이콘 선택 해제
            d3.selectAll("g.node rect.nodeactive").classed("nodeactive", false);
            // clock active 해제
            objTopo.vars.svgGroup.select("rect#clockSelect").classed("clockactive", false).style("display", "none");
            // help line 해제
            objTopo.vars.svg.selectAll('path.helpline').classed("helplineSelected", false);
            // findMark 해제
            objTopo.vars.svg.select("g.grp_object").selectAll('.imgFindMark').style("display", "none");
            //rotator 해제
            objTopo.vars.svg.select(".svgGroup").selectAll(".rotator").style("display", "none");
            // shape 해제
            // objTopo.vars.svg.selectAll("g.shape").classed("shapeactive", false).selectAll("rect.shapeselection").style("display", "none");
            // splinePoint 해제
            objTopo.vars.svg.select(".svgGroup").selectAll('circle.splinePoints').classed("splinePointSelected", false);
            // linkLabel 해제
            objTopo.vars.svg.select("g.grp_object").selectAll("g.linkLabel").selectAll("text").classed("linkTextSelected", false);
            /* Ctrl 키 관련 배열 변수 초기화*/
            objTopo.vars.selectItemNode = [];
            objTopo.vars.selectPathLink = [];
            objTopo.vars.selectLinkLabel = [];

        }
        else if (selectObj === 'spline') {
            // 장비(그룹) 아이콘 선택 해제
            d3.selectAll("g.node rect.nodeactive").classed("nodeactive", false);
            // clock active 해제
            objTopo.vars.svgGroup.select("rect#clockSelect").classed("clockactive", false).style("display", "none");
            // help line 해제
            objTopo.vars.svg.selectAll('path.helpline').classed("helplineSelected", false);
            // findMark 해제
            objTopo.vars.svg.select("g.grp_object").selectAll('.imgFindMark').style("display", "none");
            // shape 해제
            objTopo.vars.svg.selectAll("g.shape").classed("shapeactive", false).selectAll("rect.shapeselection").style("display", "none");
            // splinePoint 해제
            objTopo.vars.svg.select(".svgGroup").selectAll('circle.splinePoints').classed("splinePointSelected", false);
            // linkLabel 해제
            objTopo.vars.svg.select("g.grp_object").selectAll("g.linkLabel").selectAll("text").classed("linkTextSelected", false);
            /* Ctrl 키 관련 배열 변수 초기화*/
            objTopo.vars.selectItemNode = [];
            objTopo.vars.selectPathLink = [];
            objTopo.vars.selectLinkLabel = [];
        }
        else if (selectObj === 'splinePoints') {
            // 장비(그룹) 아이콘 선택 해제
            d3.selectAll("g.node rect.nodeactive").classed("nodeactive", false);
            // clock active 해제
            objTopo.vars.svgGroup.select("rect#clockSelect").classed("clockactive", false).style("display", "none");
            // help line 해제
            objTopo.vars.svg.selectAll('path.helpline').classed("helplineSelected", false);
            // findMark 해제
            objTopo.vars.svg.select("g.grp_object").selectAll('.imgFindMark').style("display", "none");
            // shape 해제
            objTopo.vars.svg.selectAll("g.shape").classed("shapeactive", false).selectAll("rect.shapeselection").style("display", "none");
            // splinePoint 해제
            objTopo.vars.svg.select(".svgGroup").selectAll('circle.splinePoints').classed("splinePointSelected", false);
            // linkLabel 해제
            objTopo.vars.svg.select("g.grp_object").selectAll("g.linkLabel").selectAll("text").classed("linkTextSelected", false);
            /* Ctrl 키 관련 배열 변수 초기화*/
            objTopo.vars.selectItemNode = [];
            objTopo.vars.selectPathLink = [];
            objTopo.vars.selectLinkLabel = [];

        }
        else if (selectObj === 'grp_clock') {

            // 장비(그룹) 아이콘 선택 해제
            d3.selectAll("g.node rect.nodeactive").classed("nodeactive", false);
            // clock active 해제
            // objTopo.vars.svgGroup.select("rect#clockSelect").classed("clockactive", false).style("display", "none");
            // help line 해제
            objTopo.vars.svg.selectAll('path.helpline').classed("helplineSelected", false);
            // findMark 해제
            objTopo.vars.svg.select("g.grp_object").selectAll('.imgFindMark').style("display", "none");
            // shape 해제
            objTopo.vars.svg.selectAll("g.shape").classed("shapeactive", false).selectAll("rect.shapeselection").style("display", "none");
            // splinePoint 해제
            objTopo.vars.svg.select(".svgGroup").selectAll('circle.splinePoints').classed("splinePointSelected", false);
            // linkLabel 해제
            objTopo.vars.svg.select("g.grp_object").selectAll("g.linkLabel").selectAll("text").classed("linkTextSelected", false);
            /* Ctrl 키 관련 배열 변수 초기화*/
            objTopo.vars.selectItemNode = [];
            objTopo.vars.selectPathLink = [];
            objTopo.vars.selectLinkLabel = [];

        }
        else if (selectObj === 'linkLabel') {

            // 장비(그룹) 아이콘 선택 해제
            d3.selectAll("g.node rect.nodeactive").classed("nodeactive", false);
            // clock active 해제
            objTopo.vars.svgGroup.select("rect#clockSelect").classed("clockactive", false).style("display", "none");
            // help line 해제
            objTopo.vars.svg.selectAll('path.helpline').classed("helplineSelected", false);
            // findMark 해제
            objTopo.vars.svg.select("g.grp_object").selectAll('.imgFindMark').style("display", "none");
            // shape 해제
            objTopo.vars.svg.selectAll("g.shape").classed("shapeactive", false).selectAll("rect.shapeselection").style("display", "none");
            // splinePoint 해제
            objTopo.vars.svg.select(".svgGroup").selectAll('circle.splinePoints').classed("splinePointSelected", false);
            // linkLabel 해제
            objTopo.vars.svg.select("g.grp_object").selectAll("g.linkLabel").selectAll("text").classed("linkTextSelected", false);
            /* Ctrl 키 관련 배열 변수 초기화*/
            objTopo.vars.selectItemNode = [];
            objTopo.vars.selectPathLink = [];
            objTopo.vars.selectLinkLabel = [];

        }
    },

    clearObject: function (objTopo) {

        if (objTopo.vars.svgGroup.select("g.grp_object").selectAll(objTopo.vars.flowIconStr).data().length > 0) {
            objTopo.vars.svgGroup.select("g.grp_object").selectAll(objTopo.vars.flowIconStr).interrupt();
            objTopo.vars.svgGroup.select("g.grp_object").selectAll(objTopo.vars.flowIconStr).remove();
            // TopoFlow.callRefresh(objTopo);
        }

        if (objTopo.vars.svgGroup.select("g.grp_object").selectAll("circle.flow").data().length > 0) {
            objTopo.vars.svgGroup.select("g.grp_object").selectAll("circle.flow").interrupt();
            objTopo.vars.svgGroup.select("g.grp_object").selectAll("circle.flow").remove();
        }
    },

    setMenuBarIcon : function () {
        objTopo.vars.isSoundOnOff = TopoConst.envSetting.alarmChk == 1 ? true : false;
        if (objTopo.vars.isSoundOnOff) {
            /* sound ON */
            //$(".soundOnOff").children("img").attr("src", '../../img/d3/menu/navi/topoNav32.svg')
            $("#SoundBtn").attr("class", "SoundBtnOff SoundBtnOn");
        }
        else {
            /* sound Off */
            //$(".soundOnOff").children("img").attr("src", '../../img/d3/menu/navi/topoNav31.svg')
            $("#SoundBtn").attr("class", "SoundBtnOff");
        }
    },

    playSound: function (objTopo) {
        lvAlarms = [-1, false, false, false, false, false]; //미사용,lv1,lv2,lv3,lv4,lv5
        $.each(objTopo.vars.nodes, function (index, value) {
            if (value.evtLevel >= 2) {
                lvAlarms[value.evtLevel - 1] = true;
            }
        });

        if (objTopo.vars.mapMode == TopoConst.mapMode.SEARCH && objTopo.vars.isSoundOnOff && TopoConst.envSetting.alarmChk) {
            if (lvAlarms[5]) {
                if (TopoConst.envSetting.alarmLv5Chk) indexPlay(5);
            }
            else if (lvAlarms[4]) {
                if (TopoConst.envSetting.alarmLv4Chk) indexPlay(4);
            }
            else if (lvAlarms[3]) {
                if (TopoConst.envSetting.alarmLv3Chk) indexPlay(3);
            }
            else if (lvAlarms[2]) {
                if (TopoConst.envSetting.alarmLv2Chk) indexPlay(2);
            }
            else if (lvAlarms[1]) {
                if (TopoConst.envSetting.alarmLv1Chk) indexPlay(1);
            }
        }

        function setAudioRepeat(lvl) {
            if(audioInterval == null) {
                audioInterval = setInterval(function() {
                    if (TopoConst.envSetting.isAudioRepeat &&
                        objTopo.vars.mapMode == TopoConst.mapMode.SEARCH &&
                        objTopo.vars.isSoundOnOff &&
                        TopoConst.envSetting.alarmChk) indexPlay(lvl);
                },2999)
            }
        }

        function indexPlay(lvl) {
            if (TopoConst.envSetting.isAudioRepeat) {
                setAudioRepeat(lvl);
            }
            // var audio = null;
            if ((TopoConst.envSetting["alarmLv{0}Path".substitute(lvl)] || 'default.mp3') == 'default.mp3') {
                if (!D3Topology.audio) D3Topology.audio = null;
                D3Topology.audio = new Audio(TopoConst.envSetting.soundFilePath + 'default.mp3');
                // D3Topology.audio= new Audio('/audio/default.mp3');
                // audio = new Audio('/audio/default.mp3');
            }
            else {
                if(lvl) {
                    if (!D3Topology.audio) D3Topology.audio = null;
                    D3Topology.audio = new Audio(TopoConst.envSetting.soundFilePath + TopoConst.envSetting["alarmLv{0}Path".substitute(lvl)]);
                }
                // D3Topology.audio= new Audio('/audio/{0}_{1}.mp3'.substitute($('#sUserId').val(), lvl));
                // audio = new Audio('/audio/{0}_{1}.mp3'.substitute($('#sUserId').val(), lvl));
            }
            D3Topology.audio.play();
            // audio.play();
        }
    },

    clearAudioInterval: function () {
        if(audioInterval != null) {
            if (objTopo.audio) {
                objTopo.audio.pause();
                objTopo.audio.currentTime = 0;
            }
            clearInterval(audioInterval);
            audioInterval = null;
        }
    },

    isManageMode: function(objTopo) {
        return objTopo.vars.mapMode == TopoConst.mapMode.MANAGE;
    },

    checkAlignEdit: function (actionName) {
        var fIdx = -1;
        $(".d3-context-menu").css('display','none');
        if (actionName) {
            fIdx = topo_menu.checkActionList.findIndex(e => e.action === actionName);
        }
        if ( (fIdx !== -1 && objTopo.vars.isMove) || (objTopo.vars.isMove && objTopo.vars.isModeChg)) {
            setTimeout(function () {
                if (!confirm('저장되지 않은 맵 정보가 있습니다.\n(취소 시 변경 맵 정보는 저장되지 않습니다.)\n저장 하시겠습니까?'))
                    return false;
                topo_menu_action.save_map(null, "checkMap", null, objTopo);
                return true;
            }, 80);
        }
        // else {
        //     objTopo.modeConditionSet(objTopo);
        // }

    }

};

