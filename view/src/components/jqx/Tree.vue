<template>
  <div>
      <JqxTree ref="myTree"
      :theme="this.theme"
      :style="this.treeStyle"
      @select = "onSelect($event)">
      </JqxTree>
  </div>

</template>

<script>
import JqxTree from '@/lib/jqwidgets/vue/vue_jqxtree.vue'
import JqxExpander from '@/lib/jqwidgets/vue/vue_jqxexpander.vue'
import WidgetControl from '@/js/common/widget/widget.control.js'

export default {
  props: {
    theme: String,
    treeStyle: String,
    defaultIdx: Number
  },
  components:{
    JqxTree,
    JqxExpander
  },
  created() {
    // default 자동선택
    this.selectIdx = this.defaultIdx ? this.defaultIdx : 1;
  },
  mounted: function () {
    var adapter = new $.jqx.dataAdapter(
            {
                datatype: 'json',
                datafields: [
                    { name: 'parentName' },
                    { name: 'displayName' },
                    { name: 'valueName' },
                    { name: 'icon' },

                ],
                localdata: WidgetControl.getTree()
            },
            {
                autoBind: false,
                async: false
            }
        );
    adapter.dataBind();
    this.$refs.myTree.source = adapter.getRecordsHierarchy('valueName', 'parentName', 'items',
      [
        {name: 'displayName', map: 'label'}, {name: 'valueName', map: 'value'}, {name: 'parentName', map: 'parentType'}
      ]);
     this.$refs.myTree.expandAll();
     this.onBindingComplted();
  },
  
  methods: {
    onBindingComplted() {
      const treeItems = this.$refs.myTree.getItems();
      for(let i = 0; i < treeItems.length; i++) {
        if(i == this.selectIdx) {
          this.$refs.myTree.selectItem(treeItems[i]);
          this.$emit('bindingCompleted', treeItems[i]); //callback
          break;
        }
      }
    },
    
    onSelect: function () {
      return this.$refs.myTree.getSelectedItem();
    },
  },
  data() {
    return {
      rowData: [],
      selectIdx: 0
    }
  }
}
</script>

<style>

</style>
