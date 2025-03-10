<template>
  <div class="pop_table">
    <table>
      <colgroup>
        <col width="30%">
        <col width="/">
      </colgroup>
      <tr>
        <th>타이틀</th>
        <td>
          <input type="text" class="p_inputTxt" v-model="mainTitle">
        </td>
      </tr>
      <tr>
        <th>주기</th>
        <td>
          <input type="text" class="p_inputTxt" v-model="time">
        </td>
      </tr>
    </table>

    <div style="float: left; margin-bottom: 5px; margin-top: 5px;">
      <select name="uploadType" id="uploadType" class="pl" style="width: 100px; height: 28px;">
        <option value="background" selected>배경</option>
        <option value="logo">로고</option>
      </select>
    </div>


    <JqxFileUpload style="float: left;"
                   :ref="'jqxFileUpload'"
                   @select="onSelect($event)" @remove="onRemove($event)"
                   @uploadStart="onUploadStart($event)" @uploadEnd="onUploadEnd($event)"
                   width="100%" height="100px;" :fileInputName="'fileToUpload'">
    </JqxFileUpload>
    <div class="p_bottom_layer">
      <button class="btn" @click="save">저장</button>
      <button class="btn" @click="cancel">취소</button>
    </div>
  </div>

</template>

<script>
import JqxFileUpload  from '@/lib/jqwidgets/vue/vue_jqxfileupload.vue'

import axios from "axios";
export default {
  components: {
    JqxFileUpload
  },
  methods: {
    handleFileChange(e) {
      this.fileToUpload = this.$refs.imageUpload.files[0];
    },
    save() {
      var uploadType = document.getElementById('uploadType').value;
      const params = {seconds: this.time, mainTitle: this.mainTitle}

      this.$axios.post('/api/chgDashConf', params)
        .then(() => {
          alert('저장되었습니다.');
          this.$store.commit('setRefreshTime', this.time);
          localStorage.setItem('refreshTime', this.time);

          this.$store.commit('setMainTitle', this.mainTitle);

          //첨부파일이 없는 경우 해당 로직은 스킵 필요
          let uploadUrl = '/api/upload';
          if(process.env.NODE_ENV == 'development'){
              uploadUrl = '/api/uploadLocal';
          };

          const curTime = new Date().getTime();
          this.curTime = curTime;
          this.$refs.jqxFileUpload.uploadUrl = uploadUrl + '?uploadType='+uploadType + '&curTime=' + this.curTime;
          this.$refs.jqxFileUpload.uploadAll();

        })

    },
    cancel() {
      this.$parent.close();
    },
    onSelect: function (event) {

      let args = event.args;
      let fileName = args.file; //추후 db 업로드시 사용
      let fileSize = args.size;
      let fileLength = event.args.owner._fileRows.length;
      if (fileLength > 1) {
        alert('한개만 첨부 가능')
        this.$refs.jqxFileUpload.cancelFile(1);
        return
      }


    },
    onRemove: function (event) {
      let fileName = event.args.file;

    },
    onUploadStart: function (event) {
      let fileName = event.args.file;
    },
    onUploadEnd: function (event) {
      let args = event.args;
      let fileName = args.file;
      let serverResponce = args.response;

      if (process.env.NODE_ENV == 'production') {
        localStorage.setItem('imageMainPath', 'background: url("/image/dashBG.jpg") no-repeat');
        this.$store.state.imageMainPath = 'background: url("/image/dashBG.jpg?' + new Date().getTime() + '") no-repeat';

        localStorage.setItem('imageLogoPath', 'background: url("/image/logo.png") no-repeat');
        this.$store.state.imageLogoPath = 'background: url("/image/logo.png?' + new Date().getTime() + '") no-repeat';

      }

    }
  },
  data() {
    return {
      time: this.$store.state.refreshTime,
      mainTitle: this.$store.state.mainTitle,
      fileToUpload :{},
      curTime: ''
    }
  }
}
</script>

<style>
  .jqx-file-upload-button-upload {
    display: none;
  }
  .jqx-file-upload-button-cancel {
    display: none;
  }

  .jqx-file-upload-file-upload{
    display: none;
  }
  .pl {

    border: 1px solid #C4C4C4;
    box-sizing: border-box;
    border-radius: 10px;
    padding: 0px 13px;
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
  }

  .pl:focus {
    border: 1px solid black;
    box-sizing: border-box;
    border-radius: 10px;
    outline: 3px solid #F8E4FF;
    border-radius: 10px;
  }

</style>
