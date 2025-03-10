<template>
  <div>
    <div class="pop_table">
      <table>
        <tr>
          <th>주기</th>
          <td>
            <input type="text" class="p_inputTxt" v-model="time">
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
export default {
  methods: {
    save() {
      const params = { userId: this.$store.state.userId, seconds: this.time }
      this.$axios.post('/api/chgRefreshTime', params)
      .then(() => {
        alert('저장되었습니다.');
        this.$store.commit('setRefreshTime', {value: this.time})
        this.cancel();
      })
    },
    cancel() {
      this.$parent.close();
    }
  },
  data() {
    return {
      time: this.$store.state.refreshTime
    }
  }
}
</script>

<style>

</style>
