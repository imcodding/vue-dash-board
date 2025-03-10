<template>
  <div class="popBox">

    <div class="searchBox" style="margin-bottom: 10px;">

      <div style="display: inline-block; margin-top: 2px">
        <div style="display: inline;">
            <label style="color: grey; font-size: 13px;">사용</label>
            <label class="switch">
              <input type="checkbox" id="tabUse">
              <span class="slider round"></span>
            </label>
        </div>
        <div style="display: inline;">
            <label style="color: grey; font-size: 13px;">로테이션</label>
            <label class="switch">
              <input type="checkbox" id="tabRotation">
              <span class="slider round"></span>
            </label>
        </div>
      </div>
      <div class="searchBtn" style="float: right;">
        <button class="whiteBtn btn_ico_07" @click="addTab()"></button>
        <button class="whiteBtn btn_ico_77" @click="delTab()"></button>
        <button class="whiteBtn btn_ico_75" @click="moveDown()"></button>
        <button class="whiteBtn btn_ico_74" @click="moveUp()"></button>
      </div>
	  </div>
    <JqxGrid ref="tabGrid" />
    <div class="p_bottom_layer">
<!--      <button class="btn" @click="applyImg">적용</button>-->
      <button class="btn" @click="save()">저장</button>
      <button class="btn" @click="close()">취소</button>
    </div>
  </div>
</template>

<script>
  /**
   * 탭은 default 로 1개가 생성되어 있음.
   */
  import JqxGrid from '@/lib/jqwidgets/vue/vue_jqxgrid.vue'
export default {
  components: {
    JqxGrid
  },

  mounted() {
    this.grid = this.$refs.tabGrid;

    this.$hmGrid.create(this.grid, {
      columns: [
        {text: '탭번호', datafield: 'tabSeq', width: '10%', columntype: 'number', hidden: true},
        {text: '탭명칭', datafield: 'tabName', width: '50%', columntype: 'string', editable: true},
        {text: '순서', datafield: 'tabIdx', width: '20%', cellsalign: 'center', columntype: 'number'},
        {text: '사용여부', datafield: 'useFlag', columntype: 'checkbox', width: '30%'}
      ],
      height: '200px',
      editable: true
    });

    $("input[id='tabUse']").prop('checked', this.$store.state.set.tabUse);
    $("input[id='tabRotation']").prop('checked', this.$store.state.set.tabRotation);

    this.$hmGrid.setLocalData(this.grid, this.$store.state.set.tabs);
  },

  data() {
    return {
      grid: null,
      currTabUse: 0,
      delList: []
    }
  },
  methods: {

    addTab() {
      this.grid.addrow(0, {useFlag: 1})
    },

    delTab() {
      const selectedIdx = this.grid.getselectedrowindex();
      const uid = this.grid.getrowid(selectedIdx);
      if(uid === 0) {
        alert('기본탭은 삭제할 수 없습니다.');
        return;
      }
      const row = this.grid.getrowdatabyid(uid);

      this.delList.push(row);

      this.grid.deleterow(uid)
    },

    save() {
      if(!this.validation()) return;

      let params = {};

      let tabConfList = [];
      tabConfList.push({dashKey:'TAB', value: this.getCheck('tabUse')});
      tabConfList.push({dashKey:'TAB_ROTATION', value: this.getCheck('tabRotation')});

      params.tabList = this.grid.getrows();
      params.list = tabConfList;
      params.delTabList = this.delList;

      this.$store.dispatch('set/addTab', params);

      alert('저장되었습니다.');

      history.go(0); // 새로고침

      this.close();
    },

    close() {
      this.$emit('close')
    },

    validation() {
      const tabs = this.grid.getrows();
      if(tabs.length === 0 && this.delList.length === 0) {
        alert('변경사항이 없습니다.');
        return false;
      }

      if(tabs.length === 0) {
        alert('1개 이상의 탭을 생성해주세요.');
        return false;
      }

      if(this.getCheck('tabRotation') && tabs.length <= 1) {
        alert('로테이션은 2개 이상의 탭부터 가능합니다.');
        return false;
      }
      return true;
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

      if(rowData.uid === 0) { alert('기본탭은 이동할 수 없습니다.'); return; }

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

      if(rowData.uid === 0) { alert('기본탭은 이동할 수 없습니다.'); return; }

      var newIdx = rowData.visibleindex - 1;
      this.grid.beginupdate();
      this.grid.deleterow(rowData.uid);
      this.grid.addrow(null, rowData, newIdx);
      this.grid.endupdate();
      this.grid.selectrow(newIdx);
      this.grid.ensurerowvisible(newIdx);
    },

    getCheck(id) {
      return $("input[id='{0}']".substitute(id)).prop('checked') ? 1 : 0;
    }
  }
}
</script>

<style>
</style>
