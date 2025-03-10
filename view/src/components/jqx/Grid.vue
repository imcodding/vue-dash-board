
<template>
    <!-- grid event 관련 정의 추가시 하단의 methods에 function 정의 필요  -->
    <div @contextmenu="contextmenuMenu" @mousedown="mousedown($event)">
        <JqxGrid :ref="id" :source="dataAdapter"
                @bindingcomplete   = "onBindingcomplete($event)"
                @rowclick          = "onRowclick($event)"
                @rowdoubleclick    = "onRowdoubleclick($event)"
                @rowselect         = "onRowselect($event)"
                @rowunselect       = "onRowunselect($event)"
                @columnclick       = "onColumnclick($event)"
                @cellclick         = "onCellclick($event)"
                @celldoubleclick   = "onCelldoubleclick($event)"
                @cellselect        = "onCellselect($event)"
                @cellunselect      = "onCellunselect($event)"
                @cellvaluechanged  = "onCellvaluechanged($event)"
                @filter            = "onFilter($event)"
        />
        <JqxMenu :ref="id+'JqxMenu'"
                :mode="'popup'"
                :autoOpenPopup="false"
                :width="120"
                :height="140"
                :source = []
                @itemclick="onItemclick($event)"
                >
            <ul v-html=""></ul>
        </JqxMenu>

    </div>
</template>

<script>
import JqxGrid from '@/lib/jqwidgets/vue/vue_jqxgrid.vue'
import JqxMenu from '@/lib/jqwidgets/vue/vue_jqxmenu.vue'
import HmUtil from '../../js/common/hm.util';
/**
 * jqx-grid generator
 * @author sooyun, imhojong
 * @since 2023.07.09
 * @param: id
 */

export default {
    props: {
      id: String ,
      seq: Number,
      idx: Number
    },

    components: {
        JqxGrid,
        JqxMenu
    },
    beforeMount() {
        //widget store 에서 source로 처리
        //this.liList += '<li id="colMgmt">컬럼관리</li>'
    },
    mounted() {
      this.$store.dispatch('widget/initJqxMenu', {id: this.id+'JqxMenu', jqxMenu: this.$refs[this.id+'JqxMenu']});
    },
    data: function () {
        return {
            // eslint-disable-next-line no-undef
            dataAdapter: new jqx.dataAdapter(this.source),
            liList: ''
        }
    },

    beforeCreate: function () {
        // axios 데이터 바인딩 할 때, 필요하진 않을까?
        // 정상적인 필터 위해 datafields 필요한 경우 있을까?
        this.source = {
            datatype: 'array'
        };
    },

    methods:{
        /*========== JqxGrid ==========*/
        onBindingcomplete   : (event) => { return event },
        onRowclick          : (event) => { return event },
        onRowdoubleclick    : (event) => { return event },
        onRowselect         : (event) => { return event },
        onRowunselect       : (event) => { return event },
        onColumnclick       : (event) => { return event },
        onCellclick         : (event) => { return event },
        onCelldoubleclick   : (event) => { return event },
        onCellselect        : (event) => { return event },
        onCellunselect      : (event) => { return event },
        onCellvaluechanged  : (event) => { return event },
        onFilter            : (event) => { return event },

        /*========== JqxMenu ==========*/
        contextmenuMenu(event) { event.preventDefault(); },

        mousedown(event) {
            let rightClick = this.isRightClick(event);
            if (rightClick) {
                this.$refs[this.id+'JqxMenu'].open(parseInt(event.clientX), parseInt(event.clientY));
                return false;
            }
        },

        isRightClick(event) {
            let rightclick;
            if (event.which) rightclick = (event.which == 3);
            else if (event.button) rightclick = (event.button == 2);
            return rightclick;
        },

        onItemclick(event) {
            const selectedGrid = this.$refs[this.id]
            switch(event.args.id) {
                case 'colMgmt' :
                    this.$store.dispatch('dash/openPopup', {
                        width:400, height:325, name:'com/ColMgmt', title:'컬럼관리',
                        params: { grid: selectedGrid, gridId: this.id, seq: this.seq, idx: this.idx } // 반드시 json 형태
                    })
                    break;
                case 'pDevDetail' : //todo 우클릭 상세 구분을 하나로 할 수 있는지..
                case 'pIfDetail'  :
                case 'pSvrDetail' :
                  HmUtil.ctrxPopup(this.id, event.args.id);
                  break;
            }
        }

    }
  }
</script>

<style>

</style>
