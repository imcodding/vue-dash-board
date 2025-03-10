import {ChartFn, GridFn} from './widget.tooltip.js';

const WidgetItemSMS = {
  /*========== CPU ==========*/
  smsCpuTopN: {
    Grid: {
      options: {
        columns: [
          {datafield: 'grpName', type: 'string', text: '그룹', width: '25%'},
          {datafield: 'devName', type: 'string', text: '서버', width: '35%'},
          {datafield: 'devIp', type: 'string', text: 'IP', width: '20%'},
          {datafield: 'perfVal', type: 'number', text: 'CPU', width: '20%', cellsalign: 'right'}
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
            {datafield: 'devName', text: '장비명', width: '40%', type: 'string'},
            {datafield: 'devIp', text: '장비IP', width: '40%', type: 'string'},
            {datafield: 'perfVal', text: 'CPU', width: '20%', cellsalign: 'right', type: 'int'}
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
  smsMemTopN: {
    Grid: {
      options: {
        columns: [
          {datafield: 'grpName', type: 'string', text: '그룹', width: '25%'},
          {datafield: 'devName', type: 'string', text: '서버', width: '35%'},
          {datafield: 'devIp', type: 'string', text: 'IP', width: '20%'},
          {datafield: 'perfVal', type: 'number', text: 'MEM', width: '20%', cellsalign: 'right'}
        ],
        // height: '200px',
        enablehover: false,
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
            {datafield: 'devName', text: '장비명', width: '40%', type: 'string'},
            {datafield: 'devIp', text: '장비IP', width: '40%', type: 'string'},
            {datafield: 'perfVal', text: 'CPU', width: '20%', cellsalign: 'right', type: 'int'}
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
  /*========== Filesystem ==========*/
  smsFilesystemTopN: {
    Grid: {
      options: {
        columns: [
          {datafield: 'grpName', type: 'string', text: '그룹', width: 80},
          {datafield: 'devName', type: 'string', text: '서버', minwidth: 100},
          {datafield: 'devIp', type: 'string', text: 'IP', width: 100},
          {datafield: 'mountPoint', type: 'string', text: '경로', minwidth: 100},
          // {datafield: 'usedPct', type: 'number', text: '사용율', width: 80, cellsrenderer: HmGrid.progressbarrenderer},
          // {datafield: 'totalSize', type: 'number', text: '전체량', width: 80, cellsrenderer: HmGrid.unit1024renderer},
          // {datafield: 'usedSize', type: 'number', text: '사용량', width: 80, cellsrenderer: HmGrid.unit1024renderer}
        ],
        // height: '200px',
        enablehover: false,
      },
      params: {
        topN: 5
      }
    },
    BarChart: {
      options: {
        tooltip: {
          shared: true,
          formatter: ChartFn.fnSvrFilesystemFormatter
        },
        series: [
          { name: '사용율', xField: 'devName', yField: 'usedPct', userUnit: '%', colorByPoint: true}
        ]
      },
      params: {
        topN: 5
      }
    },
    ColumnChart: {
      options: {
        tooltip: {
          shared: true,
          formatter: ChartFn.fnSvrFilesystemFormatter
        },
        series: [
          { name: '사용율', xField: 'devName', yField: 'usedPct', userUnit: '%', colorByPoint: true}
        ]
      },
      params: {
        topN: 5
      }
    },
    PieChart: {
      options: {
        tooltip: {
          shared: true,
          formatter: ChartFn.fnSvrFilesystemFormatter
        },
        series: [
          { name: '사용율', xField: 'devName', yField: 'usedPct', userUnit: '%', colorByPoint: true}
        ]
      },
      params: {
        topN: 5
      }
    },
    PieDonutChart: {
      options: {
        tooltip: {
          shared: true,
          formatter: ChartFn.fnSvrFilesystemFormatter
        },
        series: [
          { name: '사용율', xField: 'devName', yField: 'usedPct', userUnit: '%', colorByPoint: true}
        ]
      },
      params: {
        topN: 5
      }
    }
  },
  /*========== Traffic TopN ==========*/
  smsTrafficTopN: {
    Grid: {
      options: {
        columns: [
          {datafield: 'grpName', text: '그룹', width: '100', type: 'string'},
          {datafield: 'devName', text: '장비명', minwidth: '100', type: 'string'},
          {datafield: 'ifName', text: '네트워크', width: '150', type: 'string'},
          {datafield: 'devIp', text: 'IP', width: '100', type: 'string'},
          {datafield: 'inbps', text: 'IN BPS', width: '80', cellsrenderer: GridFn.unit1000renderer },
          {datafield: 'outbps', text: 'OUT BPS', width: '80', cellsrenderer: GridFn.unit1000renderer }
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
          formatter: ChartFn.fnDevFormatter
        },
        series: [
          { name: 'TRAFFIC', xField: 'ifName', yField: 'inbps', userUnit: '', colorByPoint: true}
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
  },

  /*========== 프로세스 CPU ==========*/
  smsProcessCpuTopN: {
    Grid: {
      options: {
        columns: [
          {datafield: 'grpName', type: 'string', text: '그룹', width: 80},
          {datafield: 'devName', type: 'string', text: '서버', minwidth: 100},
          {datafield: 'processName', type: 'string', text: '프로세스', minwidth: 100},
          {datafield: 'devIp', type: 'string', text: 'IP', width: 100},
          {datafield: 'cpuPct', type: 'number', text: 'CPU', width: 80, cellsrenderer: GridFn.progressbarrenderer},
          {datafield: 'memPct', type: 'number', text: 'MEM', width: 80, cellsrenderer: GridFn.progressbarrenderer}
        ],
        enablehover: false
      }
    },
    BarNegativeChart: {
      options: {
        tooltip: {
          shared: true,
          formatter: ChartFn.fnSvrProcessFormatter,
        },
        series: [
          {name: 'CPU', xField: 'disText', yField: 'cpuPct', userUnit: '%'},
          {name: 'MEM', xField: 'disText', yField: 'memPct', userUnit: '%'}
        ]
      },
      params: { itemType: 'CPU' , topN: 5 }
    },
  },
  /*========== 프로세스 Memory ==========*/
  smsProcessMemTopN: {
    Grid: {
      options: {
        columns: [
          {datafield: 'grpName', type: 'string', text: '그룹', width: 80},
          {datafield: 'devName', type: 'string', text: '서버', minwidth: 100},
          {datafield: 'processName', type: 'string', text: '프로세스', minwidth: 100},
          {datafield: 'devIp', type: 'string', text: 'IP', width: 100},
          {datafield: 'cpuPct', type: 'number', text: 'CPU', width: 80, cellsrenderer: GridFn.progressbarrenderer},
          {datafield: 'memPct', type: 'number', text: 'MEM', width: 80, cellsrenderer: GridFn.progressbarrenderer}
        ],
        enablehover: false
      }
    },
    BarNegativeChart: {
      options: {
        tooltip: {
          shared: true,
          formatter: ChartFn.fnSvrProcessFormatter,
        },
        series: [
          {name: 'CPU', xField: 'disText', yField: 'cpuPct', userUnit: '%'},
          {name: 'MEM', xField: 'disText', yField: 'memPct', userUnit: '%'}
        ]
      },
      params: { itemType: 'CPU' , topN: 5 }
    },
  },
  /*========== 감시프로세스 CPU ==========*/
  smsMonitoringProcessCpuTopN: {
    Grid: {
      options: {
        columns: [
          {datafield: 'grpName', type: 'string', text: '그룹', width: 80},
          {datafield: 'devName', type: 'string', text: '서버', minwidth: 100},
          {datafield: 'processName', type: 'string', text: '프로세스', minwidth: 100},
          {datafield: 'devIp', type: 'string', text: 'IP', width: 100},
          {datafield: 'cpuPct', type: 'number', text: 'CPU', width: 80, cellsrenderer: GridFn.progressbarrenderer},
          {datafield: 'memPct', type: 'number', text: 'MEM', width: 80, cellsrenderer: GridFn.progressbarrenderer}
        ],
        enablehover: false
      }
    },
    BarNegativeChart: {
      options: {
        tooltip: {
          shared: true,
          formatter: ChartFn.fnSvrProcessFormatter,
        },
        series: [
          {name: 'CPU', xField: 'disText', yField: 'cpuPct', userUnit: '%'},
          {name: 'MEM', xField: 'disText', yField: 'memPct', userUnit: '%'}
        ]
      },
      params: { itemType: 'CPU' , topN: 5 }
    },
  },
  /*========== 감시프로세스 Memory ==========*/
  smsMonitoringProcessMemTopN: {
    Grid: {
      options: {
        columns: [
          {datafield: 'grpName', type: 'string', text: '그룹', width: 80},
          {datafield: 'devName', type: 'string', text: '서버', minwidth: 100},
          {datafield: 'processName', type: 'string', text: '프로세스', minwidth: 100},
          {datafield: 'devIp', type: 'string', text: 'IP', width: 100},
          {datafield: 'cpuPct', type: 'number', text: 'CPU', width: 80, cellsrenderer: GridFn.progressbarrenderer},
          {datafield: 'memPct', type: 'number', text: 'MEM', width: 80, cellsrenderer: GridFn.progressbarrenderer}
        ],
        enablehover: false
      }
    },
    BarNegativeChart: {
      options: {
        tooltip: {
          shared: true,
          formatter: ChartFn.fnSvrProcessFormatter,
        },
        series: [
          {name: 'CPU', xField: 'disText', yField: 'cpuPct', userUnit: '%'},
          {name: 'MEM', xField: 'disText', yField: 'memPct', userUnit: '%'}
        ]
      },
      params: { itemType: 'CPU' , topN: 5 }
    },
  }
}

export default WidgetItemSMS;
