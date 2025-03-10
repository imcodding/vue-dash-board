import { store } from '../../store/store'
export default {
  install(app) {
    let Vue = app.prototype;
    Vue.$util = Util;
    Vue.$popup = Popup;
    Vue.$js = JS;
    /*================================
      Utils
    ================================ */
    Vue.$isBlank = (val) => {
      let tmp = val.trim();
      if (tmp !== undefined && tmp != null && tmp.length > 0) return false;
      else return true;
    }

    Vue.$validateIp = (strIP) => {
      let regExp = /^(((\d)|([1-9]\d)|(1\d{2})|(2[0-4]\d)|(25[0-5]))\.){3}(((\d)|([1-9]\d)|(1\d{2})|(2[0-4]\d)|(25[0-5])))$/;
      return regExp.test(strIP);
    }

    Vue.$curDate = () => {
      let today = new Date();
      let yyyy = today.getFullYear();
      let mm = today.getMonth() + 1; //January is 0!
      let dd = today.getDate();
      let hour = today.getHours();
      let minute = today.getMinutes();
      let seconds = today.getSeconds();
      let week = ['일', '월', '화', '수', '목', '금', '토'];
      let dayOfWeek = week[today.getDay()];


      if (mm < 10) {
        mm = '0' + mm;
      }
      if (dd < 10) {
        dd = '0' + dd;
      }
      if (hour < 10) {
        hour = '0' + hour;
      }
      if (minute < 10) {
        minute = '0' + minute;
      }
      if (seconds < 10) {
        seconds = '0' + seconds;
      }

      //헤더용
      let curTime = yyyy+'-'+mm+'-'+dd+' ['+dayOfWeek+'] '+hour+":"+minute+":"+seconds;
      const returnData = {
        yyyy : yyyy,
        mm: mm,
        dd: dd,
        hour: hour,
        minute: minute,
        seconds: seconds,
        dayOfWeek: dayOfWeek,
        curTime: curTime
      }
      return returnData;

    }

    String.prototype.substitute = function() {
      var str = this;
      for(var i = 0; i < arguments.length; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        str = str.replace(reg, arguments[i]);
      }
      return str;
    }
  }
}

/*================================
    Util
=================================*/
const Util = {
  convertUnit1000(value) {
    var retnVal = '';
    var result = '';

    if (value >= 0) {
        if (value >= Math.pow(1000, 4)) {
            result = Math.round((value / Math.pow(1000, 4)) * 100);
            retnVal += (result / 100) + "T";
        }
        else if (value >= Math.pow(1000, 3)) {
            result = Math.round((value / Math.pow(1000, 3)) * 100);
            retnVal += (result / 100) + "G";
        }
        else if (value >= Math.pow(1000, 2)) {
            result = Math.round((value / Math.pow(1000, 2)) * 100);
            retnVal += (result / 100) + "M";
        }
        else if (value >= Math.pow(1000, 1)) {
            result = Math.round((value / Math.pow(1000, 1)) * 100);
            retnVal += (result / 100) + "K";
        }
        else {
            result = Math.round(value * 100);
            retnVal += (result / 100) + "";
        }
    } else {
        value = -value;
        if (value >= Math.pow(1000, 4)) {
            result = Math.round((value / Math.pow(1000, 4)) * 100);
            retnVal += "- " + (result / 100) + "T";
        }
        else if (value >= Math.pow(1000, 3)) {
            result = Math.round((value / Math.pow(1000, 3)) * 100);
            retnVal += "- " + (result / 100) + "G";
        }
        else if (value >= Math.pow(1000, 2)) {
            result = Math.round((value / Math.pow(1000, 2)) * 100);
            retnVal += "- " + (result / 100) + "M";
        }
        else if (value >= Math.pow(1000, 1)) {
            result = Math.round((value / Math.pow(1000, 1)) * 100);
            retnVal += "- " + (result / 100) + "K";
        }
        else {
            result = Math.round(value * 100);
            retnVal += "- " + (result / 100) + "";
        }
    }
    return retnVal;
  },

  commaNum: function (num) {
    var len, point, str;
    num = num + "";
    point = num.length % 3;
    len = num.length;
    str = num.substring(0, point);
    while (point < len) {
        if (str != "") str += ",";
        str += num.substring(point, point + 3);
        point += 3;
    }
    return str;
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
  showPopup(url, frm, popNm, popW, popH, params, callback) {
    // let frm = document.getElementById('hForm')
    frm.innerHTML = '';

    params.url = url;

    if (params !== undefined) {

      for (const key of Object.keys(params)) {
        let input = document.createElement('input')
        input.type = 'hidden'
        input.name = key
        input.id = key
        input.value = params[key]
        frm.appendChild(input)
      }
      
      var opts = [];
      opts.push('width=' + popW);
      opts.push('height=' + popH);
      opts.push('left=' + parseInt((screen.availWidth / 2) - (popW / 2)));
      opts.push('top=' + parseInt((screen.availHeight / 2) - (popH / 2)));
      opts.push('resizable=yes');
      opts.push('scrollbars=yes');
      opts.push('status=no');
    
      var win = window.open('/main/popup/detail', popNm, opts.join(','));
      if (win != null && !win.closed)
      win.focus();
      win.onbeforeunload = callback
      // frm.method = 'post'
      // frm.target = popNm;
      // frm.action = url;
      // frm.attr('method', 'POST');
      // frm.attr('target', popNm);
      // frm.attr('action', url);
      // frm.submit();
      // frm.empty();

      return win;
    }
  }
}
/*================================
    Popup
=================================*/
const Popup = {
  open(component, title, width, height, params) {
     
    let popupBox = document.getElementById('popupBox');
    if(popupBox) {
      popupBox.innerHTML = ''
    } else {
      popupBox = document.createElement('div');
      popupBox.id = 'popupBox';
    }

    for(const key of Object.keys(params)) {
      const value = params[key];
      const input = '<input type="hidden" id="' + key + '" value="' + value + '"/>'
      popupBox.insertAdjacentHTML('afterbegin', input);
    }
    document.body.append(popupBox);

    const jqxWin = component.$refs.jqxWindow;
    jqxWin.title = '<h1>' + title + '</h1>'
    jqxWin.width = width;
    jqxWin.height = height;
    jqxWin.open();
  }
}
/*================================
    Javascript
=================================*/
const JS = {
  getEmById(id) {
    return document.getElementById(id);
  },

  getEmByClass(classsName) {
    return document.getElementsByClassName(classsName)[0];
  },

  showById(id) {
    document.getElementById(id).style.display = 'block'
  },

  hideById(id) {
    document.getElementById(id).style.display = 'none'
  },

  showByClass(className) {
    document.getElementsByClassName(className)[0].style.display = 'block'
  },

  hideByClass(className) {
    document.getElementsByClassName(className)[0].style.display = 'none'
  },

  getValueById(id) {
    const obj = document.getElementById(id);
    return obj ? obj.value : undefined
  }
}
