
<template>
    <highcharts :ref="id" :options="chartOptions"></highcharts>
</template>

<script>
import { Chart } from 'highcharts-vue'
import HmUtil from '../../js/common/hm.util';

//highchart rightclick event
const Highcharts = require('highcharts'),
  HighchartsCustomEvents = require('highcharts-custom-events')(Highcharts);
/**
 * highcharts-bar generator
 * @author sooyun, imhojong
 * @since 2023.07.09
 * @param: id
 * @param: chartOptions
 */

export default {
    props: {
        id: String,
        url: String
    },
    components: {
        highcharts: Chart
    },

    mounted() {
    },
    methods:{

    },

    data: function () {
        return {
            idx: 0,
            chartOptions: {
                chart: {
                  type: 'bar',
                  margin: [10, 10, 10, 100] // 위, 오른쪽, 아래, 왼쪽 순서로 각각 다른 여백을 설정
                },
                lang: {
                  noData: '조회된 데이터가 없습니다.',
                  loading: '조회중입니다.',
                },
                credits: {
                    enabled: false
                },

                title: {
                    text: ''
                },
                subtitle: {
                    text: ''
                },
                colors: ['#7786D8', '#64B2F8', '#78D2C7', '#B7DB89', '#DDE74D', '#D781B9', '#AB93C5', '#2A398B', '#1765AB', '#2B857A', '#6A8E3C', '#909A00', '#8A346C', '#5E4678'],
                legend: {
                    enabled: false
                },
                xAxis: {
                    title:'',
                    labels: {
                      style: {
                        // fontSize: '12px',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        // fontWeight: 'bold',
                        borderWidth: 1,
                        borderColor: '#000',
                        width: '70'
                      }
                    },
                },
                yAxis:{
                    title:'',
                    labels: {enabled: false,
                      style: {
                        // color: '#f1f1f1',
                        // fontSize: '12px'
                      },
                    },
                    gridLineWidth: 0
                },
                tooltip: {

                },
                plotOptions: {
                  series: {
                    events: {
                      contextmenu: function (point) {
                        let detailData = point.srcElement.point;
                        let devKind1 = detailData.devKind1;
                        let ctrName = '';

                        if(devKind1 == 'DEV'){
                          ctrName = '장비상세';
                          if(detailData.hasOwnProperty('ifIdx')){
                            ctrName = '회선상세';
                          }
                        }else if(devKind1 == 'SVR'){
                          ctrName = '서버상세';
                        }else{
                          return
                        }


                        let menu = $('<div id="ctxmenu"></div>');
                        if ($("#ctxmenu").length > 0) {
                          $("#ctxmenu").remove();
                        }

                        let ul = $('<ul></ul>');
                        let li = $('<li>' + ctrName + '</li>');
                        ul.append(li)
                        menu.append(ul).appendTo('body');

                        menu.jqxMenu({
                          width: 100,
                          autoOpenPopup: false,
                          mode: 'popup',
                          popupZIndex: 99999
                        })
                          .on('itemclick', function (event) {
                            HmUtil.ctrxChartPopup(detailData)
                          });

                        menu.jqxMenu('open', point.clientX, point.clientY);

                        point.preventDefault();
                      },
                      click: function (point) {
                        let menu = $('<div id="ctxmenu"></div>');
                        menu.jqxMenu('close');

                      }
                    },
                    turboThreshold: 10000,
                    pointWidth: 20,
                    borderRadius: {
                      radius: 0
                    },
                    animation: {
                      duration: 2000,
                      easing: HmUtil.easeOutBounce
                    },
                    borderColor: null,
                    dataLabels: {
                      enabled: true,
                      style:{
                        color:'#fff',
                        textOutline:'1px contrast',
                        fontSize: '0.8em'
                      },
                      formatter: function () {
                        return HmUtil.convertUnit1000(this.y);
                      }

                    }
                  }
                },
                series: [
                  {
                    // name: '첫번째데이터',
                    // data: [8, 8, 8, 8,5,],
                    //바 상단의 수치값
                    // dataLabels: {
                    //   enabled: true,
                    //   format: '{y}',
                    //   color:'#fff',
                    //   style: {
                    //     fontSize:'12px',
                    //     fontWeight:'bold',
                    //   },
                    //   align: 'right',
                    //   verticalAlign: 'middle',
                    //   //위치 지정
                    //   x: 30,
                    //   // y: -4
                    // }
                  }
                ]
            }
        }
    },

    beforeCreate: function () {

    },
  }
</script>

<style>
  .highcharts-series path {
    animation: dash 5s linear infinite;
  }

  @keyframes dash {
    0% {
      stroke-dashoffset: 600px;
    }
    50% {
      stroke-dashoffset: 0;
    }
    100% {
      stroke-dashoffset: -600px;
    }

  }

  .highcharts-point {
    /* stroke: white; */
    stroke-dasharray: 20, 600;
    stroke-dashoffset: -10;
  }
</style>
