<template>
  <div>
    <input type="hidden" :value="this.refreshKeyTime"/>
    <component :is="display" :ref="wref" :id="id" :seq="seq" :imgName="thumbnail" :idx="idx" class="itemBox" ></component>
  </div>
</template>

<script>

import Widget from '../js/common/widget/widget.control'
import ColumnChart from './charts/ColumnChart.vue';
import ColumnStackChart from './charts/ColumnStackChart.vue';
import BarChart from './charts/BarChart.vue';
import BarStackChart from './charts/BarStackChart.vue';
import BarNegativeChart from './charts/BarNegativeChart.vue';
import PieChart from './charts/PieChart.vue';
import PieDonutChart from './charts/PieDonutChart.vue';
import AreaChart from './charts/AreaChart.vue';
import LineChart from './charts/LineChart.vue';
import Grid from './jqx/Grid.vue'
import Topology from './panel/Topology.vue';
import ErrCnt from './panel/ErrCnt.vue'
import DevConfInfo from './panel/confInfo/DevConfInfo'
import ColumnChartGrid from './panel/chartGrid/ColumnChartGrid.vue';
import ApStatus from './panel/ApStatus.vue';

export default {
  props: {
    display: String,
    wref: String,
    id: String,
    seq: Number,
    thumbnail: String,
    refreshKeyTime: Number,
    conf: String,
    idx: Number,
  },
  components: {
    Grid,
    ColumnChart, ColumnStackChart,
    BarChart, BarStackChart, BarNegativeChart,
    PieChart, PieDonutChart,
    AreaChart, LineChart,
    Topology, ErrCnt,
    DevConfInfo,
    ColumnChartGrid, ApStatus
  },
  updated() {
    this.refreshWidgetItems();
  },
  mounted() {
    const $this = this
    setTimeout(function() { $this.refreshWidgetItems(); }, 1000);
  },
  methods: {

    refreshWidgetItems() {
      switch(this.display) {
        case 'Grid':
          this.refreshGrid();
          break;
        case 'BarChart':
        case 'ColumnChart':
        case 'PieChart':
        case 'PieDonutChart':
        case 'AreaChart':
        case 'LineChart':
          this.refreshChart();
          break;
        case 'BarNegativeChart':
          this.refreshChart('barNegative');
          break;
        case 'BarStackChart':
          this.refreshChart('barStack');
          break;
        case 'ColumnStackChart':
          this.refreshChart('columnStack');
          break;
        case 'Topology':
          this.refreshTopo();
          break;
        case 'ErrCnt':
        case 'ApStatus':
        case 'DevConfInfo':
          this.refreshSvg();
          break;
        case 'ColumnChartGrid':
          this.refreshChartGrid();
          break;
      }
    },

    /**
     * @param {String} id 차트+그리드 형태 필요
     */
    refreshGrid(id) {
      var type = this.id; //MainWidget.vue props data (위젯 아이템의 고유값 nmsCpuTopN...)
      const gridRef = this.$refs[this.wref];
      const grid = id ? id : gridRef.$refs[this.id];
      const url = Widget.items[type].url;
      let defOptions = Widget.itemInfo[type][this.display].options;
      let gridOptions = defOptions.gridOptions ;
      let options = gridOptions ? gridOptions : defOptions; // 차트+그리드 경우 옵션 구분 필요
      let params = Widget.itemInfo[type][this.display].params

      if(!params) params = {};
      params.gridId = this.id;
      params.seq = this.seq;
      
      if(this.conf) {
        let conf = JSON.parse(this.conf); //각 위젯(패널) 옵션 값
        params = { ...params, ...conf }

        //ColumnChartGrid 높이가 커질수록 차트의 높이만 커지는 이슈 때문
        const rowsH = conf.rowsheight
        options.rowsheight = rowsH ? rowsH : 28
      }

      this.$hmGrid.create(grid, options, params);
      this.$hmGrid.refreshData(grid, url, params);

      this.$store.dispatch('widget/callBindingcomplete', this);
      this.$store.dispatch('widget/callRowclick', this); //우클릭
    },

    refreshChart(chartType, id) {
      var type = this.id; //MainWidget.vue props data (위젯 아이템의 고유값 nmsCpuTopN...)
      const chartId = id ? id : this.$refs[this.wref].$refs[this.id]
      const url = Widget.items[type].url
      const info = Widget.itemInfo[type][this.display];
      let defOptions = info.options;
      let chartOptions = defOptions.chartOptions;
      let options = chartOptions ? chartOptions : defOptions;

      let params = info.params;
      if(this.conf) {
        let conf = JSON.parse(this.conf); //각 위젯(패널) 옵션 값
        params = { ...params, ...conf }
      }

      this.$hmChart.setOptions(this.$refs[this.wref], options);
      this.$hmChart.refreshData(chartId, url, params, chartType);
    },

    refreshTopo() {
      this.D3Topology.resizeSvg();
      this.D3Topology.search();
    },

    refreshSvg(){
      const type = this.id;
      let url = Widget.items[type].url
      let params = Widget.itemInfo[type][this.display].params

      if(this.conf) {
        let conf = JSON.parse(this.conf); //각 위젯(패널) 옵션 값
        params = { ...params, ...conf }
      }

      // 공통 url 아닐 경우 (ex. 구성정보)
      if(!url) url = Widget.itemInfo[type][this.display].url;
      this.$refs[type].refreshData(url, params)
    },

    refreshChartGrid() {
      const chartId = this.$refs[this.wref].$refs[this.id + 'chart'];
      const gridId = this.$refs[this.wref].$refs[this.id + 'grid'];

      this.refreshChart(null, chartId);
      this.refreshGrid(gridId);
    }

  },
  data() {
    return {

    }
  }
}
</script>

<style scoped>
.itemBox { display:block;width:100%!important;height:100%!important;}
</style>
