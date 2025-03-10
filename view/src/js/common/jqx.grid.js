import axios from 'axios';
import HmUtil from '../../js/common/hm.util';
/**
 * jqx.grid function
 * @author sooyun, imhojong
 * @since 2023.07.09
 */

export default {
  install(app) {
    app.prototype.$hmGrid = {

      /** grid 생성 */
      create: function(ref, options, params) {
        if(params !== undefined){ //undefined == 컬럼관리, 장비목록 팝업 등 일반 형태의 그리드.
          if (params.itemType === 'TRAFFIC') {
            //동적컬럼 그리드
            this.createDynamic(ref, options, params);
            return
          }
        }

        let defOptions = {}
        defOptions.columns = options.columns;

        Object.assign(defOptions, this.getDefaultOptions(), options);

        //pageable 미사용일 경우 높이값 영역 제거
        if(defOptions.pageable !== undefined){
            if (defOptions.pageable) {
                defOptions.pageable = true;
                defOptions.pagermode = 'simple';
                defOptions.pagerheight = 27;
                defOptions.pagesizeoptions = ["1000", "5000", "10000"];
            }
        }

        // 컬럼명 정렬
        for(const value of defOptions.columns) {
            value.align = 'center';
        }

        if(!params) {
          ref.setOptions(defOptions);
          return;
        }
        // 컬럼관리
        let newColumns = []
        axios.get('/api/cfg/getGrid', {
          params: {
            gridId: params.gridId,
            reqUrl: '/dash/' + params.seq
          }}).then((rows)=> {
            for(const row of rows) {
              for(let col of options.columns) {
                if(row.colDatafield == col.datafield) {
                  col.text = row.colText;
                  col.visibleindex = row.colSortIdx;
                  col.hidden = !row.colDispFlag;
                  newColumns.push(col);
                  break;
                }
              }
              defOptions.columns = newColumns;
            }
            ref.setOptions(defOptions);
        })

      },

      createDynamic: function(ref, options, params) {
        //item.x.js 에서 선언된 기본 컬럼들
        var defCol = JSON.parse(JSON.stringify(options.columns));
        let defOptions = {}

        defOptions.columns = options.columns;
        Object.assign(defOptions, this.getDefaultOptions(), options);

        //pageable 미사용일 경우 높이값 영역 제거
        if(defOptions.pageable !== undefined){
            if (defOptions.pageable) {
                defOptions.pageable = true;
                defOptions.pagermode = 'simple';
                defOptions.pagerheight = 27;
                defOptions.pagesizeoptions = ["1000", "5000", "10000"];
            }
        }

        //위젯&지표별 동적 컬럼 생성.
        //param1: 위젯그리드종류(트래픽..)
        //param2: 지표 종류(inbps,outbps)
        var dynamicCol = HmUtil.getColByType(params.itemType, params.ifInout);
        for(let col of dynamicCol){
          defCol.push(col)
        }
        defOptions.columns = defCol;

        // 컬럼명 정렬
        for(const value of defOptions.columns) {
            value.align = 'center';
        }

        if(!params) {
          ref.setOptions(defOptions);
          return;
        }
        // 컬럼관리
        let newColumns = []
        axios.get('/api/cfg/getGrid', {
          params: {
            gridId: params.gridId,
            reqUrl: '/dash/' + params.seq
          }}).then((rows)=> {

            for(const row of rows) {
              for(let col of defCol) {
                if(row.colDatafield == col.datafield) {
                  col.text = row.colText;
                  col.visibleindex = row.colSortIdx;
                  col.hidden = !row.colDispFlag;
                  newColumns.push(col);
                  break;
                }
              }
              defOptions.columns = newColumns;
            }

            ref.setOptions(defOptions);
        })

      },

      setLocalData: function(ref, data) {
          ref.source._source.localdata = data;
          ref.updatebounddata();
      },

      /** grid 데이터 갱신 type1 (부모+자식 모든 target 제어)
       *  ref 타입이 this.$refs.test2.$refs.testGrid2
       *  부모의 ref + 자식의 ref 모두 인자 값으로 전달 필요
       *  _source 객체에 localdata 값 세팅 후 ref 객체 updatebounddata() 처리
      **/
      refreshData: function(ref, url, params) {
        axios.get(url, { params: params })
        .then(function(response) {
          ref.clear();
          ref.source._source.localdata = response;
          ref.updatebounddata();
        })
        .catch(function(error) {
            console.log(error);
        });
      },

      /** grid 데이터 갱신 type2 (부모 target 만 제어)
       *  ref 타입이 this.$refs.test2
       *  부모의 ref 한개만을 인자로 전달(자식 관련 값 전달 X)
       *  return data인 dataAdapter 에 dataBind() 처리
      **/
      refreshDataBind: function (ref, url) {
        axios.get(url, {})
            .then(function (response) {
                ref.source.localdata = response;
                ref.dataAdapter.dataBind();
            })
            .catch(function (error) {
                console.log(error);
            });
      },

      /**  row 순서 생성 */
      rownumrenderer: function (row, columnfield, value, defaulthtml, columnproperties) {
              var _class = 'jqx-right-align';
              if (columnproperties.cellsalign !== undefined) {
                  _class = 'jqx-' + columnproperties.cellsalign + '-align';
              }
              return "<div style='margin-top: 7px; margin-right: 5px' class='" + _class + "'>" + (row + 1) + "</div>";
      },

      evtLevelrenderer: function (row, datafield, value, defaultHTML) {
        let color = ''
        switch(value) {
          case '정보': color = '#1428A0'; break;
          case '주의': color = '#FFE417'; break;
          case '알람': color = '#FFCD00'; break;
          case '경보': color = '#FF9A00'; break;
          case '장애': color = '#F64431'; break;
        }
        return '<div class="jqx-center-align" style="height:100%;padding-top:4px; background:' + color  + '">' + value +'</div>'
      },

      /** jqxGrid 옵션 기본설정 */
      getDefaultOptions: function() {

          return {
              width: "100%",
              height: "100%",
              autoheight: true, /* loading slow */
              autorowheight: false, /* loading slow */
              theme: 'material-green',
              columnsresize: true,
              showstatusbar: false,
              selectionmode: "singlerow",
              enabletooltips: true,
              columnsheight: 28,
              rowsheight: 28,
              pageable:false,
              filterable:false,
              filterrowheight: 30,
              showfilterrow:"true",
              toolbarheight: 30,
              sortable: true,
              altrows: false,
              enablebrowserselection: true,
              showpinnedcolumnbackground: false,
              showsortcolumnbackground: false
          };
      },
    }
  }
}
