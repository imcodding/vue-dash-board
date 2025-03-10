<template>
  <div>
    <setTitle ref="setTitle" :popupTitleName="this.popupParams.name"></setTitle>

    <div class="pop_table">
      <table>
        <tr>
          <th>LOWN</th>
          <td>
            <input type="number" min="1" max="10" class="p_inputTxt" v-model="lownVal"
            oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');">
          </td>
        </tr>
      </table>
    </div>
    <div class="p_bottom_layer">
      <button class="btn" @click="save">적용</button>
      <button class="btn" @click="cancel">취소</button>
    </div>
  </div>
</template>

<script>
import SetTitle from './SetTitle';
export default {
  components: {
    SetTitle
  },
  props: {
    /* 위젯item db data */
    popupParams: Object
  },
  mounted() {
    let data = this.popupParams;

    this.$refs.setTitle.setTitleVal = data.name;
    this.$refs.setTitle.setIconVal = data.icon;
    this.$refs.setTitle.setTitleDisplay = data.title;

    let conf = JSON.parse(data.conf);
    this.topnVal = conf && conf.topN;
  },
  data() {
    return {
      lownVal: 0
    }
  },

  methods: {
    save() {
      let data = this.popupParams;
      let conf = JSON.parse(data.conf);
      conf.lowN = this.lownVal;
      conf.icon = this.$refs.setTitle.setIconVal;
      conf.title = this.$refs.setTitle.setTitleDisplay;

      let params = {};
      params.conf = JSON.stringify(conf);
      params.name = this.$refs.setTitle.setTitleVal;
      params.seqNo = data.itemSeq;
      params.id = data.id;
      params.icon = this.$refs.setTitle.setIconVal;
      params.title = this.$refs.setTitle.setTitleDisplay;

      let editData = { ...data, ...params };
      editData.curTime = new Date().getTime();
      
      this.$emit('completed', editData);
      this.cancel();
      
    },
    cancel() {
      this.$emit('close')
    }
  },
}
</script>

<style>

</style>
