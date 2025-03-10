
<template>
    <highcharts :ref="id" :options="chartOptions"></highcharts>
</template>

<script>
import { Chart } from 'highcharts-vue'
import HmUtil from '../../js/common/hm.util';
/**
 * highcharts-pie generator
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
    data: function () {
        return {
            //차트에 대한 정보
            chartOptions: {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie',
                    backgroundColor: 'transparent'
                },
                lang: {
                  noData: '조회된 데이터가 없습니다.',
                  loading: '조회중입니다.',
                },
                credits: {
                  enabled: false
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        dataLabels: {
                            enabled: true,
                            format: '<b style="color: ">{point.name}</b>',
                            shadow: false,
                            //connectorColor: 'red' //차트 & 범례 연결 선 컬러값
                        },
                        
                    },
                    series: {
                      turboThreshold: 10000,
                      borderColor: null,
                      animation: {
                        duration: 2000,
                        easing: HmUtil.easeOutBounce
                      },
                    }

                },
                colors: ['#7786D8', '#64B2F8', '#78D2C7', '#B7DB89', '#DDE74D', '#D781B9', '#AB93C5', '#2A398B', '#1765AB', '#2B857A', '#6A8E3C', '#909A00', '#8A346C', '#5E4678'],
                title: {
                  text: ''
                },
                xAxis: {
                    title:''
                },
                yAxis: {
                    title:''
                },
                series: [{
                    name: '',
                    data: [],
                    borderRadius: {
                      radius: 0
                    },
                    //pie 차트 텍스트 뒷라인 그라데이션? 효과 제거
                    dataLabels: {
                      style: {
                        color: '#f1f1f1',
                        fontSize: '12px',
                        textOutline: 'none'
                      }
                    }
                }],
            }
        }
    },

    beforeCreate: function () {

    },
  }
</script>

<style>

</style>
