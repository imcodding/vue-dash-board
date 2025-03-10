<template>
  <div style="height: 456px; border-radius: 20px;">
      <!--<div class="pop_table" style="float: left; width: 20%; height: 400px; border-right: solid 1px #4a4b4d;">-->
        <!--<table>-->
          <!--<colgroup>-->
            <!--<col />-->
          <!--</colgroup>-->
          <!--<tr @click="setSetting('basic');" style="cursor: pointer">-->
            <!--<th>기본</th>-->
          <!--</tr>-->
          <!--<tr @click="setSetting('bg');" style="cursor: pointer">-->
            <!--<th>배경</th>-->
          <!--</tr>-->
          <!--<tr @click="setSetting('logo');" style="cursor: pointer">-->
            <!--<th>로고</th>-->
          <!--</tr>-->
        <!--</table>-->
      <!--</div>-->
      <div class="pop_tabs">

        <a id="Plogo"></a>
        <a href="#Plogo" @click="setSetting('logo');" >로고</a>

        <a id="Pbg"></a>
        <a href="#Pbg"  @click="setSetting('bg');">배경</a>

        <a id="Pbasic"></a>
        <a href="#Pbasic" @click="setSetting('basic');" >기본</a>

        <div>
          <component :is="this.display" @close="close"></component>
        </div>
      </div>

      <!--<div style="float: left; width: 78%; height: 100%">-->
          <!--<component :is="this.display" @close="close"></component>-->
      <!--</div>-->

  </div>

</template>

<script>

import axios from "axios";
import DashBasic from './com/DashBasic';
import DashConf from './com/DashConf';
import DashLogo from './com/DashLogo';

export default {
  components: {
    DashBasic,
    DashConf,
    DashLogo
  },
  mounted() {
    this.$emit('resize', 800, 405);
  },
  methods: {
    save() {

    },
    close() {
      this.$emit('close');
    },
    setSetting(type){

      switch (type) {
        case 'basic':
          this.display= 'DashBasic';
          break;
        case 'bg':
          this.display= 'DashConf';
          break;
        case 'logo':
          this.display = 'DashLogo'
          break;
        default:
          break;
      }
    },
  },
  data() {
    return {
      display: 'DashBasic'
    }
  }
}
</script>

<style>
  .p_bottom_center_layer {
    position: absolute;
    bottom: 5px;
    left: 100px;
    right: 0px;
    text-align: center;
    padding: 5px;
  }
</style>
