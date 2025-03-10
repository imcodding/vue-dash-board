<template>
  <div class="popBox">
    <div class="searchBox" style="margin-bottom: 10px;">
      <!--<div class="searchPrctn">※ [저장] 버튼 클릭 시 적용됩니다.</div>-->
      <div class="searchBtn" style="float: right;">
        <button class="whiteBtn btn_ico_75" @click="moveDown()"></button>
        <button class="whiteBtn btn_ico_74" @click="moveUp()"></button>
      </div>
	  </div>
    <Grid ref="col" id="grid"></Grid>
    <div class="p_bottom_layer">
<!--      <button class="btn" @click="applyImg">적용</button>-->
      <button class="btn" @click="save()">저장</button>
      <button class="btn" @click="close()">취소</button>
    </div>
  </div>
</template>

<script>
import { select } from 'd3';
import Grid from '../../jqx/Grid.vue'
export default {
  components: {
    Grid
  },
  created() {
    this.selectedParams = this.$store.state.dash.popupParams;
  },
  mounted() {
    this.grid = this.$refs.col.$refs.grid

    this.$hmGrid.create(this.grid, {
      columns: [
        {text: '컬럼표시명', datafield: 'colText', width: '60%', columntype: 'string', editable: true},
        {text: '표시순서', datafield: 'colSortIdx', width: '20%', cellsalign: 'center', columntype: 'number'},
        {text: '표시여부', datafield: 'colDispFlag', columntype: 'checkbox', width: '20%'}
      ],
      height: '200px',
      editable: true,
      autoheight: false
    });

    const selectedGrid = this.selectedParams.grid;
    const records = selectedGrid.columns.records;

    let data = [];
    for(let record of records) {
      data.push({
        colDatafield: record.datafield,
        colText: record.text,
        colSortIdx: record.visibleindex,
        colDispFlag: record.hidden ? 0 : 1
      })
    }

    this.$hmGrid.setLocalData(this.grid, data)
  },
  data() {
    return {
      selectedParams: null,
      grid: null
    }
  },
  methods: {
    save() {

      let rows = this.grid.getrows();

      // axios 저장
      let params = {};
      params.list = rows;
      params.gridId = this.selectedParams.gridId;
      params.reqUrl = '/dash/' + this.selectedParams.seq;

      const idx = this.selectedParams.idx;
      this.$axios.post('/api/cfg/saveGrid', params).then(()=>{
        alert('저장되었습니다.');
        this.$store.dispatch('rect/setRectValue', {idx:idx, valueKey: 'curTime'})
        this.close();
      });
    },
    close() {
      this.$store.dispatch('dash/closePopup');
    },

    moveDown() {
      const idx = this.grid.getselectedrowindex();
      if(idx < 0) {
        alert('항목을 선택하세요.');
        return;
      }

      const lastIdx = this.grid.getboundrows().length - 1;
      let rowData = this.grid.getrowdata(idx);
      if(rowData.visibleindex == lastIdx) return;

      let newIdx = rowData.visibleindex + 1

      this.grid.beginupdate();
      this.grid.deleterow(rowData.uid);
      this.grid.addrow(null, rowData, newIdx);
      this.grid.endupdate();
      this.grid.selectrow(newIdx);
      this.grid.ensurerowvisible(newIdx);
    },

    moveUp() {
      const idx = this.grid.getselectedrowindex();
      if(idx < 0) {
        alert('항목을 선택하세요.');
        return;
      }

      let rowData = this.grid.getrowdata(idx);
      if(rowData.visibleindex == 0) return;

      var newIdx = rowData.visibleindex - 1;
      this.grid.beginupdate();
      this.grid.deleterow(rowData.uid);
      this.grid.addrow(null, rowData, newIdx);
      this.grid.endupdate();
      this.grid.selectrow(newIdx);
      this.grid.ensurerowvisible(newIdx);

    }
  }
}
</script>

<style>
</style>
