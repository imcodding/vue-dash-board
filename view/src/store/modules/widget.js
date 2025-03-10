import axios from 'axios';
import HmUtil from '../../js/common/hm.util';
const widget = {
  namespaced: true,
  state: {
    //code10 기준 등록된 모든 등급 이벤트명, 이벤트색상, 이벤트코드 생성
    //예) evtInfo: {EVT_LEVEL_4: { "color": "#6fa8dc", "level": "1", "name": "비정보", "id": "EVT_LEVEL_1"}}
    evtInfo : {},
    isEvtAlarm : false,
    jqxMenuObj: {},
    ctrxMenuList: [],
    ctrxDefMenu: [{
      id: 'colMgmt',
      label: '컬럼관리'
    }],
    widgetBasicData: {}, //기본설정 정보 name,x,y 등의 테이블의 단일 구성 데이터
    widgetConfData: {} //conf 컬럼에 들어갈 json 형태의 복합 데이터
  },
  actions: {
    //단일 설정 값
    addWidgetBasicData(context, dataObj){
      for(let key of Object.keys(dataObj)){
        context.commit('setWidgetBasicData',  {dataKey: key, dataVal: dataObj[key]})
      }
    },

    //conf 설정 값
    addWidgetConfData(context, dataObj){
      for(let key of Object.keys(dataObj)){
        context.commit('setWidgetConfData',  {dataKey: key, dataVal: dataObj[key]})
      }
    },

    evtConf(context) {
      axios.get('/api/getEvtConf').then(res => {
        for (let evtConf of res) {
          context.commit('setEvtConf', evtConf)
        }
      })
    },

    /**
    * grid bindingcomplete
    * comErrStatus(장애현황) -> 사운드
    * 데이터 따른 autoheight 설정
    * row에 대한 제한이 없는 목록 형태의 그리드는 autoheight.false 값 부여
    * */
    callBindingcomplete(context, payload) {
      const widgetInfo = payload;

      widgetInfo.$refs[widgetInfo.id].onBindingcomplete = (event) => {
        const grid = widgetInfo.$refs[widgetInfo.id].$refs[widgetInfo.id];
        if(!grid) return;
        const gridData = grid.getrows();

        if (gridData.length > 0) { //bindingcomplete 중복 호출 이슈에 대한 임시 처리. 마지막 값이 실제 유효 값
          widgetInfo.$refs[widgetInfo.id].$refs[widgetInfo.id].autoheight = true;
          if(widgetInfo.id == 'comErrStatus'){
            context.commit('setEvtAlarm', true);
            widgetInfo.$refs[widgetInfo.id].$refs[widgetInfo.id].autoheight = false;
          }

        } else { //no data to display 표현 html 이슈로 인한 row 데이터 없는 경우 옵션 설정
          widgetInfo.$refs[widgetInfo.id].$refs[widgetInfo.id].autoheight = false;
        }
      }
    },

    //우클릭 jqxmenu 활성화
    callRowclick({dispatch}, payload) {
      const widgetInfo = payload;
      widgetInfo.$refs[widgetInfo.id].onRowclick = (event) => {
        if (event.args.rightclick) {
          const rowIndex = event.args.rowindex;
          const row = widgetInfo.$refs[widgetInfo.id].$refs[widgetInfo.id]
          if(!row) return;
          const rowData = row.getrowdata(rowIndex);
          const jqxMenuId = widgetInfo.id +'JqxMenu';
          widgetInfo.$refs[widgetInfo.id].$refs[widgetInfo.id].selectrow(rowIndex);
          dispatch('initCtrxMenu', {id: jqxMenuId, rowData: rowData})
        }
      }
    },
    //grid 생성 시 jqxmenu component 정보 생성. 위젯ID + 'JqxMenu'
    initJqxMenu(context, {id, jqxMenu}){
        context.commit('setJqxMenu', {id, jqxMenu})
    },

    //우클릭 row에 대한 알맞는 jqxmenu 생성
    initCtrxMenu(context, {id, rowData}){
      let ctrxParmas = {}

      let ctrxType = 'DEV';
      if(rowData.hasOwnProperty('devKind1')){ //일반 그리드
        ctrxType = rowData.devKind1
      }else if(rowData.hasOwnProperty('srcType')){ //이벤트 현황
        ctrxType = rowData.srcType
      }else{
        ctrxType = '';
        ctrxParmas.menuObj = {};
      }

      if(ctrxType == 'DEV'){ //장비,회선,서버 3개 일 경우만 기타 ap,rack 등 제외
        ctrxParmas.menuObj = {label: '장비상세',id: 'pDevDetail'};
        ctrxParmas.keyObj = {mngNo: rowData.mngNo};
      }else if(ctrxType == 'IF'){
        ctrxParmas.menuObj = {label: '회선상세',id: 'pDevDetail'};
        ctrxParmas.keyObj = {mngNo: rowData.mngNo,  ifIdx: rowData.srcIdx};
      }else if(ctrxType == 'SVR'){
        ctrxParmas.menuObj = {label: '서버상세',id: 'pSvrDetail'};
        ctrxParmas.keyObj = {mngNo: rowData.mngNo};
      }else{}

      context.commit('setCtrxMenu', {id: id, params: ctrxParmas});

    }
  },

  mutations: {
    setWidgetBasicData(state, {dataKey, dataVal}) {
      state.widgetBasicData[dataKey] = dataVal;
    },

    setWidgetConfData(state, {dataKey, dataVal}) {
      state.widgetConfData[dataKey] = dataVal;
    },

    //이벤트 관련 정보(색상,명칭,등급)
    setEvtConf(state, payload) {
      const evtId = HmUtil.convertToCamel(payload.id);
      state.evtInfo[evtId] = payload;
    },

    setEvtAlarm(state, payload) {
      state.isEvtAlarm = payload;
    },
    setJqxMenu(state, {id, jqxMenu}) {
      state.jqxMenuObj[id] = jqxMenu;
    },
    setCtrxMenu(state, {id, params}) {
      const rowCtrxMenu = [];
      rowCtrxMenu.push(params.menuObj);

      state.ctrxMenuList = [
        ...rowCtrxMenu,
        ...state.ctrxDefMenu
      ]
      state.jqxMenuObj[id].source = state.ctrxMenuList;
      state.jqxMenuObj[id].key = params.keyObj;
    }
  }
}

export default widget
