import WidgetItemCOM from './widget.item.com';
import WidgetItemNMS from './widget.item.nms'
import WidgetItemSMS from './widget.item.sms'
import WidgetItemAP from './widget.item.ap'
import WidgetItemConfInfo from './widget.item.confInfo'

const Widget = {
    /*
    * type 및 items 의 value 중복불가
    * */

    type: {
      COM: {label: '공통', value: 'COM'},
      // OMS: {label: '운영', value: 'OMS'},
      NMS: {label: '네트워크', value: 'NMS'},
      SMS: {label: '서버', value: 'SMS'},
      AP: {label: 'AP', value: 'AP'},
      CONF_INFO: {label: '구성정보', value: 'CONF_INFO'},
    },

    /* items 추가시
     *  parentName: type 의 value 값 알맞게 매칭 하여야 계층 구조 생성
     *  value: item 의 object key 값과 일치 하게 생성.
     *  예) nmsCpuTopN: {label: 'cpu Top N', value:'networkCpuTopN'}  ->  X
     *  2024.03.05 conf 옵션 추가 : 개별 설정팝업을 분류하는 값. topn-> limit 입력하는 팝업. Traffic -> i/o dropdownlist 팝업
     * */
    items: {
      //COM
      comTopo: {parentName: 'COM', label: '토폴로지', value:'comTopo', url: '' , icon: 'topo', conf: 'Grp'},
      comErrStatus: {parentName: 'COM', label: '장애현황', value:'comErrStatus', url: '/api/com/getEvtStatus', icon: 'err', conf: 'Default'},

      //NMS
      nmsCpuTopN: {parentName: 'NMS', label: 'CPU TopN', value:'nmsCpuTopN', url: '/api/nms/getHighPerfByDev', icon: 'cpu', conf: 'Topn'},
      nmsMemTopN: {parentName: 'NMS', label: 'Memory TopN', value:'nmsMemTopN', url: '/api/nms/getHighPerfByDev', icon: 'mem', conf: 'Topn'},
      nmsTempTopN: {parentName: 'NMS', label: '온도 TopN', value:'nmsTempTopN', url: '/api/nms/getHighPerfByDev', icon: 'temp', conf: 'Topn'},
      nmsResTopN: {parentName: 'NMS', label: '응답시간 TopN', value:'nmsResTopN', url: '/api/nms/getHighPerfByDev', icon: 'restime', conf: 'Topn'},
      nmsSessionTopN: {parentName: 'NMS', label: '세션 TopN', value:'nmsSessionTopN', url: '/api/nms/getHighPerfByDev', icon: 'session', conf: 'Topn'},
      nmsTrafficTopN: {parentName: 'NMS', label: 'Traffic TopN', value:'nmsTrafficTopN', url: '/api/nms/getHighTrafficByDev', icon: 'traffic', conf: 'Traffic'},
      nmsDevPerfStatus: {parentName: 'NMS', label: '장비 성능 현황', value:'nmsDevPerfStatus', url: '/api/nms/getDevPerfChart', icon: 'cpu', conf: 'Dev'},
      nmsIfPerfStatus: {parentName: 'NMS', label: '회선 성능 현황', value:'nmsIfPerfStatus', url: '/api/nms/getIfPerfChart', icon: 'cpu', conf: 'If'},
      // nmsCpuCompare: {parentName: 'NMS', label: 'Cpu 성능비교', value:'nmsCpuCompare', url: 'api/getCpuPerf', icon: 'area'},

      //SMS
      smsCpuTopN: {parentName: 'SMS', label: 'CPU TopN', value:'smsCpuTopN', url: '/api/sms/getHighCpuBySvr', icon: 'cpu',conf: 'Topn'},
      smsMemTopN: {parentName: 'SMS', label: 'Memory TopN', value:'smsMemTopN', url: '/api/sms/getHighMemoryBySvr', icon: 'mem' ,conf: 'Topn'},
      smsFilesystemTopN: {parentName: 'SMS', label: '파일시스템 사용율 TopN', value:'smsFilesystemTopN', url: '/api/sms/getHighFilesystemBySvr', icon: 'session' ,conf: 'Topn'},
      smsTrafficTopN: {parentName: 'SMS', label: 'Traffic TopN', value:'smsTrafficTopN', url: '/api/sms/getHighTrafficBySvr', icon: 'traffic' ,conf: 'Traffic'},
      smsProcessCpuTopN: {parentName: 'SMS', label: '프로세스 CPU TopN ', value:'smsProcessCpuTopN', url: '/api/sms/getHighCpuByProcess', icon: 'cpu' ,conf: 'Topn'},
      smsProcessMemTopN: {parentName: 'SMS', label: '프로세스 Memory TopN ', value:'smsProcessMemTopN', url: '/api/sms/getHighMemoryByProcess', icon: 'mem' ,conf: 'Topn'},
      smsMonitoringProcessCpuTopN: {parentName: 'SMS', label: '감시프로세스 CPU TopN ', value:'smsMonitoringProcessCpuTopN', url: '/api/sms/getHighCpuByMonitoringProcess', icon: 'cpu' ,conf: 'Topn'},
      smsMonitoringProcessMemTopN: {parentName: 'SMS', label: '감시프로세스 Memory TopN ', value:'smsMonitoringProcessMemTopN', url: '/api/sms/getHighMemoryByMonitoringProcess', icon: 'mem' ,conf: 'Topn'},

      //AP
      apStatus: {parentName: 'AP', label: '접속수량(Device,Client)', value:'apStatus', url: '/api/ap/getApStatus', icon: 'err', conf: 'ApCnt'},
      apEvtTimeTopByAp: {parentName: 'AP', label: 'AP별 장애시간 TopN', value:'apEvtTimeTopByAp', url: '/api/ap/getEvtTimeTopByAp', icon: 'restime', conf: 'Topn'},
      apClientAnalysis: {parentName: 'AP', label: '전체 클라이언트 추이', value:'apClientAnalysis', url: '/api/ap/getClientAnalysis', icon: 'session', conf: 'Default'},
      apMaxCCUByTime: {parentName: 'AP', label: '시간대별 최대 동접자', value:'apMaxCCUByTime', url: '/api/ap/getMaxCCUByTime', icon: 'session', conf: 'Default'},
      apTrafficAnalysis: {parentName: 'AP', label: '트래픽 사용량 추이', value:'apTrafficAnalysis', url: '/api/ap/getTrafficAnalysis', icon: 'traffic', conf: 'Default'},
      apMaxTrafficByTime: {parentName: 'AP', label: '시간대별 최대 트래픽', value:'apMaxTrafficByTime', url: '/api/ap/getMaxTrafficByTime', icon: 'traffic', conf: 'Default'},
      apHighTrafficByClient: {parentName: 'AP', label: '클라이언트별 트래픽 사용량 TopN', value:'apHighTrafficByClient', url: '/api/ap/getHighTrafficByClient', icon: 'traffic', conf: 'Default'},
      apHighTrafficByAp: {parentName: 'AP', label: 'AP별 트래픽 사용량 TopN', value:'apHighTrafficByAp', url: '/api/ap/getHighTrafficByAp', icon: 'traffic',conf: 'Topn'},
      apLowTrafficByAp: {parentName: 'AP', label: 'AP별 트래픽 사용량 LowN', value:'apLowTrafficByAp', url: '/api/ap/getLowTrafficByAp', icon: 'traffic',conf: 'Lown'},
      apHighClientByAp: {parentName: 'AP', label: 'AP별 클라이언트 TopN', value:'apHighClientByAp', url: '/api/ap/getHighClientByAp', icon: 'session',conf: 'Topn'},
      apLowClientByAp: {parentName: 'AP', label: 'AP별 클라이언트 LowN', value:'apLowClientByAp', url: '/api/ap/getLowClientByAp', icon: 'session',conf: 'Lown'},
      apClientStateByOs: {parentName: 'AP', label: 'OS별 클라이언트 접속 현황', value:'apClientStateByOs', url: '/api/ap/getClientStateByOs', icon: 'session',conf: 'Topn'},
      apTrafficStateByOs: {parentName: 'AP', label: 'OS별 트래픽 사용 현황', value:'apTrafficStateByOs', url: '/api/ap/getTrafficStateByOs', icon: 'traffic',conf: 'Topn'},

      //구성정보 - confinfo.js 에 개별적으로 선언된 url 사용
      confInfo: {parentName: 'CONF_INFO', label: '구성정보현황', value:'confInfo', url:'/api/conf-info/item', icon: 'session', conf: 'Info', titleIcon: 'Tool'},
    },

    display: {
      Grid:             {label: '그리드', value: 'Grid'},
      BarChart:         {label: 'Bar차트', value: 'BarChart'},
      BarStackChart:    {label: 'BarStack차트', value: 'BarStackChart'},
      BarNegativeChart: {label: 'BarNegative차트', value: 'BarNegativeChart'},
      ColumnChart:      {label: 'Column차트', value: 'ColumnChart'},
      ColumnStackChart: {label: 'ColumnStack차트', value: 'ColumnStackChart'},
      LineChart:        {label: 'Line차트', value: 'LineChart'},
      AreaChart:        {label: 'Area차트', value: 'AreaChart'},
      PieChart:         {label: 'Pie차트', value: 'PieChart'},
      PieDonutChart:    {label: 'PieDonut차트', value: 'PieDonutChart'},
    },

    itemInfo: {
      ...WidgetItemCOM,
      ...WidgetItemNMS,
      ...WidgetItemSMS,
      ...WidgetItemAP,
      ...WidgetItemConfInfo,
    },

    getTree: function() {
      const treeType = Widget.type;
      const treeItems = Widget.items;

      const treeTypeData = [];
      const treeItemsData = [];
      const returnTreeData = [];

      for(let i in treeType){
        //iconName += treeType[i].value.toLowerCase()+'.png'; //기존 대분류별 서로 다른 아이콘들
        // let iconName = '../../../static/img/tree/folder.svg'; //폴더형
        let iconName = '../../../static/img/tree/mono-folder.svg'; //폴더형
        iconName +=
        treeTypeData.push({
                valueName: treeType[i].value,
                displayName: treeType[i].label,
                icon: iconName
        });

        for(let j in treeItems){
          if(treeType[i].value == treeItems[j].parentName){
            let iconName = treeItems[j].icon + '.svg';
            treeItemsData.push({
              valueName: treeItems[j].value,
              displayName: treeItems[j].label,
              icon: '../../../static/img/tree/mono-'+ iconName,
              parentName: treeItems[j].parentName
            })
          }
        }
      }
      returnTreeData.push(...treeTypeData, ...treeItemsData);
      return returnTreeData;
    }
}

export default Widget;
