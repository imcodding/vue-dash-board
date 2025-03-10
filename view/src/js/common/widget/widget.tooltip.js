import HmUtil from '../hm.util';
import {store} from '../../../store/store'
const ChartFn = {

    /** 회선성능현황 */
    fnIfPerfFormatter: function() {
      var _point = this.hasOwnProperty('points')? this.points[0].point : this.point;

      if (this.hasOwnProperty('points')) {
        var s = '';
        s += '<tspan style="font-weight:600">' + _point.ymdhms + '</tspan><br>'
          + '<tspan>장비명: ' + _point.devName + '</tspan><br>'
          + '<tspan>장비IP: ' + _point.devIp + '</tspan><br>'
          + '<tspan>회선명: ' + _point.ifName + '</tspan><br>'
        var _userUnit = this.points[0].series.userOptions.userUnit || '';
        $.each(this.points, function (i, v) {
          if (v.y > 0) {
            var name = v.series.userOptions.seriesName.replace('bps', ' bps');
            if (_userUnit == '%') {
              s += '<span>'+ name + ': ' + v.y + ' %</span><br>';
            }
            else {
              s += '<span>' + name + ': ' + HmUtil.convertUnit1000(v.y) + '</span><br>';
            }
          }
        });
        if (this.points[0].hasOwnProperty('total') && this.points[0].total !== undefined) {
          if (_userUnit == '%') {
            s += '<tspan><b>Total: ' + this.points[0].total + ' %</b></tspan>';
          } else {
            s += '<tspan><b>Total: ' + HmUtil.convertUnit1000(this.points[0].total) + '</b></tspan>';
          }
        }
        return s;
      }
      return null;
    },

    /** 네트워크 장비 - CPU, Memory, 응답시간, 세션 */
    fnDevFormatter: function() {
        var _point = this.hasOwnProperty('points')? this.points[0].point : this.point;
        var s = '<tspan>그룹: ' + _point.grpName + '</tspan><br>'
            + '<tspan>장비명: ' + _point.devName + '</tspan><br>'
            + '<tspan>장비IP: ' + _point.devIp + '</tspan><br>'
            + '<tspan>' + _point.series.name + ': ' + this.y + ' ' + (_point.series.userOptions.userUnit || '</tspan>');
        return s;
    },

    /** 회선 트래픽 */
    fnIfBpsFormatter: function () {
      if (this.hasOwnProperty('points')) {
        var s = '';
        s += '<tspan>그룹: '.substitute(this.points[0].color) + this.points[0].point.grpName + '</tspan><br>'
          + '<tspan>장비명: ' + this.points[0].point.devName + '</tspan><br>'
          + '<tspan>장비IP: ' + this.points[0].point.devIp + '</tspan><br>'
          + '<tspan>회선명: ' + this.points[0].point.ifName + '</tspan><br>'
        var _userUnit = this.points[0].series.userOptions.userUnit || '';
        $.each(this.points, function (i, v) {
          if (v.y > 0) {
            var name = v.series.name.replace('bps', ' bps'); // 띄어쓰기 처리
            if (_userUnit == '%') {
              s += '<span>'+ name + ': ' + v.y + ' %</span><br>';
            }
            else {
              s += '<span>' + name + ': ' + HmUtil.convertUnit1000(v.y) + '</span><br>';
            }
          }
        });
        if (this.points[0].hasOwnProperty('total') && this.points[0].total !== undefined) {
          if (_userUnit == '%') {
            s += '<tspan><b>Total: ' + this.points[0].total + ' %</b></tspan>';
          } else {
            s += '<tspan><b>Total: ' + HmUtil.convertUnit1000(this.points[0].total) + '</b></tspan>';
          }
        }
        return s;
      }
      return null;
    },

    /** AP - xAxis 시간일 경우 */
    fnDateFormatter: function() {
      var _point = this.hasOwnProperty('points')? this.points[0].point : this.point;
      var s = '<b>' + _point.ymdhms + '</b><br>'
        + '<tspan>AP명: ' + _point.options.devName + '</tspan><br>'
        + '<tspan>' + _point.series.userOptions.name + ': ' + HmUtil.convertUnit1000(this.y) + '</tspan>';
      return s;
    },

    /*==========END==========*/
    fnSvrProcessFormatter: function() {
        if(this.hasOwnProperty('points')) {
            var s = '<tspan>그룹: '.substitute(this.points[0].color) + this.points[0].point.grpName + '</tspan><br>'
                + '<tspan>장비: ' + this.points[0].point.devName + '</tspan><br>'
                + '<tspan>IP: ' + this.points[0].point.devIp + '</tspan><br>'
                + '<tspan>프로세스: ' + this.points[0].point.processName + '</tspan><br>';
            var _userUnit = this.points[0].series.userOptions.userUnit || '';

            this.points.forEach(function(v, i) {
                if(_userUnit == '%') {
                    s +='<span style="color:' + v.color + '">' + v.series.name + ': ' + Math.abs(v.y) + ' %</span><br>';
                }
                else {
                    s +='<span style="color:"'+ v.color +'">' + v.series.name + ': ' + Math.abs(v.y) + '</span><br>';
                }
            })
            return s;
        }
        return  null;
    },
    fnDevPerfFormatter: function() {
        var _point = this.hasOwnProperty('points')? this.points[0].point : this.point;
        var s = '<tspan>' + _point.ymdhms + '</tspan><br>'
            + '<span style="color:'+ _point.color +'">' + _point.perfTitle + '</span>: ' + this.y + ' ' + (_point.series.userOptions.userUnit);
        return s;
    },

    fnSvrFilesystemFormatter: function() {
        if(this.hasOwnProperty('points')) {
            var s = '<tspan>그룹: '.substitute(this.points[0].color) + this.points[0].point.grpName + '</tspan><br>'
                + '<tspan>장비: ' + this.points[0].point.devName + '</tspan><br>'
                + '<tspan>IP: ' + this.points[0].point.devIp + '</tspan><br>'
                + '<tspan>경로: ' + this.points[0].point.mountPoint + '</tspan><br>';
            var _userUnit = this.points[0].series.userOptions.userUnit || '';
            $.each(this.points, function(i, v) {
                if(_userUnit == '%') {
                    s +='<span style="color: {0}">'.substitute(this.series.color) + v.series.name + ': ' + v.y + ' %</span><br>';
                }
                else {
                    s +='<span style="color: {0}">'.substitute(this.series.color) + v.series.name + ': ' + v.y + '</span><br>';
                }
            });
            return s;
        }
        return  null;
    },
    fnCTimeFormatter: function() {
      return Math.floor(this.value / 60 / 60);
      //return HmUtil.convertCTime(this.value);
    },
    fnUnit1000Tooltip: function () {
        var s = '<b>' + this.key + '</b>';
        s += '<br/>' + this.series.name + ': ' + HmUtil.convertUnit1000(this.y);
        if (this.series.type == 'pie') {
          s += '({0}%)'.substitute(this.percentage.toFixed(1));
        }
        return s;
    },
    fnCTimeTooltip: function () {
      var s = '<b>' + this.key + '</b>';
      s += '<br/>' + this.series.userOptions.name + ': ' + HmUtil.convertCTime(this.y);
      return s;
    }
}
const GridFn = {
    evtLevelRenderer: function(row, datafield, value, data, props, rowData) {
      const evtLevel = rowData.evtLevel;
      //각 이벤트 등급1~5에 맞는 이벤트 정보 호출
      let evtInfo = store.state.widget.evtInfo['evtLevel'+evtLevel];
      if(evtInfo === undefined){ //조치중(-1) 일 경우 key 값은 evtLevel
        evtInfo =  store.state.widget.evtInfo['evtLevel'];
      }
      const evtColor = evtInfo.color;
      const evtName = evtInfo.name;
      const evtFontColor = HmUtil.getTextColorByBackgroundColor(evtColor);

      return '<div class="jqx-center-align" style="height:100%;padding-top:4px; background:' + evtColor  + '; color: '+ evtFontColor +'">' + evtName +'</div>'
    },
    progressbarrenderer:function (row, column, value) {
        var cellWidth = 100;
        var cell = '<div style="margin-top:4px; text-align: center;">';
        cell += '<div style="background: #37B8EF; position: relative; width: ' + (cellWidth/100*value) + 'px; height: 16px;"></div>';
        cell += '<div style="margin-left: 5px; position: relative; top: -15px;">' + value.toString() + '%' + '</div>';
        cell += '</div>';
        return cell;
    },
    convertCTimerenderer:function (row, column, value) {
      var result = '';
      var time = value;
      var year, day, hour, min, result = '';
      if ((60 * 60 * 24 * 365) <= time) {
        year = Math.floor(time / (60 * 60 * 24 * 365));
        time = time - ((60 * 60 * 24 * 365) * year);
        result += "<div style='margin-top: 6.5px; margin-right: 5px' class='jqx-right-align'>" + year + "년 </div>";
      }
      if ((60 * 60 * 24) <= time) {
        day = Math.floor(time / (60 * 60 * 24));
        time = time - ((60 * 60 * 24) * day);
        result += "<div style='margin-top: 6.5px; margin-right: 5px' class='jqx-right-align'>" + day + "일 </div>";
      }
      if ((60 * 60) <= time) {
        hour = Math.floor(time / (60 * 60));
        time = time - ((60 * 60) * hour);
        result += "<div style='margin-top: 6.5px; margin-right: 5px' class='jqx-right-align'>" + hour + "시 </div>";
      }
      if (60 <= time) {
        min = Math.floor(time / 60);
        time = time - (60 * min);
        result += "<div style='margin-top: 6.5px; margin-right: 5px' class='jqx-right-align'>" + min + "분 </div>";
        result += min + '분 ';
      }
      if (time != '' && time != 0) {
        // if (isNaN(time)) time = 0;
        if (time === null) time = 0;
        if (time < 0) time = 0;
        result += "<div style='margin-top: 6.5px; margin-right: 5px' class='jqx-right-align'>" + time + '초 </div>';
      } else {
        result += "<div style='margin-top: 6.5px; margin-right: 5px' class='jqx-right-align'>0초 </div>";
      }
      return result;
    },
    unit1000renderer:function (row, column, value) {
      var cell = '<div style="text-align: right; overflow: hidden; padding-bottom: 2px; margin-top: 7px; margin-right: 5px; margin-left: 4px; -ms-text-overflow: ellipsis;">';
      cell += (value == null || value.length == 0)? value : HmUtil.convertUnit1000(value);
      cell += '</div>';
      return cell;
    },
    unit1024renderer: function (row, column, value) {
      var cell = '<div style="text-align: right; overflow: hidden; padding-bottom: 2px; margin-top: 7px; margin-right: 5px; margin-left: 4px; -ms-text-overflow: ellipsis;">';
      cell += HmUtil.convertUnit1024(value);
      cell += '</div>';
      return cell;
    },
    cTimerenderer: function (row, column, value) {
      var result = HmUtil.convertCTime(value);

        return "<div style='margin-top: 6.5px; margin-right: 5px' class='jqx-right-align'>" + result + "</div>";
    },
    rownumrenderer: function (row, columnfield, value, defaulthtml, columnproperties, rowdata) {
			var _class = 'jqx-center-align';
			if(columnproperties.cellsalign !== undefined){
				_class = 'jqx-'+ columnproperties.cellsalign  + '-align';
            }
            return "<div style='margin-top: 5px;' class='"+_class+"'>" + (row + 1) +"</div>";
		},
}
export {ChartFn, GridFn};
