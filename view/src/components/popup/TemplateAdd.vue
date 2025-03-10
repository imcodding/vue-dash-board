<template>
  <div>
    <div class="pop_table" style="margin-bottom: 2px;">
      <table>
         <colgroup>
           <col width="65">
           <col width="">
         </colgroup>
        <tr>
          <th>템플릿명</th>
          <td>
            <input  type="text" class="p_inputTxt" maxlength="15" v-model="name">
          </td>
        </tr>
      </table>
    </div>
    <div class="p_bottom_layer">
      <button class="btn" @click="save" id="saveBtn">저장</button>
    </div>
  </div>
</template>

<script>
import html2canvas from "html2canvas"
import axios from "axios";
export default {
  components: {

    },
  props: {
    popupParams: Object
  },
  mounted(){
    this.$emit('resize', 350, 200)

  },

  methods: {
    initialize(){

    },
    save() {
      if(this.name == '') {
        alert('제목을 입력해주세요.')
        return
      }
      $("#saveBtn").attr("disabled", true);
      let mainImg;

      let settingCanvas = this.popupParams.targetRef;
      html2canvas(settingCanvas, {backgroundColor: 'black'}).then(canvas => {
          mainImg = canvas.toDataURL("image/png");
          mainImg = mainImg.replace("data:image/png;base64,", "");
          //const result = await this.$axios.post('/api/addCaptureWidget', {templateImg: mainImg, templateName: this.name});
          this.$axios.post('/api/addTemplate', {templateImg: mainImg, templateName: this.name, currTabSeq: this.popupParams.currTabSeq})
          .then(() => {
            alert("저장되었습니다.");
            $("#saveBtn").attr("disabled", false);
            this.$emit('close')
          })

      });

    }
  },
  data() {
    return {
      name : ''
    }
  }
}
</script>

<style>
  .imageItem div {
    position: relative;
    opacity: 1;
  }


  .imageItem div:hover {
    opacity: 0.85;
  }
</style>
