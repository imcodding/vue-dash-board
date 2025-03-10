<template>
  <div>
    <setTitle ref="setTitle" :popupTitleName="this.popupParams.name"></setTitle>

    <div class="pop_table">
      <table>
        <colgroup>
          <col width="65">
          <col width="">
        </colgroup>
        <tr>
          <th>총 AP</th>
          <td>
            <input type="number" min="1" max="999" class="p_inputTxt" v-model="totalApCnt"
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
    popupParams: Object
  },
  mounted() {
    let data = this.popupParams;

    this.$refs.setTitle.setTitleVal = data.name;

    let conf = JSON.parse(data.conf);
    if(conf.totalApCnt !== undefined) this.totalApCnt = conf.totalApCnt;
  },
  data() {
    return {
      totalApCnt: 0
    }
  },

  methods: {
    save() {
      let data = this.popupParams;
      let conf = JSON.parse(data.conf);
      conf.totalApCnt = this.totalApCnt;

      let params = {};
      params.conf = JSON.stringify(conf);
      params.name = this.$refs.setTitle.setTitleVal;
      params.seqNo = data.itemSeq;
      params.id = data.id;

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
