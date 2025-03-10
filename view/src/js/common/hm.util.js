import {GridFn} from './widget/widget.tooltip.js';
import { store } from '../../store/store'
var HmUtil = {
    /**
    * 종류별 우클릭 web 상세 팝업 호출
    * widgetId: 위젯+jqxMenu 고유 아이디
    * popupId callpopup 종류
    */
    ctrxPopup: function(widgetId, popupId,) {
      const targetJqxMenu = store.state.widget.jqxMenuObj[widgetId+'JqxMenu'];
      const popupKeys = targetJqxMenu.key; //mngNo, ifIdx 등 웹 전달 값(obj 형태)

      let urlPrefix = '/main/popup';
      switch(popupId) {
        case 'pDevDetail':
        case 'pIfDetail' :
          urlPrefix += '/nms/';
          break;
        case 'pSvrDetail' :
          urlPrefix += '/sms/';
          break;
      }

      var popupParams = {};

      for(let key of Object.keys(popupKeys)){
        popupParams[key] = popupKeys[key];
      }
      this.createWinPopup(urlPrefix + popupId + '.do', $('#hForm'), popupId, 1200, 760, popupParams);
    },

    ctrxChartPopup(chartData){
      let urlPrefix = '/main/popup';
      let devKind1 = chartData.devKind1;
      var popupParams = {};

      popupParams.mngNo = chartData.mngNo;
      switch (devKind1) {
        case 'DEV':
          urlPrefix += '/nms/pDevDetail';
          break;
        case 'IF' :
          urlPrefix += '/nms/pIfDetail';
          popupParams.ifIdx = chartData.ifIdx;
          break;
        case 'SVR' :
          urlPrefix += '/sms/pSvrDetail';
          break;
      }
      this.createWinPopup(urlPrefix + '.do', $('#hForm'), urlPrefix, 1200, 760, popupParams);
    },
    //이벤트 배경 색상에 대한 폰트 색
    getTextColorByBackgroundColor: function (hexColor) {
        const c = hexColor.substring(1);                    // 색상 앞의 # 제거    
        const rgb = parseInt(c, 16);                  // rrggbb를 10진수로 변환    
        const r = (rgb >> 16) & 0xff;                       // red 추출    
        const g = (rgb >> 8) & 0xff;                        // green 추출    
        const b = (rgb >> 0) & 0xff;                        // blue 추출     
        const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;  // per ITU-R BT.709     // 색상 선택    
        return luma < 127.5 ? "white" : "black";
    },
    convertToCamel(str){
          return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
      },
    //chart plotOptions series animation random value
    easeOutBounce:function(pos){
      if ((pos) < (1 / 2.75)) {
        return (7.5625 * pos * pos);
      }
      if (pos < (2 / 2.75)) {
        return (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75);
      }
      if (pos < (2.5 / 2.75)) {
        return (7.5625 * (pos -= (2.25 / 2.75)) * pos + 0.9375);
      }
      return (7.5625 * (pos -= (2.625 / 2.75)) * pos + 0.984375);
    },

    xAxisFixedLabel: function(){
      var maxLength = 12; // 표시할 최대 글자 수
      var label = this.value;

      // 긴 텍스트를 자를 경우
      if (label.length > maxLength) {
        label = label.substring(0, maxLength) + '...';
      }

      // 짧은 텍스트의 너비를 조정할 경우
      if (label.length < maxLength) {
        var diff = maxLength - label.length;
        var spaces = '';
        for (var i = 0; i < diff + 1; i++) {
          spaces += '&nbsp;';
        }
        label = label + spaces;
      }

      //todo 추후 설정 및 옵션 처리시 store 변수 등 사용하여 영역 고정 또는 텍스트 길이 만큼 표현 필요(width 값 제거 또는 label만 return)
      return '<div style="width: 100px; overflow: hidden;" >' + label + '</div>';
    },
    convertUnit1000: function (value) {

        var retnVal = '';
        var result = '';

        if (value >= 0) {
            if (value >= Math.pow(1000, 4)) {
                result = Math.round((value / Math.pow(1000, 4)) * 100);
                retnVal += (result / 100) + " T";
            }
            else if (value >= Math.pow(1000, 3)) {
                result = Math.round((value / Math.pow(1000, 3)) * 100);
                retnVal += (result / 100) + " G";
            }
            else if (value >= Math.pow(1000, 2)) {
                result = Math.round((value / Math.pow(1000, 2)) * 100);
                retnVal += (result / 100) + " M";
            }
            else if (value >= Math.pow(1000, 1)) {
                result = Math.round((value / Math.pow(1000, 1)) * 100);
                retnVal += (result / 100) + " K";
            }
            else {
                result = Math.round(value * 100);
                retnVal += (result / 100) + "";
            }
        } else {
            value = -value;
            if (value >= Math.pow(1000, 4)) {
                result = Math.round((value / Math.pow(1000, 4)) * 100);
                retnVal += "- " + (result / 100) + " T";
            }
            else if (value >= Math.pow(1000, 3)) {
                result = Math.round((value / Math.pow(1000, 3)) * 100);
                retnVal += "- " + (result / 100) + " G";
            }
            else if (value >= Math.pow(1000, 2)) {
                result = Math.round((value / Math.pow(1000, 2)) * 100);
                retnVal += "- " + (result / 100) + " M";
            }
            else if (value >= Math.pow(1000, 1)) {
                result = Math.round((value / Math.pow(1000, 1)) * 100);
                retnVal += "- " + (result / 100) + " K";
            }
            else {
                result = Math.round(value * 100);
                retnVal += "- " + (result / 100) + "";
            }
        }
        return retnVal;
    },

    convertUnit1024: function (value) {
      var retnVal = '';
      var result = '';
      if (value >= 0) {
        if (value >= Math.pow(1024, 4)) {
          result = Math.round((value / Math.pow(1024, 4)) * 100);
          retnVal += (result / 100) + " T";
        }
        else if (value >= Math.pow(1024, 3)) {
          result = Math.round((value / Math.pow(1024, 3)) * 100);
          retnVal += (result / 100) + " G";
        }
        else if (value >= Math.pow(1024, 2)) {
          result = Math.round((value / Math.pow(1024, 2)) * 100);
          retnVal += (result / 100) + " M";
        }
        else if (value >= Math.pow(1024, 1)) {
          result = Math.round((value / Math.pow(1024, 1)) * 100);
          retnVal += (result / 100) + " K";
        }
        else {
          result = Math.round(value * 100);
          retnVal += (result / 100) + " B";
        }
      }
      else {
        value = -value;
        if (value >= Math.pow(1024, 4)) {
          result = Math.round((value / Math.pow(1024, 4)) * 100);
          retnVal += "- " + (result / 100) + "T";
        }
        else if (value >= Math.pow(1024, 3)) {
          result = Math.round((value / Math.pow(1024, 3)) * 100);
          retnVal += "- " + (result / 100) + "G";
        }
        else if (value >= Math.pow(1024, 2)) {
          result = Math.round((value / Math.pow(1024, 2)) * 100);
          retnVal += "- " + (result / 100) + "M";
        }
        else if (value >= Math.pow(1024, 1)) {
          result = Math.round((value / Math.pow(1024, 1)) * 100);
          retnVal += "- " + (result / 100) + "K";
        }
        else {
          result = Math.round(value * 100);
          retnVal += "- " + (result / 100);
        }
      }
      return retnVal;
    },

    convertCTime: function (value) {
        // if(value === null) return '0초';
        var result = '';
        var time = value;
        var year, day, hour, min, result = '';
        if ((60 * 60 * 24 * 365) <= time) {
            year = Math.floor(time / (60 * 60 * 24 * 365));
            time = time - ((60 * 60 * 24 * 365) * year);
            result += year + '년 ';
        }
        if ((60 * 60 * 24) <= time) {
            day = Math.floor(time / (60 * 60 * 24));
            time = time - ((60 * 60 * 24) * day);
            result += day + '일 ';
        }
        if ((60 * 60) <= time) {
            hour = Math.floor(time / (60 * 60));
            time = time - ((60 * 60) * hour);
            result += hour + '시 ';
        }
        if (60 <= time) {
            min = Math.floor(time / 60);
            time = time - (60 * min);
            result += min + '분 ';
        }
        if (time != '' && time != 0) {
            // if (isNaN(time)) time = 0;
            if (time === null) time = 0;
            if (time < 0) time = 0;
          result += "<div style='margin-top: 6.5px; margin-right: 5px' class='jqx-right-align'>" + time + '초 </div>';
        } else {
            result += '0초';
        }
        return result;

    },

    /**
    * 동적컬럼 목록
    * param1: 위젯종류
    * param2: 상세지표
    * return list defOptions.columns add
    * */
    getColByType(type, kind) {
    let fixCol = [];
    let detailOption = {};
    switch(type) {
      case 'TRAFFIC':
        switch(kind) {
          case 'IO':
              fixCol = [
                {datafield : 'inbps', text : 'IN', width : '80', cellsrenderer: GridFn.unit1000renderer},
                {datafield : 'outbps', text : 'OUT', width : '80', cellsrenderer: GridFn.unit1000renderer}
              ];
              break;
            case 'IO_PER':
              fixCol = [
                {datafield : 'inbpsPer', text : 'IN', width : '80'},
                {datafield : 'outbpsPer', text : 'OUT', width : '80'}
              ];
              break;
            case 'SUM':
              fixCol = [
                {datafield : 'bps', text : 'BPS', width : '80', cellsrenderer: GridFn.unit1000renderer},
              ];
              break;
            case 'SUM_PER':
              fixCol = [
                {datafield : 'bpsPer', text : 'BPS', width : '80'},
              ];
              break;
            case 'IN':
              fixCol = [
                {datafield : 'inbps', text : 'IN', width : '80', cellsrenderer: GridFn.unit1000renderer}
              ];
              break;
            case 'OUT':
              fixCol = [
                {datafield : 'outbps', text : 'OUT', width : '80', cellsrenderer: GridFn.unit1000renderer}
              ];
              break;
            case 'IN_PER':
              fixCol = [
                {datafield : 'inbpsPer', text : 'IN', width : '80'}
              ];
              break;
            case 'OUT_PER':
              fixCol = [
                {datafield : 'outbpsPer', text : 'OUT', width : '80'}
              ];
              break;
            default :
              fixCol = [
                {datafield : 'inbps', text : 'IN', width : '80', cellsrenderer: GridFn.unit1000renderer}
              ];
              break;
        }
      break;
    }
    return fixCol;
  },
  createWinPopup: function (url, frm, popNm, popW, popH, params) {
    //engineer.do에 설정된 DB 데이터. (netis web 의 도메인 정보 마지막 값 / 생략 필요)
    const netisWebUrl = store.state.code.codeList.netisWebUrl.codeValue1;
    let popupUrl = netisWebUrl + url;

    frm.empty();
    if (params !== undefined) {
      $.each(params, function (key, value) {
        $('<input />', {type: 'hidden', id: key, name: key, value: value}).appendTo(frm);
      });
    }
    return this.showWinPopup(popupUrl, frm, popNm, popW, popH);
  },
  /**
   * 윈도우 팝업
   * @param {String} url
   * @param {ref} frm
   * @param {String} popNm
   * @param {Number} popW
   * @param {Number} popH
   * @param {JSON} params
   * @param {Function} callback
   * @returns
   */
  showWinPopup(url, frm, popNm, popW, popH, params, callback) {
    var host = location.hostname.replace(/\./g, '_');
    popNm = popNm + host;
    var opts = [];
    opts.push('width=' + popW);
    opts.push('height=' + popH);
    opts.push('left=' + parseInt((screen.availWidth / 2) - (popW / 2)));
    opts.push('top=' + parseInt((screen.availHeight / 2) - (popH / 2)));
    opts.push('resizable=yes');
    opts.push('scrollbars=yes');
    opts.push('status=no');

    var win = window.open('', popNm, opts.join(','));
    if (win != null && !win.closed)
      win.focus();
    frm.attr('method', 'POST');
    frm.attr('target', popNm);
    frm.attr('action', url);
    frm.submit();
    frm.empty();
    return win;
  },

  formatDateAgo(hour=0, minutes=0) {
    let today = new Date()
    let now = new Date(today)
    
    now.setHours(now.getHours() - hour); // 몇 시간 전
    now.setMinutes(now.getMinutes() - minutes) // 몇 분 전
    
	  const yyyy = now.getFullYear();
    const mm = (now.getMonth() + 1).toString().padStart(2, '0');
    const dd = now.getDate().toString().padStart(2, '0');
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    
    const ymdhms = yyyy + mm + dd + h + m + '00'
    const date1 = yyyy + mm + dd
    const time1 = h + m
    
    return {
      ymdhms,
      date1,
      time1
    }
  }
};

export default HmUtil;
