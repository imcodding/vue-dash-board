<template>
  <div>
    <div class="pop_table">
      <setTitle ref="setTitle" :popupParams="this.popupParams"></setTitle>
      <table>
        <colgroup>
          <col width="65">
          <col width="">
        </colgroup>
        <tr>
          <th>명칭</th>
          <td>
            <input type="text" class="p_inputTxt" v-model="confName">
          </td>
        </tr>
        <tr>
          <th>종류</th>
          <td>
            <JqxDropDownList class="p_combo" ref="devKind2List"
                            :width="'100%'" :height="25" :popupZIndex="10000"
                            :checkboxes="true" placeHolder="선택해주세요"
                            :source="confList" displayMember="codeCd" valueMember="codeCd">
            </JqxDropDownList>
          </td>
        </tr>
        <tr>
          <th>이미지</th>
          <td>
            <table class="tb-conf-info">
              <tr v-for="(confInfo,idx) in confInfoList" :key="idx">
                <td v-for="item in confInfo" :key="item.codeCd" @click="onClickImg" :class="item.codeCd">
                  <img width="35" height="35"
                  :src="`/static/img/d3/micons/${item.codeCd}.PNG`"
                  :class="item.codeCd" />
                  <label :class="item.codeCd">{{ item.codeCd }}</label>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
    <div>
      <div class="p_bottom_layer">
        <button class="btn" @click="save">적용</button>
        <button class="btn" @click="cancel">취소</button>
      </div>
    </div>
  </div>
</template>

<script>
import SetTitle from "./SetTitle";
import axios from 'axios';
import JqxDropDownList from '@/lib/jqwidgets/vue/vue_jqxdropdownlist.vue';

export default {
  components: {
    SetTitle,
    JqxDropDownList
  },
  props: {
    /* 위젯item db data */
    popupParams: Object,
    id: String ,
    url: String
  },
  data() {
    return {
      // source: [],
      confName: null,
      confList: [ //codeNm 미사용. 현재 svg 있는 것만 사용
          { codeCd: "BACKBONE", codeNm: "BACKBONE" },
          { codeCd: "FIREWALL", codeNm: "FIREWALL" },
          { codeCd: "IPS", codeNm: "IPS" },
          { codeCd: "ROUTER", codeNm: "라우터" },
          { codeCd: "NAC", codeNm: "NAC" },
          // { codeCd: "L2SWITCH", codeNm: "L2SWITCH" },
          // { codeCd: "L3SWITCH", codeNm: "L3SWITCH" },
          // { codeCd: "L4SWITCH", codeNm: "L4SWITCH" },
          // { codeCd: "L7SWITCH", codeNm: "L7SWITCH" },
          // { codeCd: "RTU", codeNm: "RTU" },
          { codeCd: "SWITCH", codeNm: "SWITCH" },
          // { codeCd: "SERVER", codeNm: "SERVER" },
          // { codeCd: "UPS", codeNm: "UPS" },
          { codeCd: "UTM", codeNm: "UTM" },
          { codeCd: "VPN", codeNm: "VPN" },
          // { codeCd: "ETC", codeNm: "ETC" },
      ],
      confImg: null,
      active: '#4662ff',
      title: null,
      titleDisplay: null,
      icon: null,
    }
  },
  created() {
    // const $this = this;
    // this.$axios.get('/api/conf-info/devKind').then((res) => {
    //   $this.$refs.devKind2List.source = res;
    //   $this.list = res;
    //   console.log('res',res)
    // })
    const data = this.popupParams;
    const conf = JSON.parse(data.conf);

    this.title = data.name;
    this.titleDisplay = data.title;
    this.icon = data.icon;
    this.confName = conf.confName;
    this.confImg = conf.confImg;
    this.devKind2 = conf.devKind2;
  },
  mounted() {
    this.$emit('resize', 500, 250);

    //기초 데이터
    let data = this.popupParams;
    for(let key of Object.keys(this.$refs.setTitle.$refs)){
      this.$refs.setTitle[key] = data[key];
    }

    const devKind2Arr = this.devKind2 ? this.devKind2.split(',') : [];
    for(const devKind2 of devKind2Arr) {
      this.$refs.devKind2List.checkItem(devKind2)
    }
    var img = document.getElementsByClassName(this.confImg)[0];
    img.style.background = this.active;

  },
  computed: {
    confInfoList() {
      let arr = []
      let col = 5; //한 줄에 표현할 개수
      for(let i = 0; i < this.confList.length; i += col) {
        let temp;
        temp = this.confList.slice(i, i+col)
        arr.push(temp)
      }
      return arr
    }
  },
  methods: {
    save() {
      let params = {}
      const devKind2List = this.$refs.devKind2List.val();
      const confName = this.confName;
      const confImg = this.confImg;

      if(!confName) {
        alert('명칭을 입력해주세요.');
        return;
      }
      if(this.$isBlank(devKind2List)) {
        alert('종류를 선택해주세요.');
        return;
      }
      if(!confImg) {
        alert('이미지를 선택해주세요.');
        return;
      }

      let widgetBasicData = this.$store.state.widget.widgetBasicData; //name 등의 테이블 단일 컬럼 데이터
      let widgetConfData = this.$store.state.widget.widgetConfData; //conf 컬럼의 복합 데이터

      this.$store.dispatch('widget/addWidgetConfData', {devKind2: devKind2List});
      this.$store.dispatch('widget/addWidgetConfData', {confName: confName});
      this.$store.dispatch('widget/addWidgetConfData', {confImg: confImg});

      params.conf = JSON.stringify(widgetConfData);

      let editData = {...this.popupParams, ...widgetBasicData, ...widgetConfData, ...params };
      editData.curTime = new Date().getTime();
      this.$emit('completed', editData);

      this.cancel();
    },
    cancel() {
      this.$emit('close')
    },
    onClickImg(event) {

      this.confImg = event.target.className;

      //초기화
      const allTargets = document.querySelectorAll('.tb-conf-info td,img,label')
      for(const target of allTargets) target.style.background = ''

      //선택
      const targets = document.getElementsByClassName(this.confImg)
      for(const target of targets) target.style.background = this.active

      this.setConfInfo();
    },
    /**
     * 명칭 및 종류 자동설정
     */
    setConfInfo() {
      this.$refs.devKind2List.uncheckAll();
      this.$refs.devKind2List.checkItem(this.confImg);
      this.confName = this.confImg
    }
  }
}


</script>
<style scoped>
.tb-conf-info td { text-align: center; cursor: pointer;}
.tb-conf-info td:hover { background-color: #3c4149}
.tb-conf-info label { display: block;font-size:11px;color:#fff; cursor: pointer;}
</style>1
