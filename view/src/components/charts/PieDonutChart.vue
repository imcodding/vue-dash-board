
<template>
  <highcharts :ref="id" :options="chartOptions"></highcharts>
</template>

<script>
import { Chart } from 'highcharts-vue'

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
          marginLeft: -140,
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
            showInLegend: true,
            allowPointSelect: false,
            dataLabels: {
              enabled: false,
            },
            innerSize: '50%',
          },
          series: {
            turboThreshold: 10000,
            borderColor: null
          }
        },
        colors: ['#7786D8', '#64B2F8', '#78D2C7', '#B7DB89', '#DDE74D', '#D781B9', '#AB93C5', '#2A398B', '#1765AB', '#2B857A', '#6A8E3C', '#909A00', '#8A346C', '#5E4678'],
        legend: {
          enabled: true,
          align: 'right',
          itemWidth: 140,
          floating: 'true',
          verticalAlign: 'middle',
          layout: 'vertical',
          itemStyle: {
            // color: '#f1f1f1',
            // fontWeight: 'bold',
            // fontSize: '12px'
          }
        },
        title: {
          text: ''
        },
        xAxis: {
          title: ''
        },
        yAxis: {
          title: ''
        },
        series: [{
          type: 'pie',
          name: '',
          borderRadius: {
            radius: 0
          },
          data: [],
        }]
      }
    }
  },

  beforeCreate: function () {

  },
}
</script>

<style></style>
