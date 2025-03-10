<template>
  <div class="pop_table">
    <table>
      <colgroup>
        <col width="110">
        <col width="">
      </colgroup>
      <tr>
        <th>타이틀</th>
        <td><input type="text" v-model="mainTitle" class="p_inputTxt" autocomplete="off"></td>
      </tr>
      <tr>
        <th>새로고침(초)</th>
        <td><input type="text" v-model="time" class="p_inputTxt" autocomplete="off"></td>
      </tr>
      <tr>
        <th>테마</th>
        <td>
          <select ref="theme" class="p_combo" v-model="theme">
            <option>blue</option>
            <option>dark</option>
            <option>white</option>
          </select>
        </td>
      </tr>
    </table>
    <div class="p_bottom_layer">
      <button class="btn" @click="save">저장</button>
      <button class="btn" @click="cancel">취소</button>
    </div>
  </div>

</template>

<script>

import axios from "axios";
export default {
  components: {

  },
  computed: {
    rectTitle() {
      return this.getRectByTitle();
    }
  },
  created() {
    this.theme ? this.theme : 'blue'
  },
  mounted() {
    this.mainTitle = this.rectTitle.name;
  },
  methods: {

    save() {
      //현재 tab의 title update
      const tabSeq = this.$store.state.set.currTabSeq;
      let params = {};
      params.mainTitle = this.mainTitle;
      params.tabSeq = tabSeq;
      params.list = [
        {dashKey:'REFRESH_TIME', value:this.time},
        {dashKey:'THEME', value:this.theme},
      ]

      const titleParams = this.getRectByTitle(); //타이틀 관련 위젯 정보를 가져온다. (좌표 및 index)

      this.$axios.post('/api/chgDashConf', params)
        .then(() => {
          alert('저장되었습니다.');

          this.$store.commit('setTheme', this.theme);
          this.$store.commit('setRefreshTime', this.time);
          localStorage.setItem('refreshTime', this.time);

          this.curTime = new Date().getTime();

          let editData = {
            ...titleParams
          };
          editData.name = this.mainTitle;
          editData.curTime = new Date().getTime();

          this.$store.dispatch('rect/setRect', {id: titleParams.idx, rect: editData})
        })

    },
    cancel() {
      this.$parent.close();
    },

    getRectByTitle() {
      let rects = this.$store.state.rect.rects;
      for (let i = 0; i < rects.length; i++) {
        let rect = rects[i];
        if (rect.type === 'TITLE') {
          rect.idx = i;
          return rect;
        }
      }
    }

  },
  data() {
    return {
      time: this.$store.state.refreshTime,
      mainTitle: '',
      curTime: '',
      theme: this.$store.state.theme,
    }
  }
}
</script>

<style>

</style>
