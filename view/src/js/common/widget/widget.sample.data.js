//import Widget from '../widget/widget.control'
const WidgetSample = {
    getGridLocalData: function (options) {
      const gridColumn = options.columns;
      const data = [];

      for (let i = 1; i <= 5; i++) {
        const temp = {}
        for(let j in gridColumn){
          const type = gridColumn[j].type;
          const datafield = gridColumn[j].datafield + '_';
          const ranVal = Math.floor(Math.random() * 100);
          temp[gridColumn[j].datafield] = type == 'string' ? datafield : ranVal;
        }
        data.push(temp)
      }
      data.sort(function (a, b) {
        return b.val - a.val
      });

      //숫자 값 정렬 이후 한글 컬럼값 index 순서 등록
      for(let i in data){
        let index = parseInt(i) + 1;
        for(let j in Object.keys(data[i])){
          let objVal = data[i][Object.keys(data[i])[j]];
          if(typeof objVal === 'string' && objVal.indexOf('_') > -1){
            data[i][Object.keys(data[i])[j]] = data[i][Object.keys(data[i])[j]] + index
          }

        }
      }
      return data
    },

    getChartLocalData: function (info) {
      const chartCategory = info.category;
      const chartField = info.field;

      const data = [];
      for (let i = 1; i <= 5; i++) {
        const temp = {};
        temp[chartCategory]= chartCategory + '_';
        temp[chartField] = Math.floor(Math.random() * 100);
        data.push(temp)
      }
      data.sort(function (a, b) {
        return b.val - a.val
      });

      //숫자 값 정렬 이후 한글 컬럼값 index 순서 등록
      for(let i in data){
        let index = parseInt(i) + 1;
        for (let j in Object.keys(data[i])) {
          let objVal = data[i][Object.keys(data[i])[j]];
          if (typeof objVal === 'string' && objVal.indexOf('_') > -1) {
            data[i][Object.keys(data[i])[j]] = data[i][Object.keys(data[i])[j]] + index
          }

        }
      }


      return data
    },

}

export default WidgetSample;
