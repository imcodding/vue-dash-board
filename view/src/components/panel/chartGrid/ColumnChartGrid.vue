<template>
  <div>
    <highcharts :ref="id + 'chart'" :options="chartOptions" style="height: 45%;"></highcharts>
    <span @contextmenu="contextmenuMenu" @mousedown="mousedown($event)">
      <JqxGrid :ref="id + 'grid'" :source="dataAdapter"
              @bindingcomplete   = "onBindingcomplete($event)"
              @rowclick          = "onRowclick($event)"
              @rowdoubleclick    = "onRowdoubleclick($event)"
              @rowselect         = "onRowselect($event)"
              @rowunselect       = "onRowunselect($event)"
              @columnclick       = "onColumnclick($event)"
              @cellclick         = "onCellclick($event)"
              @celldoubleclick   = "onCelldoubleclick($event)"
              @cellselect        = "onCellselect($event)"
              @cellunselect      = "onCellunselect($event)"
              @cellvaluechanged  = "onCellvaluechanged($event)"
              @filter            = "onFilter($event)"
      />
      <JqxMenu ref="jqxMenu"
              :mode="'popup'"
              :autoOpenPopup="false"
              :width="120"
              :height="140"
              @itemclick="onItemclick($event)"
              >
          <ul v-html="liList"></ul>
      </JqxMenu>
    </span>
  </div>
</template>

<script>
import { Chart } from 'highcharts-vue'
import JqxGrid from '@/lib/jqwidgets/vue/vue_jqxgrid.vue'
import JqxMenu from '@/lib/jqwidgets/vue/vue_jqxmenu.vue'

export default {
  props: {
    id: String ,
    url: String,
    seq: Number,
    idx: Number
  },
  components: {
    highcharts: Chart,
    JqxGrid,
    JqxMenu
  },
  data: function () {
        return {
            dataAdapter: new jqx.dataAdapter(this.source),
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
                      rotation: 0,
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
                    borderRadius: {
                      radius: 0
                    },
                    borderColor: null
                  }
                },
                series: [

                ]
            },
            liList: '',

        }
    },
    beforeCreate: function () {
        // axios 데이터 바인딩 할 때, 필요하진 않을까?
        // 정상적인 필터 위해 datafields 필요한 경우 있을까?
        this.source = {
            datatype: 'array'
        };
    },
    beforeMount() {
        this.liList += '<li id="colMgmt">컬럼관리</li>'
    },
    methods:{
        onBindingcomplete   : (event) => { return event },
        onRowclick          : (event) => { return event },
        onRowdoubleclick    : (event) => { return event },
        onRowselect         : (event) => { return event },
        onRowunselect       : (event) => { return event },
        onColumnclick       : (event) => { return event },
        onCellclick         : (event) => { return event },
        onCelldoubleclick   : (event) => { return event },
        onCellselect        : (event) => { return event },
        onCellunselect      : (event) => { return event },
        onCellvaluechanged  : (event) => { return event },
        onFilter            : (event) => { return event },

        /*========== JqxMenu ==========*/
        contextmenuMenu(event) { event.preventDefault(); },

        mousedown(event) {
            let rightClick = this.isRightClick(event);
            if (rightClick) {
                this.$refs.jqxMenu.open(parseInt(event.clientX), parseInt(event.clientY));
                return false;
            }
        },

        isRightClick(event) {
            let rightclick;
            if (event.which) rightclick = (event.which == 3);
            else if (event.button) rightclick = (event.button == 2);
            return rightclick;
        },

        onItemclick(event) {
            const selectedGrid = this.$refs[this.id + 'grid'];

            switch(event.args.id) {
                case 'colMgmt' :
                    this.$store.dispatch('dash/openPopup', {
                        width:400, height:325, name:'com/ColMgmt', title:'컬럼관리',
                        params: { grid: selectedGrid, gridId: this.id, seq: this.seq , idx: this.idx} // 반드시 json 형태
                    });
                    break;
            }
        }
    }
}
</script>
