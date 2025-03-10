<template>
  <div class="popBox">
    <div class="pop_table">
      <table>
        <colgroup>
          <col width="20%">
          <col width="80%">
          <col width="10%">
        </colgroup>
        <tr>
          <th>이미지명</th>
          <td><input type="text" class="p_inputTxt" v-model="searchText" /></td>
          <td style="text-align: center;"><button class="btn" @click="searchImg">조회</button></td>
        </tr>
      </table>
    </div>
    <div class="mt5" style="max-height: 330px; overflow: auto;">
      <grid ref="img" :id="'imgGrid'"></grid>
    </div>
    <div class="p_bottom_layer">
      <button class="btn" @click="applyImg">적용</button>
      <button class="btn" @click="addImg">추가</button>
      <button class="btn" @click="deleteImg">삭제</button>
      <button class="btn" @click="close">닫기</button>
    </div>
    <modal-popup v-if="isModal"
    :name="popupInfo.name"
    :params="popupInfo.params"
    :width="popupInfo.width"
    :height="popupInfo.height"
    :title="popupInfo.title"
    @completed="completed"
    @close="modal"
    />
  </div>
</template>

<script>
import Grid from '../../jqx/Grid.vue'
import ModalPopup from '../ModalPopup.vue';
export default {
  props: {
    popupParams: Object
  },
  components: {
    Grid,
    ModalPopup
  },
  data() {
    return {
      isModal: false,
      popupInfo: {},
      imgSrc: '',
      searchText: ''
    }
  },
  mounted() {
    this.imgSrc = process.env.NODE_ENV == 'production' ? '/image/vue/logo/' : '/static/img/d3/logo/'
    let src = this.imgSrc;
    this.$hmGrid.create(this.$refs.img.$refs.imgGrid, {
          columns: [
              { text: '이미지명', datafield: 'imgName', minwidth: 100, editable: false },
              { text: '이미지', datafield: 'imgUid', width: 140, cellsalign: 'center', editable: false,
                cellsrenderer: function(row, datafield, value) {
                  var cell = '<div style="margin: 5px;" class="jqx-center-align">';
                      cell += '<img height="50" width="130" src="' + src + '{0}.png" />'.substitute(value || 'NoImage');
                      cell += '</div>';
                      return cell;
                  }
              },
          ],
          height: '320px',
          rowsheight: 60,
      })
      this.searchImg();
  },
  methods: {
    /**
     * imgKind2: 경로 타입(배경/로고)
     * mode: 운영/로컬 구분(upload path용)
     * searchText: 파일검색 키값(폴더에서 파일 검색할 값)
     */
    searchImg() {
      let mode = process.env.NODE_ENV == 'production' ? 'PRO' : 'DEV';
      this.$hmGrid.refreshData(
        this.$refs.img.$refs.imgGrid, '/api/dash/setting/imgList',
        {imgKind2:'LOGO', mode: mode, searchText: this.searchText}
      )
    },
    applyImg() {
      let selectedIdxes = this.$refs.img.$refs.imgGrid.getselectedrowindexes();
      if(selectedIdxes.length === 0) {
        alert('이미지를 선택해주세요.');
        return;
      }

      let row = this.$refs.img.$refs.imgGrid.getrowdata(selectedIdxes[0]);


      this.$store.dispatch('updateImgPath', {img: row.imgUid, imgKind2: 'LOGO'})
    },
    addImg() {
      this.popupInfo.name = 'com/addImg'
      this.popupInfo.title = '로고 이미지 등록'
      this.popupInfo.width = 400
      this.popupInfo.height = 193
      this.popupInfo.params = {imgKind2: 'LOGO'}
      this.modal();
    },
    deleteImg() {
      let selectedIdxes = this.$refs.img.$refs.imgGrid.getselectedrowindexes();
      if(selectedIdxes.length === 0) {
        alert('이미지를 선택해주세요.');
        return;
      }
      if(!confirm('삭제하시겠습니까?')) return;
      let rows = this.$refs.img.$refs.imgGrid.getrows();
      let selectedList = [];

      for(const idx of selectedIdxes) {
        selectedList.push(rows[idx]);
      }

      let params = {}
      params.imgKind2 = 'LOGO';
      params.imgList = selectedList;
      params.mode = process.env.NODE_ENV == 'production' ? 'PRO' : 'DEV';

      let $this = this;
      this.$axios.post('/api/dash/setting/delImg', params).then(()=>{
        alert('삭제되었습니다.');
        $this.searchImg();
      })
    },
    completed(data) {
      var resultData = JSON.parse(data).resultData;
	    if(data != null)
        this.$refs.img.$refs.imgGrid.addrow(null, resultData);
    },
    close() {
      this.$emit('close')
    },
    modal() {
      this.isModal = !this.isModal;
    }
  },
}
</script>

<style scoped>
</style>
