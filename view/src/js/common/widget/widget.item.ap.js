import {ChartFn, GridFn } from './widget.tooltip.js';
import HmUtil from '../hm.util';

const WidgetItemAP = {
  /*========== AP현황(ap수/총수/접속자수) ==========*/
    apStatus: {
      ApStatus: {
        params: {
          authGrpNo: 1
        }
      },
    },
    /*========== AP별 장애시간 TopN ==========*/
    apEvtTimeTopByAp: {
      Grid: {
        options: {
          columns: [
            {datafield: 'apName', type: 'string', text: 'AP명', width: '50%'},
            {datafield: 'evtSumSec', type: 'number', text: '장애시간', width: '50%', cellsrenderer: GridFn.convertCTimerenderer},
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
            formatter: ChartFn.fnCTimeTooltip
          },
          yAxis: {
            labels: {formatter: ChartFn.fnCTimeFormatter}
          },
          series: [
            { name: '장애시간', xField: 'apName', yField: 'evtSumSec'}
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
            formatter: ChartFn.fnCTimeTooltip
          },
          series: [
            { name: '장애시간', xField: 'apName', yField: 'evtSumSec', colorByPoint: true}
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
            formatter: ChartFn.fnCTimeTooltip
          },
          series: [
            { name: '장애시간', xField: 'apName', yField: 'evtSumSec', colorByPoint: true}
          ]
        },
        params: {
          topN: 5
        }
      }
    },
  /*========== 전체 클라이언트 추이 ==========*/
  apClientAnalysis: {
    LineChart: {
      options: {
        tooltip: {
          shared: true,
          formatter: ChartFn.fnDateFormatter
        },
        colors:['#86DDF4'],
        series: [
          { name:'접속수', xField: 'dt', yField: 'connCnt'}
        ]
      },
    },
    AreaChart: {
      options: {
        tooltip: {
          shared: true,
          formatter: ChartFn.fnDateFormatter
        },
        colors:['#86DDF4'],
        series: [
          { name:'접속수', xField: 'dt', yField: 'connCnt'}
        ]
      },
    },
    ColumnChart: {
      options: {
        tooltip: {
          shared: true,
          formatter: ChartFn.fnDateFormatter
        },
        series: [
          { name:'접속수', xField: 'dt', yField: 'connCnt'}
        ]
      },
      params: {
        xType: 'time'
      }
    },
  },
  /*========== 시간대별 최대 동접자 ==========*/
  apMaxCCUByTime: {
    LineChart: {
      options: {
        tooltip: {
          shared: true,
          formatter: ChartFn.fnDateFormatter
        },
        colors:['#86DDF4'],
        series: [
          { name:'최대동접자', xField: 'dt', yField: 'connCnt'}
        ]
      },
      params: {
        itemType: '1'
      }
    },
    AreaChart: {
      options: {
        tooltip: {
          shared: true,
          formatter: ChartFn.fnDateFormatter
        },
        colors:['#86DDF4'],
        series: [
          { name:'최대동접자', xField: 'dt', yField: 'connCnt'}
        ]
      },
      params: {
        itemType: '1'
      }
    },
    ColumnChart: {
      options: {
        tooltip: {
          shared: true,
          formatter: ChartFn.fnDateFormatter
        },
        series: [
          { name:'최대동접자', xField: 'dt', yField: 'connCnt'}
        ]
      },
      params: {
        xType: 'time'
      }
    },
  },
  /*========== 트래픽 사용량 추이 ==========*/
  apTrafficAnalysis: {
    LineChart: {
      options: {
        tooltip: {
          shared: true,
          formatter: ChartFn.fnDateFormatter
        },
        colors:['#86DDF4'],
        series: [
          { name:'사용량', xField: 'dt', yField: 'byte', }
        ]
      },
    },
    AreaChart: {
      options: {
        tooltip: {
          shared: true,
          formatter: ChartFn.fnDateFormatter
        },
        colors:['#86DDF4'],
        series: [
          { name:'사용량', xField: 'dt', yField: 'byte'}
        ]
      },
    },
    ColumnChart: {
      options: {
        tooltip: {
          shared: true,
          formatter: ChartFn.fnDateFormatter
        },
        series: [
          { name:'사용량', xField: 'dt', yField: 'byte'}
        ]
      },
      params: {
        xType: 'time'
      }
    },
  },
  /*========== 시간대별 최대 트래픽 ==========*/
  apMaxTrafficByTime: {
    LineChart: {
      options: {
        tooltip: {
          shared: true,
          formatter: ChartFn.fnDateFormatter
        },
        colors:['#86DDF4'],
        series: [
          { name:'사용량', xField: 'dt', yField: 'byte'}
        ]
      },
      params: {
        itemType: '1'
      }
    },
    AreaChart: {
      options: {
        tooltip: {
          shared: true,
          formatter: ChartFn.fnDateFormatter
        },
        colors:['#86DDF4'],
        series: [
          { name:'사용량', xField: 'dt', yField: 'byte'}
        ]
      },
      params: {
        itemType: '1'
      }
    },
    ColumnChart: {
      options: {
        tooltip: {
          shared: true,
          formatter: ChartFn.fnDateFormatter
        },
        series: [
          { name:'사용량', xField: 'dt', yField: 'byte'}
        ],
        xAxis: {
          tickInterval :1000 * 3600 * 4,
        }
      },
      params: {
        xType: 'time'
      }
    },
  },
  /*========== 클라이언트별 트래픽 사용량 TopN ==========*/
  apHighTrafficByClient: {
    Grid: {
      options: {
        columns: [
          {datafield: 'connName', type: 'string', text: '접속자', width: '60%'},
          {datafield: 'byte', type: 'number', text: '사용량', width: '40%', cellsrenderer: GridFn.unit1024renderer},
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
          formatter: ChartFn.fnUnit1000Tooltip
        },
        series: [
          { name: '사용량', xField: 'connName', yField: 'byte'}
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
          formatter: ChartFn.fnUnit1000Tooltip
        },
        series: [
          { name: '사용량', xField: 'connName', yField: 'byte'}
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
          formatter: ChartFn.fnUnit1000Tooltip
        },
        series: [
          { name: '사용량', xField: 'connName', yField: 'byte'}
        ]
      },
      params: {
        topN: 5
      }
    }
  },
  /*========== AP별 트래픽 사용량 TopN ==========*/
  apHighTrafficByAp: {
    Grid: {
      options: {
        columns: [
          {datafield: 'apName', type: 'string', text: 'AP명', width: '60%'},
          {datafield: 'byte', type: 'number', text: '샤용량', width: '40%', cellsrenderer: GridFn.unit1024renderer},
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
          formatter: ChartFn.fnUnit1000Tooltip
        },
        series: [
          { name: '사용량', xField: 'apName', yField: 'byte'}
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
          formatter: ChartFn.fnUnit1000Tooltip
        },
        series: [
          { name: '사용량', xField: 'apName', yField: 'byte', colorByPoint: true}
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
          formatter: ChartFn.fnUnit1000Tooltip
        },
        series: [
          { name: '사용량', xField: 'apName', yField: 'byte', colorByPoint: true}
        ]
      },
      params: {
        topN: 5
      }
    }
  },
  /*========== AP별 트래픽 사용량 LowN ==========*/
  apLowTrafficByAp: {
    Grid: {
      options: {
        columns: [
          {datafield: 'apName', type: 'string', text: 'AP명', width: '60%'},
          {datafield: 'byte', type: 'number', text: '샤용량', width: '40%', cellsrenderer: GridFn.unit1024renderer},
        ],
        // height: '200px',
        enablehover: false,
      },
      params: {
        lowN: 5
      }
    },
    BarChart: {
      options: {
        tooltip: {
          shared: true,
          formatter: ChartFn.fnUnit1000Tooltip
        },
        series: [
          { name: '사용량', xField: 'apName', yField: 'byte'}
        ]
      },
      params: {
        lowN: 5
      }
    },
    PieChart: {
      options: {
        tooltip: {
          shared: true,
          formatter: ChartFn.fnUnit1000Tooltip
        },
        series: [
          { name: '사용량', xField: 'apName', yField: 'byte', colorByPoint: true}
        ]
      },
      params: {
        lowN: 5
      }
    },
    PieDonutChart: {
      options: {
        tooltip: {
          shared: true,
          formatter: ChartFn.fnUnit1000Tooltip
        },
        series: [
          { name: '사용량', xField: 'apName', yField: 'byte', colorByPoint: true}
        ]
      },
      params: {
        lowN: 5
      }
    }
  },
  /*========== AP별 클라이언트 TopN ==========*/
  apHighClientByAp: {
    Grid: {
      options: {
        columns: [
          {datafield: 'apName', type: 'string', text: 'AP명', width: '50%'},
          {datafield: 'connCnt', type: 'number', text: '접속수', width: '50%'},
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
          formatter: ChartFn.fnUnit1000Tooltip
        },
        yAxis: {
          // labels: {formatter: ChartFn.fnCTimeFormatter}
        },
        series: [
          { name: '접속수', xField: 'apName', yField: 'connCnt'}
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
          // formatter: ChartFn.fnCTimeTooltip
        },
        series: [
          { name: '접속수', xField: 'apName', yField: 'connCnt'}
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
          // formatter: ChartFn.fnCTimeTooltip
        },
        series: [
          { name: '접속수', xField: 'apName', yField: 'connCnt'}
        ]
      },
      params: {
        topN: 5
      }
    }
  },
  /*========== AP별 클라이언트 LowN ==========*/
  apLowClientByAp: {
    Grid: {
      options: {
        columns: [
          {datafield: 'apName', type: 'string', text: 'AP명', width: '50%'},
          {datafield: 'connCnt', type: 'number', text: '접속수', width: '50%'},
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
          // formatter: ChartFn.fnCTimeTooltip
        },
        yAxis: {
          // labels: {formatter: ChartFn.fnCTimeFormatter}
        },
        series: [
          { name: '접속수', xField: 'apName', yField: 'connCnt'}
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
          formatter: ChartFn.fnCTimeTooltip
        },
        series: [
          { name: '접속수', xField: 'apName', yField: 'connCnt'}
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
          formatter: ChartFn.fnCTimeTooltip
        },
        series: [
          { name: '접속수', xField: 'apName', yField: 'connCnt'}
        ]
      },
      params: {
        topN: 5
      }
    }
  },
  /*========== OS별 클라이언트 접속 현황 ==========*/
  apClientStateByOs: {
    Grid: {
      options: {
        columns: [
          {datafield: 'connOsType', type: 'string', text: 'OS', width: '50%'},
          {datafield: 'connCnt', type: 'number', text: '접속수', width: '50%'},
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
          // formatter: ChartFn.fnCTimeTooltip
        },
        series: [
          { name: '접속수', xField: 'connOsType', yField: 'connCnt'}
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
          formatter: ChartFn.fnCTimeTooltip
        },
        series: [
          { name: '접속수', xField: 'connOsType', yField: 'connCnt'}
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
          formatter: ChartFn.fnCTimeTooltip
        },
        series: [
          { name: '접속수', xField: 'connOsType', yField: 'connCnt'}
        ]
      },
      params: {
        topN: 5
      }
    }
  },
  /*========== OS별 트래픽 사용 현황 ==========*/
  apTrafficStateByOs: {
    Grid: {
      options: {
        columns: [
          {datafield: 'connOsType', type: 'string', text: 'OS', width: '50%'},
          {datafield: 'byte', type: 'number', text: '사용량', width: '50%'},
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
          formatter: ChartFn.fnUnit1000Tooltip
        },
        series: [
          { name: '사용량', xField: 'connOsType', yField: 'byte'}
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
          formatter: ChartFn.fnUnit1000Tooltip
        },
        series: [
          { name: '사용량', xField: 'connOsType', yField: 'connOsType'}
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
          formatter: ChartFn.fnUnit1000Tooltip
        },
        series: [
          { name: '사용량', xField: 'connOsType', yField: 'connOsType'}
        ]
      },
      params: {
        topN: 5
      }
    }
  },
}

export default WidgetItemAP;
