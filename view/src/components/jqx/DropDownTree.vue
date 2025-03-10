<template>
  <div>
      <JqxDropDownButton ref="myDropDownButton" style="padding: 4px" class="p_inputTxt"
                           :width="200" :height="25" :popupZIndex="10000">
        <JqxTree ref="myTree"
        :theme="'dark'"
        width="255px"
        height="300px"

        @select = "treeSelect($event)">
        </JqxTree>
      </JqxDropDownButton>
  </div>

</template>

<script>
import JqxDropDownButton from '@/lib/jqwidgets/vue/vue_jqxdropdownbutton.vue'
import JqxTree from '@/lib/jqwidgets/vue/vue_jqxtree.vue'
import JqxExpander from '@/lib/jqwidgets/vue/vue_jqxexpander.vue'

export default {
  props: {
    url: String
  },
  components:{
    JqxDropDownButton,
    JqxTree,
    JqxExpander
  },
  mounted: function () {
    this.createGrpTree();
  },

  beforeCreate: function () {


  },
  updated() {

  },
  methods: {
    treeSelect: function (event) {
      const item = this.$refs.myTree.getItem(event.args.element);
      const dropDownContent = '<div style="position: relative; margin-left: 3px; margin-top: 5px;">' + item.label + '</div>';

      this.$refs.myDropDownButton.setContent(dropDownContent); //선택 값 인풋 입력
      this.$refs.myDropDownButton.close(); //선택 후 콤보 박스 종료


    },

    cancel() {
      this.$parent.close();
    },

    createGrpTree: function (event) {
      const cur = this;
      const url = this.url;
      //todo url 값 변수로 처리 하여 공통 컴포넌트로 사용 필요
      this.$axios.get(url).then((res) => {
        for (let i in res) {
          cur.treeData.push({
            valueName: res[i].value,
            displayName: res[i].label,
            //icon: res, //아이콘 필요시 적용
            parentName: res[i].parentName
          });
        }

        var adapter = new $.jqx.dataAdapter(
          {
            datatype: 'json',
            datafields: [
              {name: 'parentName'},
              {name: 'displayName'},
              {name: 'valueName'},
              {name: 'icon'},

            ],
            localdata: this.treeData
          },
          {
            autoBind: false,
            async: false
          }
        );
        adapter.dataBind();

        this.$refs.myTree.source = adapter.getRecordsHierarchy('valueName', 'parentName', 'items',
          [
            {name: 'displayName', map: 'label'}, {name: 'valueName', map: 'value'}, {
            name: 'parentName',
            map: 'parentType'
          }
          ]);

        this.$refs.myTree.expandAll();
        this.$emit('bindingCompleted', this.$refs.myTree.getItems())
      })
    }
  },
  data() {
    return {
      treeData: [],
    }
  }
}
</script>

<style>

</style>
