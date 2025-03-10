<template>
  <div>
    <div class="pop_table" style="margin-bottom: 2px;">
      <table>
         <colgroup>
           <col width="65">
           <col width="">
         </colgroup>
        <tr>
          <th>타이틀</th>
          <td>
            <input ref="name" type="text" class="p_inputTxt" v-model="name" >
          </td>
        </tr>
        <tr>
          <th>라벨</th>
          <td>
            <select ref="title" class="p_combo" v-model="title">
              <option value="true">사용</option>
              <option value="false">숨김</option>
            </select>
          </td>
        </tr>
        <tr>
          <th>아이콘</th>
          <td>
            <div style="float: left; width: 50%;">
              <select ref="icon" class="p_combo" v-model="icon">
                <option value="true">사용</option>
                <option value="false">미사용</option>
              </select>
            </div>
            <div style="float: left; width: 50%;">
              <JqxDropDownList style="float: left; margin-left: 5px;" class="p_combo" ref="titleIcon"
                               v-model="titleIcon"
                               width="50%" :height="25" :popupZIndex="10000"
                               placeHolder="선택해주세요" :autoDropDownHeight="true"
                               :source="titleImageList" :selectedIndex="0"
                               displayMember="label" valueMember="value">
              </JqxDropDownList>
            </div>
          </td>
        </tr>
      </table>
    </div>
    <adminConf :popupParams="this.popupParams" v-if="this.$store.state.isAdmin"></adminConf>
  </div>
</template>

<script>
  import JqxDropDownList from '@/lib/jqwidgets/vue/vue_jqxdropdownlist.vue';
  //import AdminConf from './AdminConf';
 /**
 * 개별위젯 설정 popup title input component
 */
export default {
  components: {
    JqxDropDownList,
    AdminConf: () => import('./AdminConf') //컴포넌트 v-if 제어로 lazy loading 적용
  },
  props: {
    /* 위젯item db data */
    popupParams: Object
  },
  //각 설정 위젯 mounted 시 watch 동작으로 store 세팅
  watch: {
    name(){
      this.$store.dispatch('widget/addWidgetBasicData', {name: this.name});
    },
    icon(){
      this.$store.dispatch('widget/addWidgetConfData', {icon: this.icon});
    },
    title(){
      this.$store.dispatch('widget/addWidgetConfData', {title: this.title});
    },
    titleIcon(){
      this.$refs.titleIcon.val(this.titleIcon);
      this.$store.dispatch('widget/addWidgetConfData', {titleIcon: this.$refs.titleIcon.val()});
    }
  },

  mounted() {

  },
  updated(){

  },

  // 추가되는 기본 설정 값 input, check, dropbox 등.. ref 와 변수 name 모두 동일하게 통일
  data() {
    return {
      name: '',
      icon: true,
      title: true,
      titleIcon: 'LineUse',
      titleImageList: [
        { label: 'LineUse', value: 'LineUse', html: '<div><img style="width: 15px; height: 27px; float: left; margin-top: 2px; margin-right: 5px;" src="../../../static/img/LineUse.svg"/><span style="float: left;height:27px;line-height:29px; font-size: 11px; font-family: Verdana Arial;">Default</span></div>'},
        { label: 'Error', value: 'Error', html: '<div><img style="width: 15px; height: 27px; float: left; margin-top: 2px; margin-right: 5px;" src="../../../static/img/Error.svg"/><span style="float: left; height:27px;line-height:29px; font-size: 11px; font-family: Verdana Arial;">Alarm</span></div>'},
        { label: 'Topology', value: 'Topology', html: '<div><img style="width: 15px; height: 27px; float: left; margin-top: 2px; margin-right: 5px;" src="../../../static/img/Topology.svg"/><span style="float: left; height:27px;line-height:29px; font-size: 11px; font-family: Verdana Arial;">Group</span></div>'},
        { label: 'Tool', value: 'Tool', html: '<div><img style="width: 15px; height: 27px; float: left; margin-top: 2px; margin-right: 5px;" src="../../../static/img/Tool.svg"/><span style="float: left; height:27px;line-height:29px; font-size: 11px; font-family: Verdana Arial;">Tool</span></div>'},
      ]
    }
  },

  methods: {

  }
}
</script>

<style>

</style>
