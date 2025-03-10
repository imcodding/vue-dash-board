import axios from 'axios';
import HmUtil from './hm.util';
/**
 * highcharts function
 * @author sooyun, imhojong
 * @since 2023.07.09
 */

export default {
  install(app) {
    app.prototype.$hmChart = HmChart;
  }
}

const HmChart = {

  /**
   * 차트 옵션 설정
   * 변경할 옵션이 많을 경우 사용
   * @param {*ref} ref 1depth
   * @param {*json} options
   */
  setOptions(ref, options) {
    Object.assign(ref.chartOptions, options);
  },

  /**
   * 차트 제목 설정
   */
  setTitle(ref, title) {
    ref.chartOptions.title = {text: title}
  },

  /**
   * 차트 부제목 설정
   */
  setSubTitle(ref, subtitle) {
    ref.chartOptions.subtitle = {text: subtitle}
  },

  /**
   * 차트 데이터 refresh
   * @param ref 자식 ref
   * @param url API 주소
   * fields
   * line, area 는 x축 fields(시간)
   * bar, column, pie 는 y축 fields
   */
  refreshData(ref, url, params, chartType, localData) {
    if(localData) {
      this.bindingData(ref, localData);
      return;
    }
    const $this = this;

    axios.get(url, {params:params}).then(function (response) {
      $this.bindingData(ref, response, chartType, params);
    })
    .catch(function (error) {
      console.log(error);
    });
  },

  /**
   * 차트 데이터 바인딩
   * axios response 와 local data 구분 짓기 위함
   * @param {ref} ref
   * @param {Array, String} categories
   * @param {String} fields
   * @param {Array} data
   * @param {String} chartType 차트 데이터 바인딩 처리가 다를 경우(ex. bar vs barNegative)
   */
  bindingData(ref, data, chartType, params) {
    const type = chartType ? chartType : ref.chart.options.chart.type;
    switch (type) {
      case 'line':
      case 'area':
        if(params && params.seriesType == 'dynamic'){
          this.refreshDataLineAreaDynamic(ref, data, params);
        }else{
          this.refreshDataLineArea(ref, data, params);
        }
        break;
      case 'bar':
      case 'column':
        //해당 위치에서 params.itemType으로 트래픽 등의 차트일 경우 분기가 필요한지?
        //신규 3번째 인자값 params 추가
        //refreshDataBarColumn 기존 함수
        this.refreshDataBarColumnNew(ref, data, params);
        break;
      case 'pie':
        this.refreshDataPie(ref, data);
        break;
      case 'barNegative':
        this.refreshBarNegative(ref, data);
        break;
      case 'columnStack':
      case 'barStack':
        this.refreshBarColumnStack(ref, data, params);
        break;
    }
  },

  /**
   * line 또는 area 차트 데이터 갱신
   * 단일 데이터일 경우 사용
   */
  refreshDataLineArea(ref, response, params) {
    let chart = ref.chart;

    const userOptions = chart.series[0].userOptions;
    if(response.length === 0) return;

    for(let i = chart.series.length-1; i >= 0; i--) {
      chart.series[i].remove(false);
    }

    let chartData = [];

    for (const value of response) {
      let converDateTime = new Date(value[userOptions.xField] + 'Z').getTime();
      value.x = converDateTime;
      value.y = value[userOptions.yField];
      chartData.push(value);
      // 가져온 데이터 값으로 series name 설정
      if(userOptions.userName) userOptions.name = value[userOptions.userName];
    }

    if(params && params.chartColor){ //conf 옵션 차트 series 개별 색상 여부
      userOptions.color = params.chartColor;
      userOptions.colorByPoint = false; //해당 옵션 true 일 경우 기본 설정 값으로 다색 표현. //true 이면 단색통일 설정 사용 불가
    }
    userOptions.data = chartData;

    chart.addSeries(userOptions, false);
    chartData = [];

    chart.redraw();
  },

  /**
   * line 또는 area 차트 데이터 갱신
   * 동적 시리즈용
   * 날짜 컬럼 2개 ymdhms/dtYmdhms 고정
   * 날짜 제외 모든 쿼리 select 컬럼은 시리즈로 반환
   */
  refreshDataLineAreaDynamic(ref, res, conf) {
    let chart = ref.chart;
    let resultData = res;
    let xField = 'dtYmdhms';
    let yFields = []
    let map = res.length > 0 ? res[0] : [];
    let noFields = [xField, 'grpName', 'devName', 'devIp', 'ifName', 'ymdhms']; //필드 제외항목
    let lastVisible = conf.lastVisible;
    let seriesNames = conf.seriesNames;
    let seriesList = seriesNames && seriesNames.split(',');

    for (const key of Object.keys(map)) {
      if(!noFields.includes(key)) yFields.push(key);
    }

    yFields.sort();

    for(let i = chart.series.length-1; i >= 0; i--) {
      chart.series[i].remove(false);
    }

    //차트색상
    let colorChart = conf.colorChart;
    let colors = colorChart && colorChart.split(',');

    let chartData = [];
    let seriesData = {};

    for (let i = 0; i < yFields.length; i++) {
      for (const value of resultData) {
        // console.log('resultData',resultData)
        let converDateTime = new Date(value[xField] + 'Z').getTime();
        let data = {...value};
        data.x = converDateTime;
        data.y = value[yFields[i]];

        chartData.push(data);
      }

      let yField = yFields[i];
      let seriesName = '';

      seriesName = seriesList && seriesList.length > 0 ? seriesList[i] : yField
      seriesName = seriesName.replace('bps', ' bps');

      //범례 끝 last 성능 값 표기 주석 처리
      if(lastVisible) {
        seriesName += '(' + HmUtil.convertUnit1000(resultData[resultData.length-1][yField]) + ')';
      }

      seriesData = { data: chartData, name: seriesName, legendSymbol : 'rectangle', seriesName: yField}
      if(colors) { seriesData.color = colors[i] }

      chart.addSeries(seriesData)

      chartData = [];
    }

    /**
     * 데이터가 없을 경우 x축이 그려져있고, 범례가 보였다가 사라지는 현상을 막기위해
     * default 로는 x축은 안 그리고 범례는 안 보이도록 설정
     * 실제로 데이터가 있을 경우, x축을 그리고 범례 보이도록함
     */
    if(resultData.length > 0) {
      chart.update({
        xAxis: {lineWidth:1},
        legend: {enabled:true}
      })
    }
    chart.redraw();

  },

  /**
   * 모든 파라미터는 필수! 전일/금일 전용 메소드
   * @param {$refs} ref 차트 ref
   * @param {String} url REST API 주소
   * @param {Array} categories [전일, 금일]
   * @param {String} fields 차트 데이터 표현 값
   */
  refreshDataArea(ref, categories, fields, res) {
    let chart = ref.chart;
    if(!(res.yesterdayList && res.todayList)) return;

    let yesterdayData = [];
    let todayData = [];

    //데이터 시간 default 값은 'dfYmdhms'
    let xField = 'dfYmdhms';
    let yFields = fields;

    if(categories == undefined) categories = []

    for (const value of res.yesterdayList) {
      let converDateTime = new Date(value[xField] + 'Z').getTime();
      yesterdayData.push([converDateTime, value[yFields]])
    }
    for (const value of res.todayList) {
      let converDateTime = new Date(value[xField] + 'Z').getTime();
      todayData.push([converDateTime, value[yFields]])
    }

    while (chart.series.length) {
      chart.series[1].remove(false);
      chart.series[0].remove(false);
    }

    chart.addSeries({data: yesterdayData, name: categories[0]}, false);
    chart.addSeries({data: todayData, name: categories[1]}, false);

    chart.redraw();
  },

  refreshDataBarColumn(ref, response) {

    let chart = ref.chart;

    //widget.item.(위젯타입).js 에 선언되어 있는 series 값
    const userOptions = chart.series[0].userOptions;

    for(let i=0; i < chart.series.length; i++){
      chart.series[i].remove(false);
    }

    let chartData = [];
    let categoryData = [];
    for (const value of response) {
      var data = value;
      data.name = value[userOptions.xField];
      data.y = value[userOptions.yField];

      chartData.push(data)
      categoryData.push(value[userOptions.xField]);
    }

    userOptions.data = chartData;

    chart.addSeries(userOptions);
    chart.xAxis[0].setCategories(categoryData, false);

    chart.redraw();
  },

  //신규 동적 N시리즈 함수 테스트 용
  refreshDataBarColumnNew(ref, response, params) {
    if(params.xType == 'time') {
      // x축이 시간일 경우
      this.refreshDataLineArea(ref, response, params)
      return;
    }
    let chart = ref.chart;
    //widget.item.(위젯타입).js 에 선언되어 있는 series 값
    const userOptions = chart.series[0].userOptions;

    if (response.length === 0) return;

    for (let i = chart.series.length - 1; i >= 0; i--) {
      chart.series[i].remove(false);
    }

    let yField = []

    yField = this.getFieldByType(params.itemType, params.ifInout);
    if(yField.length === 0) yField.push(userOptions.yField);

    //설정된 Y축의 개수를 기준으로 series 생성
    let seriesIdx = 0;
    for (const i of yField) {
      let chartData = [];
      let categoryData = [];
      let chartColor = this.getDefaultOptions().colors[seriesIdx];

      for (const value of response) {
        var data = value;
        data.name = value[userOptions.xField];
        data.y = value[i];

        // 차트 색상 반영위해 임시주석..
        // if(params.itemType === 'TRAFFIC') data.color = chartColor;

        chartData.push(data)
        categoryData.push(value[userOptions.xField]);
      }

      if(params.chartColor){ //conf 옵션 차트 series 개별 색상 여부
        userOptions.color = params.chartColor;
        userOptions.colorByPoint = false; //해당 옵션 true 일 경우 기본 설정 값으로 다색 표현. //true 이면 단색통일 설정 사용 불가
      }

      userOptions.data = chartData;

      /*2024.03.18 AP별 장애시간 툴팁 위해서 주석처리*/
      /*2024.03.27 Traffic TopN 에서 필요*/
      if(params.itemType === 'TRAFFIC') userOptions.name = i;

      chart.addSeries(userOptions);
      //chart.addSeries({data: chartData, name: i}, false);
      chart.xAxis[0].setCategories(categoryData, false);

      seriesIdx ++;
    };
    chart.redraw();
  },

  refreshBarColumnStack(ref, response, params) {

    let chart = ref.chart;
    const userOptions = chart.series[0].userOptions;

    if (response.length === 0) return;

    for (let i = chart.series.length - 1; i >= 0; i--) {
      chart.series[i].remove(false);
    }

    let yField = []
    yField = this.getFieldByType(params.itemType, params.ifInout);
    if(yField.length === 0) yField.push(userOptions.yField);

    //설정된 Y축의 개수를 기준으로 series 생성
    let seriesIdx = 0;
    for (const ifInout of yField) {
      let chartColor = this.getDefaultOptions().colors[seriesIdx];
      let chartData = [];
      let categoryData = [];
      for (const value of response) {
        var data = value;
        data.name = value[userOptions.xField];
        data.y = value[ifInout];
        data.color = chartColor;
        chartData.push(data)
        categoryData.push(value[userOptions.xField]);
      }

      userOptions.data = chartData;
      userOptions.name = ifInout;

      chart.addSeries(userOptions);
      chart.xAxis[0].setCategories(categoryData, false);

      seriesIdx ++;
    };
    chart.redraw();
  },

  refreshDataPie(ref, response) {
    let chart = ref.chart;

    const userOptions = chart.series[0].userOptions;

    if(response.length === 0) return;

    for(let i=0; i < chart.series.length; i++){
      chart.series[i].remove(false);
    }

    let chartData = [];
    for (const value of response) {
      var data = value;
      data.name = value[userOptions.xField];
      data.y = value[userOptions.yField];
      chartData.push(data)
    }

    userOptions.data = chartData;

    chart.addSeries(userOptions, false);
    chart.redraw();
  },

  refreshBarNegative(ref, response) {
    let chart = ref.chart;

    const userOptions1 = chart.series[0].userOptions;
    const userOptions2 = chart.series[1].userOptions;

    if(response.length === 0) return;

    for(let i = chart.series.length-1; i >= 0; i--) {
        chart.series[i].remove(false);
    }

    let categoryData = [];
    let chartData = [];
    let chartData2 = [];

    for(const value of response) {
      let data = {};
      data.name = value[userOptions1.xField]
      data.y = value[userOptions1.yField] * -1
      data = {...data, ...value}

      let data2 = {};
      data2.name = value[userOptions2.xField]
      data2.y = value[userOptions2.yField]
      data2 = {...data2, ...value}

      chartData.push(data);
      chartData2.push(data2);

      categoryData.push(value[userOptions1.xField])
    }
    userOptions1.data = chartData;
    userOptions2.data = chartData2;

    chart.addSeries(userOptions1, false);
    chart.addSeries(userOptions2, false);
    chart.xAxis[0].setCategories(categoryData, false);

    chart.redraw();
  },

  getFieldByType(type, kind) {
    let yField = [];
    switch(type) {
      case 'TRAFFIC':
        switch(kind) {
          case 'IO':
              yField.push('inbps');
              yField.push('outbps');
              break;
            case 'IO_PER':
              yField.push('inbpsPer');
              yField.push('outbpsPer');
              break;
            case 'SUM':
              yField.push('bps');
              break;
            case 'SUM_PER':
              yField.push('bpsPer');
              break;
            case 'IN':
              yField.push('inbps');
              break;
            case 'OUT':
              yField.push('outbps');
              break;
            case 'IN_PER':
              yField.push('inbpsPer');
              break;
            case 'OUT_PER':
              yField.push('outbpsPer');
              break;
            default :
              yField.push('inbps');
              break;
        }
      break;
    }
    return yField;
  },

  getDefaultOptions() {
    return {
      lang: {
        months: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        shortMonths: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
        weekdays: ['일', '월', '화', '수', '목', '금', '토'],
        noData: '조회된 데이터가 없습니다.',
        loading: '조회중입니다.',
        printChart: '인쇄'
      },
      navigation: {
        buttonOptions: {
          enabled: false
        }
      },
      colors: ['#7786D8', '#64B2F8', '#78D2C7', '#B7DB89', '#DDE74D', '#D781B9', '#AB93C5', '#2A398B', '#1765AB', '#2B857A', '#6A8E3C', '#909A00', '#8A346C', '#5E4678'],
      title: {
        text: ''
      },
      tooltip: {
        //pointFormat: '{series.name}'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
          }
        },
      },

      series: []
    }
  },

}
