import { ChartFn, GridFn } from './widget.tooltip.js';
const WidgetItemCOM = {
  comTopo:{
    Topology: {
      params: {
        topoGrpNo: 1
      }
    }
  },
  /* TODO 이슈
   * 이벤트명과 장애대상 모두 표시할 경우 이슈 없음
   * but 이벤트명만 표시할 경우, minwidth 가 적용되지 않아 이슈이고
   * 이벤트명에 minwidth 같이 추가할 경우 장애대상과 이벤트명이 동일한 width를 가지게 되어 장애대상 영역 좁음
   * -> 현재는 사이트마다 커스텀 처리해서 나가야 할 듯함
   */
  comErrStatus: {
    Grid: {
      options: {
        columns: [
          {text: '장애등급', datafield: 'evtLevelStr', displayfield:'evtLevelStr', width: 100, type: 'string', cellsrenderer: GridFn.evtLevelRenderer},
          {text: '발생일시', datafield: 'ymdhms', width: 180, cellsalign: 'center', type: 'string'},
          {text: '장애대상', datafield : 'srcInfo', cellsalign : 'left', minwidth: 180},
          {text: '이벤트명', datafield: 'evtName', width: 200, type: 'string'},
          {text: '지속시간', datafield : 'sumSec', cellsalign : 'center', cellsrenderer : GridFn.cTimerenderer, width: 180 },
          {text: '장비종류', datafield: 'srcTypeStr', width: 100, cellsalign: 'center', type: 'string', hidden: true},
          {text: '장비명', datafield: 'disDevName', width: 180, cellsalign: 'center', type: 'string', hidden: true},
          {text: '회선명', datafield: 'ifName', width: 150, cellsalign: 'center', type: 'string', hidden: true},
          {text: '그룹명', datafield: 'grpName', width: 150, cellsalign: 'left', type: 'string', hidden: true},
          {text: '회선별칭', datafield: 'ifAlias', width: 150, cellsalign: 'center', type: 'string', hidden: true},
        ],
        // height: '200px'
        autoheight: false
      }
    },
    ErrCnt:{
      options: {

      },
      params: {
        selectType : 'count'
      }
    },
  }
}

export default WidgetItemCOM;
