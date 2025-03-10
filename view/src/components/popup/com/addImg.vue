<template>
  <div>
    <div class="pop_table">
      <table>
        <colgroup>
          <col width="30%">
          <col width="70%">
        </colgroup>
        <tr>
          <th>이미지명</th>
          <td><input type="text" class="p_inputTxt" v-model="imgName"></td>
        </tr>
      </table>
    </div>
    <div>
      <JqxFileUpload style="float: left;"
                  ref="jqxFile"
                  :fileInputName="'fileInput'"
                  @select="onSelect($event)" 
                  @uploadEnd="onUploadEnd($event)"
                  width="100%" height="100px;" >
      </JqxFileUpload>
    </div>
    <div class="p_bottom_layer">
      <button class="btn" @click="add">추가</button>
      <button class="btn" @click="close">닫기</button>
    </div>
  </div>
</template>

<script>
import JqxFileUpload  from '@/lib/jqwidgets/vue/vue_jqxfileupload.vue'
export default {
  props: {
    popupParams: Object
  },
  components: {
    JqxFileUpload
  },
  data() {
    return {
      imgName: '',
      jqxFile: ''
    }
  },
  methods: {

    onSelect(event) {
      let fileLength = event.args.owner._fileRows.length;
      if (fileLength > 1) {
        alert('1개의 이미지만 첨부 가능합니다.')
        return;
      }
      this.hideJqxBtn();
    },

    onUploadEnd(event) {
      alert('저장되었습니다.');
      let data = null;
      if(typeof event.args.response === 'object') {
        data = JSON.stringify(event.args.response)
      } else {
        if(event.args.response.startsWith('<pre')) {
          data = $(event.args.response).contents().text();
        }
        else {
          data = event.args.response;
        }
      }
      this.$emit('completed', data)
      this.close();
    },

    add() {
      if(this.$isBlank(this.imgName)) {
        alert('이미지명을 입력해주세요.');
        return false;
      }


      let checkParams = {}
      checkParams.imgKind2 = this.popupParams.imgKind2;
      checkParams.imgName = this.imgName;
      checkParams.mode = process.env.NODE_ENV == 'production' ? 'PRO' : 'DEV';

      this.$axios.post('/api/dash/setting/fileCheck', checkParams).then((res) => {
          if(res > 0){
            alert("이미 등록된 이미지명 입니다.");
            return
          }else{
            // let mode = process.env.NODE_ENV == 'production' ? 'PRO' : 'DEV';
            let url = '/api/dash/setting/uploadImg';
            let params = 'fileType='+ checkParams.imgKind2 +'&imgName=' + this.imgName + '&mode=' + checkParams.mode;
            this.$refs.jqxFile.uploadUrl = url + '?' + params;
            this.$refs.jqxFile.uploadAll();
          }
      });

    },

    close() {
      this.$emit('close')
    },
    /**
     * jqxFileUpload 에서 제공해주는 버튼 숨김
     * (uploadAll, cancelAll, 업로드 화살표)
     */
    hideJqxBtn() {
      const $this = this;
      setTimeout(function() {
        $this.$js.hideByClass('jqx-file-upload-buttons-container');
        $this.$js.hideByClass('jqx-file-upload-file-upload');
      }, 100)
    }
  }
}
</script>

<style scoped>

</style>
