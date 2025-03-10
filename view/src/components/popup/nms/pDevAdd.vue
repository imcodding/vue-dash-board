<template>
  <div>
    <setTitle ref="setTitle" ></setTitle>
    <!-- <div id="hForm" ref="hForm"></div> -->
    <div class="pop_table">
      <table>
        <tr>
          <th>TOPN</th>
          <td>
            <input type="number" min="1" max="10" class="p_inputTxt" id="popupTopnVal" :value="this.topnVal"
              oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');"
            >
            <!-- <input type="hidden" :value="JSON.parse(this.popupParams.conf)"> -->
          </td>
        </tr>
      </table>
  </div>
    <div class="p_bottom_layer">
      <button class="btn" @click="save">저장</button>
      <button class="btn" @click="cancel">취소</button>
    </div>
  </div>
</template>

<script>
import SetTitle from '../SetTitle.vue'

export default {
  props: {
    params: Object
  },
  components: {
    SetTitle
  },
  created() {
    console.log('pDevAdd created',this.params)
  },
  mounted() {
    console.log('pDevAdd mounted')
  },
  updated() {
    console.log('pDevAdd updated')
  },
  data() {
    return {
      topnVal: 0
    }
  },
  methods: {
    save() {
      //로직처리
      // this.$emit('completed', this.params)
      this.$util.showPopup('./nms/pDevAdd', this.$refs.hForm, 'nm2', 300, 300, {b:'b'})
    },
    cancel() {
      
    }
  }
}
</script>

<style>

</style>