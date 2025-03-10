<template>
  <highcharts :ref="id" :options="chartOptions"></highcharts>
</template>

<script>
import { Chart } from 'highcharts-vue';

/**
 * highcharts-line generator
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

  method: {
    refreshData() {

    }
  },

  data() {

    return {
      chartOptions: {
        chart: {
          type: 'line',
          marginTop: 20,
          marginRight: 20,
          backgroundColor: 'transparent'
        },
        lang: {
          noData: '조회된 데이터가 없습니다.',
          loading: '조회중입니다.',
        },
        xAxis: {
          title:'',
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
          labels: {
            style: {
              color: '#f1f1f1',
              fontSize: '12px',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis'
            }
          },
          //세로 눈금
          tickColor: '#f1f1f1',
          tickWidth: 1,
          //가로 X축 선
          lineColor: '#f1f1f1',
          lineWidth: 1
        },
        yAxis: {
          title:'',
          gridLineWidth: 0,
          labels: {
            style: {
              color: '#f1f1f1',
              fontSize: '12px'
            },
          }
        },
        credits: {
          enabled: false
        },
        title:{text: ''},
        colors: ['#7786D8', '#64B2F8', '#78D2C7', '#B7DB89', '#DDE74D', '#D781B9', '#AB93C5', '#2A398B', '#1765AB', '#2B857A', '#6A8E3C', '#909A00', '#8A346C', '#5E4678'],
        tooltip: {
            shared: true,
        },
        plotOptions: {
          line: {
            marker: {
              enabled: false
            }
          },
          series: {
            turboThreshold: 10000
          }
        },
        series: [],
        legend: {
          enabled: true,
          itemStyle: {
            color: '#f1f1f1',
            fontWeight: 'bold',
            fontSize: '12px'
          }
        }
      }
    } //return
  }
}
</script>

<style>

</style>
