
<template>
  <highcharts :ref="id" :options="chartOptions"></highcharts>
</template>

<script>
import { Chart } from 'highcharts-vue'

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

  data: function () {
    return {
      chartOptions: {
        chart: {
          type: 'bar',
          backgroundColor: 'transparent'
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
          enabled: true
        },
        xAxis:
         {
           labels: {
             rotation: 0,
             style: {
               color: '#f1f1f1',
               fontSize: '12px',
               whiteSpace: 'nowrap',
               textOverflow: 'ellipsis'
             }
           }
         },
        yAxis: {
          title: '',
          gridLineWidth: 0,
          min: -100, max: 100,
          labels: {
            formatter: function () {
              return Math.abs(this.value) + ' %';
            },
            style: {
              // color: '#f1f1f1',
              // fontSize: '12px'
            }
          },
        },
        tooltip: {

        },
        plotOptions: {
          bar: {
            stacking: 'normal',
          },
          series: {
            turboThreshold: 10000,
            borderRadius: {
              radius: 0
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

<style></style>
