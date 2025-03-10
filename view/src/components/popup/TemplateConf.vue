<template>
  <div>
    <div v-if="imageList.length == 0" style="color: grey; text-align: center">템플릿 데이터가 없습니다.</div>
    <div v-if="imageList.length != 0" style="width: 1600px" class="imageItem">
      <div style="width: 1600px" class="images" v-viewer="{
                zIndex: 99999,
                movable: true,
                button: true,
                navbar: true,
                title: true,
                toolbar: true,
                tooltip: true,
                zoomable: true,
                scalable: false,
                transition: true,
                fullscreen: false,
                keyboard: true
                }">
        <div v-for="(src, index) in imageList" :key="src.templateSeq"
             style="width:32.5%; display: inline-block;  margin-top: 10px;" :style="index%3 == 0 ? 'margin-left: -2px;' : 'margin-left: 14px;' ">
          <!--<div class="modal-wrap" :style="name == 'com/ColMgmt' || name =='IfConf' || name =='DevConf' ? 'transform: scale(1,1.2)' : ''">-->
          <span style="color: white; font-size: 13px; line-height: 25px; height: 30px; display: inline-block; padding-left:3px">{{src.templateName}}</span>
          <div class="panel-delet panel-btn" style="width: 21px; height: 21px; margin-bottom: 5px;" @click="del(src.templateSeq, src.templateName, index)"></div>
          <div class="panel-refre panel-btn" style="width: 21px; height: 21px;" @click="apply(src.templateSeq)"></div>
          <div>
            <img :src="'data:image/;base64,'+src.imageData"
                 style="width: 100%; height: 320px;">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import 'viewerjs/dist/viewer.css'
import VueViewer from 'v-viewer'
import Vue from 'vue'
Vue.use(VueViewer)

export default {
  props: {
    popupParams: Object
  },
  components: {
  },
  mounted(){
    //this.$emit('resize', 1600, 1000)
    this.initialize();
  },
  computed: {

  },
  methods: {
    initialize(){
        this.$axios.get('/api/getTemplateList').then((res) => {
          this.dynamicResize(res.length);
          let obj = [];
          for(let i of res){
            i.imageData = Buffer.from(i.imageData, "base64");
            i.regDate = i.regDate;
            obj.push(i)
          }
          this.imageList = obj;
        })
    },

    //가로 이미지 수 최대 3개. 1~3개에 대한 width 조절
    dynamicResize(length){
      //537 1074
      const resultLength = length;
      const minW = 537;
      const maxW = 1611;
      const resultMod = resultLength % 3;

      if(resultLength == 0){
        this.$emit('resize', minW, 1000)
        return
      }

      if ((resultLength / 3) > 1) {
        this.$emit('resize', maxW, 1000) //두줄 이상 부터
      } else {
        this.$emit('resize', resultMod == 0 ? maxW : minW * resultMod, 1000)
      }
    },

    del(seq, name, index){
      if (!confirm('\''+name+ "\' 템플릿을 하시겠습니까?")) return;
      this.$axios.post('/api/delTemplate', {templateSeq: seq})
        .then(() => {
          alert("삭제되었습니다.");
          this.imageList.splice(index, 1);


          this.dynamicResize(this.imageList.length);

        })
    },

    apply(seq){

      if (!confirm("기존 등록된 위젯 정보는 삭제 됩니다. 변경 하시겠습니까?")) return;

      this.$axios.post('/api/applyTemplate', {templateSeq: seq, currTabSeq: this.popupParams.currTabSeq})
        .then(() => {
          alert("저장되었습니다.");
          this.$store.dispatch('rect/initRects', {mode:'', tabSeq:this.popupParams.currTabSeq})
        })
    }
  },
  data() {
    return {
      imageList: [],
    }
  }
}
</script>

<style>
.images {
  overflow-y: scroll;
  height: 830px;
}
.images::-webkit-scrollbar {
  display: none;
}
  .imageItem div {
    position: relative;
    opacity: 1;
  }


  .imageItem div:hover {
    opacity: 0.85;
  }

  .viewer-button {
    background-color: #747474;
  }

</style>
