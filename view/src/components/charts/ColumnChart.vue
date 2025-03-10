
<template>
    <highcharts :ref="id" :options="chartOptions"></highcharts>
</template>

<script>
import { Chart } from 'highcharts-vue'
import HmUtil from '../../js/common/hm.util';
import Highcharts from 'highcharts';
import HighchartsNoData from 'highcharts-no-data-to-display';
HighchartsNoData(Highcharts);

//highchart rightclick event
import HighchartsCustomEvents from 'highcharts-custom-events'
HighchartsCustomEvents(Highcharts)
/**
 * highcharts-column generator
 * @author sooyun, imhojong
 * @since 2023.07.09
 * @param: id
 * @param: chartOptions
 */

export default {
    props: {
        id: String,
        url: String,
    },
    components: {
        highcharts: Chart
    },

    mounted() {

    },

    data: function () {
        return {
            chartOptions: {
                title: '',
                chart: {
                    type: 'column',
                    marginTop: 20,
                    marginRight: 20,
                    backgroundColor: 'transparent'
                },
                lang: {
                  noData: '조회된 데이터가 없습니다.',
                  loading: '조회중입니다.',
                },
                credits: {
                  enabled: false
                },
                colors: ['#7786D8', '#64B2F8', '#78D2C7', '#B7DB89', '#DDE74D', '#D781B9', '#AB93C5', '#2A398B', '#1765AB', '#2B857A', '#6A8E3C', '#909A00', '#8A346C', '#5E4678'],
                legend: {
                    enabled: false
                },
                xAxis: {
                    title: '',
                    labels: {
                      //추후 옵션 등으로 store 처리 필요
                      //rotation: 0,
                      style: {
                        color: '#f1f1f1',
                        fontSize: '12px',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis'
                      }
                    },
                    type: 'datetime',
                    dateTimeLabelFormats: {
                        millisecond: '%H:%M:%S.%L',
                        second: '%H:%M:%S',
                        minute: '%H:%M',
                        hour: '%H:%M',
                        day: '%m/%d',
                        week: '%b-%d',
                        month: '%y-%b',
                        year: '%Y'
                    },
                },
                yAxis: {
                  title: '',
                  gridLineWidth: 0,
                  labels: {
                    style: {
                      color: '#f1f1f1',
                      fontSize: '12px'
                    },
                  },
                },
                tooltip: {

                },
                plotOptions: {
                  series: {
                    events: {
                      click: function (point) {
                        let menu = $('<div id="ctxmenu"></div>');
                        menu.jqxMenu('close');
                      },
                      contextmenu: function (point) {
                        point.preventDefault();
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
                      }
                    },
                    turboThreshold: 10000,
                    borderRadius: {
                      radius: 0
                    },
                    animation: {
                      duration: 2000,
                      easing: HmUtil.easeOutBounce
                    },
                    borderColor: null
                  }
                },
                series: [

                ]
            }
        }
    },

    beforeCreate: function () {

    },
  }
</script>

<style>

</style>
