import {ChartFn, GridFn } from './widget.tooltip.js';

/**
 * 필독!!
 * 모든 차트는 series 를 반드시 정의해준다.
 * params: 디폴트 Conf 값
 */
const WidgetItemNMS = {
  /*========== CPU ==========*/
  nmsCpuTopN: {
    Grid: {
      options: {
        columns: [
          {datafield: 'No', text: 'No', width: '40', cellsalign: 'center', cellsrenderer: GridFn.rownumrenderer, hidden: true},
          {datafield: 'devName', text: '장비명', minwidth: '100', type: 'string'},
          {datafield: 'devIp', text: '장비IP', width: '100', type: 'string'},
          {datafield: 'perfVal', text: 'CPU', width: '50', cellsalign: 'right', type: 'int'}
        ],
        // height: '200px',
        enablehover: false,
      },
      params: {
        itemType: 'CPU', topN: 5
      }
    },
    BarChart: {
      options: {
        tooltip: {
          shared: true,
          formatter: ChartFn.fnDevFormatter
        },
        series: [
          { name: 'CPU', xField: 'devName', yField: 'perfVal', userUnit: '%', colorByPoint: true}
        ]
      },
      params: {
        itemType: 'CPU', topN: 5
      }
    },
    ColumnChart: {
      options: {
        tooltip: {
          shared: true,
          formatter: ChartFn.fnDevFormatter
        },
        series: [
          { name: 'CPU', xField: 'devName', yField: 'perfVal', userUnit: '%', colorByPoint: true}
        ]
      },
      params: {
        itemType: 'CPU', topN: 5
      }
    },
    PieChart: {
      options: {
        tooltip: {
          shared: true,
          formatter: ChartFn.fnDevFormatter
        },
        series: [
          { name: 'CPU', xField: 'devName', yField: 'perfVal', userUnit: '%', colorByPoint: true}
        ]
      },
      params: {
        itemType: 'CPU', topN: 5
      }
    },
    PieDonutChart: {
      options: {
        tooltip: {
          shared: true,
          formatter: ChartFn.fnDevFormatter
        },
        series: [
          { name: 'CPU', xField: 'devName', yField: 'perfVal', userUnit: '%', colorByPoint: true}
        ]
      },
      params: {
        itemType: 'CPU', topN: 5
      }
    },
    ColumnChartGrid: {
      options: {
        gridOptions: {
          columns: [
            {datafield: 'No', text: 'No', width: '40', cellsalign: 'center', cellsrenderer: GridFn.rownumrenderer, hidden: true},
            {datafield: 'devName', text: '장비명', minwidth: '100', type: 'string'},
            {datafield: 'devIp', text: '장비IP', width: '100', type: 'string'},
            {datafield: 'perfVal', text: 'CPU', width: '50', cellsalign: 'right', type: 'int'}
          ],
          height: '55%'
        },
        chartOptions: {
          tooltip: {
            shared: true,
            formatter: ChartFn.fnDevFormatter
          },
          series: [
            { name: 'CPU', xField: 'devName', yField: 'perfVal', userUnit: '%', colorByPoint: true}
          ]
        }
      },
      params: {
        itemType: 'CPU', topN: 5
      }
    }
  },
  /*========== Memory ==========*/
  nmsMemTopN: {
    Grid: {
      options: {
        columns: [
          {datafield: 'No', text: 'No', width: '40', cellsalign: 'center', cellsrenderer: GridFn.rownumrenderer, hidden: true},
          {datafield: 'devName', text: '장비명', minwidth: '100', type: 'string'},
          {datafield: 'devIp', text: '장비IP', width: '100', type: 'string'},
          {datafield: 'perfVal', text: '메모리', width: '50', cellsalign: 'right', type: 'int'}
        ],
        height: '200px'
      },
      params: {
        itemType: 'MEM', topN: 5
      }
    },
    BarChart: {
      options: {
        tooltip: {
          shared: true,
          formatter: ChartFn.fnDevFormatter
        },
        series: [
          { name: 'MEM', xField: 'devName', yField: 'perfVal', userUnit: '%', colorByPoint: true}
        ]
      },
      params: {
        itemType: 'MEM', topN: 5
      }
    },
    ColumnChart: {
      options: {
        tooltip: {
          shared: true,
          formatter: ChartFn.fnDevFormatter
        },
        series: [
          { name: 'MEM', xField: 'devName', yField: 'perfVal', userUnit: '%', colorByPoint: true}
        ]
      },
      params: {
        itemType: 'MEM', topN: 5
      }
    },
    PieChart: {
      options: {
        tooltip: {
          shared: true,
          formatter: ChartFn.fnDevFormatter
        },
        series: [
          { name: 'MEM', xField: 'devName', yField: 'perfVal', userUnit: '%', colorByPoint: true}
        ]
      },
      params: {
        itemType: 'MEM', topN: 5
      }
    },
    PieDonutChart: {
      options: {
        tooltip: {
          shared: true,
          formatter: ChartFn.fnDevFormatter
        },
        series: [
          { name: 'MEM', xField: 'devName', yField: 'perfVal', userUnit: '%', colorByPoint: true}
        ]
      },
      params: {
        itemType: 'MEM', topN: 5
      }
    },
    ColumnChartGrid: {
      options: {
        gridOptions: {
          columns: [
            {datafield: 'No', text: 'No', width: '40', cellsalign: 'center', cellsrenderer: GridFn.rownumrenderer, hidden: true},
            {datafield: 'devName', text: '장비명', minwidth: '100', type: 'string'},
            {datafield: 'devIp', text: '장비IP', width: '100', type: 'string'},
            {datafield: 'perfVal', text: '메모리', width: '50', cellsalign: 'right', type: 'int'}
          ],
          height: '55%'
        },
        chartOptions: {
          tooltip: {
            shared: true,
            formatter: ChartFn.fnDevFormatter
          },
          series: [
            { name: 'MEM', xField: 'devName', yField: 'perfVal', userUnit: '%', colorByPoint: true}
          ]
        }
      },
      params: {
        itemType: 'MEM', topN: 5
      }
    }
  },
  
  /*========== 온도 ==========*/
  nmsTempTopN: {
    Grid: {
      options: {
        columns: [
          {datafield: 'devName', text: '장비명', minwidth: '100', type: 'string'},
          {datafield: 'devIp', text: '장비IP', width: '70', type: 'string'},
          {datafield: 'perfVal', text: '온도(℃)', width: '80', cellsalign: 'right', type: 'int'}
        ],
        height: '200px',
        enablehover: false,
      },
      params: {
        itemType: 'TEMP', topN: 5
      }
    },
    BarChart: {
      options: {
        tooltip: {
          shared: true,
          formatter: ChartFn.fnDevFormatter
        },
        series: [
          { name: '온도', xField: 'devName', yField: 'perfVal', userUnit: '°C', colorByPoint: true}
        ]
      },
      params: {
        itemType: 'TEMP', topN: 5
      }
    },
    ColumnChart: {
      options: {
        tooltip: {
          shared: true,
          formatter: ChartFn.fnDevFormatter
        },
        series: [
          { name: '온도', xField: 'devName', yField: 'perfVal', userUnit: '°C', colorByPoint: true}
        ]
      },
      params: {
        itemType: 'TEMP', topN: 5
      }
    },
    PieChart: {
      options: {
        tooltip: {
          shared: true,
          formatter: ChartFn.fnDevFormatter
        },
        series: [
          { name: '온도', xField: 'devName', yField: 'perfVal', userUnit: '°C', colorByPoint: true}
        ]
      },
      params: {
        itemType: 'TEMP', topN: 5
      }
    },
    PieDonutChart: {
      options: {
        tooltip: {
          shared: true,
          formatter: ChartFn.fnDevFormatter
        },
        series: [
          { name: '온도', xField: 'devName', yField: 'perfVal', userUnit: '°C', colorByPoint: true}
        ]
      },
      params: {
        itemType: 'TEMP', topN: 5
      }
    }
  },
  /*========== 응답시간 ==========*/
  nmsResTopN: {
    Grid: {
      options: {
        columns: [
          {datafield: 'devName', text: '장비명', minwidth: '90', type: 'string'},
          {datafield: 'devIp', text: '장비IP', width: '70', type: 'string'},
          {datafield: 'perfVal', text: '응답시간', width: '100', cellsalign: 'right', type: 'int'}
        ],
        height: '200px',
        enablehover: false,
      },
      params: {
        itemType: 'RESP', topN: 5
      }
    },
    BarChart: {
      options: {
        tooltip: {
          shared: true,
          formatter: ChartFn.fnDevFormatter
        },
        series: [
          { name: '응답시간', xField: 'devName', yField: 'perfVal', userUnit: 'ms', colorByPoint: true}
        ]
      },
      params: {
        itemType: 'RESP', topN: 5
      }
    },
    ColumnChart: {
      options: {
        tooltip: {
          shared: true,
          formatter: ChartFn.fnDevFormatter
        },
        series: [
          { name: '응답시간', xField: 'devName', yField: 'perfVal', userUnit: 'ms', colorByPoint: true}
        ]
      },
      params: {
        itemType: 'RESP', topN: 5
      }
    },
    PieChart: {
      options: {
        tooltip: {
          shared: true,
          formatter: ChartFn.fnDevFormatter
        },
        series: [
          { name: '응답시간', xField: 'devName', yField: 'perfVal', userUnit: 'ms', colorByPoint: true}
        ]
      },
      params: {
        itemType: 'RESP', topN: 5
      }
    },
    PieDonutChart: {
      options: {
        tooltip: {
          shared: true,
          formatter: ChartFn.fnDevFormatter
        },
        series: [
          { name: '응답시간', xField: 'devName', yField: 'perfVal', userUnit: 'ms', colorByPoint: true}
        ]
      },
      params: {
        itemType: 'RESP', topN: 5
      }
    }
  },
  /*========== 세션 ==========*/
  nmsSessionTopN: {
    Grid: {
      options: {
        columns: [
          {datafield: 'devName', text: '장비명', minwidth: '90', type: 'string'},
          {datafield: 'devIp', text: '장비IP', width: '70', type: 'string'},
          {datafield: 'perfVal', text: '세션', width: '100', cellsalign: 'right', type: 'int'}
        ],
        height: '200px',
        enablehover: false,
      },
      params: {
        itemType: 'SESSION', topN: 5
      }
    },
    BarChart: {
      options: {
        tooltip: {
          shared: true,
          formatter: ChartFn.fnDevFormatter
        },
        series: [
          { name: '세션', xField: 'devName', yField: 'perfVal', colorByPoint: true }
        ]
      },
      params: {
        itemType: 'SESSION', topN: 5
      }
    },
    ColumnChart: {
      options: {
        tooltip: {
          shared: true,
          formatter: ChartFn.fnDevFormatter
        },
        series: [
          { name: '세션', xField: 'devName', yField: 'perfVal', colorByPoint: true }
        ]
      },
      params: {
        itemType: 'SESSION', topN: 5
      }
    },
    PieChart: {
      options: {
        tooltip: {
          shared: true,
          formatter: ChartFn.fnDevFormatter
        },
        series: [
          { name: '세션', xField: 'devName', yField: 'perfVal', colorByPoint: true }
        ]
      },
      params: {
        itemType: 'SESSION', topN: 5
      }
    },
    PieDonutChart: {
      options: {
        tooltip: {
          shared: true,
          formatter: ChartFn.fnDevFormatter
        },
        series: [
          { name: '세션', xField: 'devName', yField: 'perfVal', colorByPoint: true }
        ]
      },
      params: {
        itemType: 'SESSION', topN: 5
      }
    }
  },

  /*========== Traffic ==========*/
  nmsTrafficTopN: {
    Grid: {
      options: {
        columns: [
          {datafield: 'grpName', text: '그룹', width: '100', type: 'string', hidden:true},
          {datafield: 'devName', text: '장비명', minwidth: '100', type: 'string'},
          {datafield: 'ifName', text: '회선명', width: '120', type: 'string'},
          {datafield: 'devIp', text: 'IP', width: '100', type: 'string', hidden:true},
        ],
        // height: '200px',
        enablehover: false,
      },
      params: {
        itemType: 'TRAFFIC', topN: 5, ifInout: 'SUM'
      }
    },
    BarChart: {
      options: {
        tooltip: {
          shared: true,
          formatter: ChartFn.fnIfBpsFormatter
        },
        series: [
          { name: 'TRAFFIC', xField: 'ifName', yField: [], userUnit: '', colorByPoint: true}
        ]
      },
      params: {
        itemType: 'TRAFFIC', topN: 5, ifInout: 'SUM'
      }
    },
    BarStackChart: {
      options: {
        tooltip: {
          shared: true,
          formatter: ChartFn.fnIfBpsFormatter
        },
        series: [
          { name: 'TRAFFIC', xField: 'ifName', yField: [], userUnit: '', colorByPoint: true}
        ]
      },
      params: {
        itemType: 'TRAFFIC', topN: 5, ifInout: 'SUM'
      }
    },
    ColumnChart: {
      options: {
        tooltip: {
          shared: true,
          formatter: ChartFn.fnIfBpsFormatter
        },
        series: [
          { name: 'TRAFFIC', xField: 'ifName', yField: [], userUnit: '', colorByPoint: true}
        ]
      },
      params: {
        itemType: 'TRAFFIC', topN: 5, ifInout: 'SUM'
      }
    },
    ColumnStackChart: {
      options: {
        tooltip: {
          shared: true,
          formatter: ChartFn.fnIfBpsFormatter
        },
        series: [
          { name: 'TRAFFIC', xField: 'devName', yField: [], userUnit: '', colorByPoint: true}
        ]
      },
      params: {
        itemType: 'TRAFFIC', topN: 5, ifInout: 'SUM'
      }
    },
    ColumnChartGrid: {
      options: {
        gridOptions: {
          columns: [
            {datafield: 'grpName', text: '그룹', width: '100', type: 'string', hidden: true},
            {datafield: 'devName', text: '장비명', minwidth: '70', type: 'string'},
            {datafield: 'ifName', text: '회선명', width: '150', type: 'string'},
            {datafield: 'devIp', text: 'IP', width: '100', type: 'string', hidden: true}
          ],
          height: '55%'
        },
        chartOptions: {
          tooltip: {
            shared: true,
            formatter: ChartFn.fnIfBpsFormatter
          },
          series: [
            { name: 'TRAFFIC', xField: 'ifName', yField: [], userUnit: '', colorByPoint: true}
          ]
        }
      },
      params: {
        itemType: 'TRAFFIC', topN: 5, ifInout: 'SUM'
      }
    }
  },
  /*========== 장비 성능 현황 ==========*/
  nmsDevPerfStatus: {
    LineChart: {
      options: {
        tooltip: {
          shared: true,
          formatter: ChartFn.fnDevPerfFormatter
        },
        yAxis: {
          min: 0,
          max: 100,
          labels: {
            formatter:  function () {
                return this.value + ' %'
            }
          }
        },
        colors:['#86DDF4'],
        series: [
          { name:'', xField: 'dtYmdhms', yField: 'perfRate', userUnit: '%', userName: 'devName'}
        ]
      },
      params: {
        itemType: '1', period: 30
      }
    },
    AreaChart: {
      options: {
        tooltip: {
          shared: true,
          formatter: ChartFn.fnDevPerfFormatter
        },
        yAxis: {
          min: 0,
          max: 100,
          labels: {
            formatter:  function () {
                return this.value + ' %'
            }
          },
        },
        colors:['#86DDF4'],
        series: [
          { name:'', xField: 'dtYmdhms', yField: 'perfRate', userUnit: '%', userName: 'devName'}
        ]
      },
      params: {
        itemType: '1', period: 30
      }
    }
  },

  /*========== 회선 성능 현황 ==========*/
  nmsIfPerfStatus: {
    LineChart: {
      options: {
        tooltip: {
          shared: true,
          formatter: ChartFn.fnIfPerfFormatter
        },
        yAxis: {

        },
        legend: {
          enabled: true,
          align: 'center',
          verticalAlign: 'top',
          itemStyle : {
              fontSize : '10px'
          },
          paddingLeft:10,
          y:-10,
          labelFormatter: function () {
              return '<div style="color:'+ this.color +'">' +this.name+'</div>';
          }
        },
        colors: ['#85ddf4', '#f9899b', '#81e4c9', '#fcdb92', '#8fc0f6', '#f4add8', '#c2b6f1', '#3aadd9', '#d94452', '#35ba9b', '#f5b945', '#4a88da', '#d56fac', '#9579da' ],
        series: [
          { name: '', xField: 'dtYmdhms', yField: [], userUnit: '', colorByPoint: true}
        ]
      },
      params: {
        itemType: '1', period: 30, seriesType: 'dynamic', lastVisible: true
      }
    },
    AreaChart: {
      options: {
        tooltip: {
          shared: true,
          formatter: ChartFn.fnIfPerfFormatter
        },
        xAxis: {
          lineWidth: 0
        },
        yAxis: {

        },
        legend: {
          enabled: false,
          align: 'center',
          verticalAlign: 'top',
          itemStyle : {
              fontSize : '10px'
          },
          paddingLeft:10,
          y:-10,
          labelFormatter: function () {
              return '<div style="color:'+ this.color +'">' +this.name+'</div>';
          }
        },
        colors: ['#85ddf4', '#f9899b', '#81e4c9', '#fcdb92', '#8fc0f6', '#f4add8', '#c2b6f1', '#3aadd9', '#d94452', '#35ba9b', '#f5b945', '#4a88da', '#d56fac', '#9579da' ],
        series: [
          { name: '', xField: 'dtYmdhms', yField: [], userUnit: '', colorByPoint: true}
        ]
      },
      params: {
        itemType: '1', period: 30, seriesType: 'dynamic'
      }
    }
  }
}

export default WidgetItemNMS;
