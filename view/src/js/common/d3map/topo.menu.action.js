/**
 * 토폴로지 컨텍스트 메뉴 Action
 */
import axios from "axios";
import TopoConst from "./hm.topo.resource";
import HmGis from "./gis/gis";
import util from '../hm.util'
var topo_menu_action = {
    /** 최상위그룹 */
    gotoTop: function (elm, d, i, objTopo) {
        if(objTopo.vars.curGrpNo == objTopo.vars.topGrpNo) {
            alert("최상위 그룹입니다.");
            return;
        }

        objTopo.vars.curGrpNo = objTopo.vars.topGrpNo;
        objTopo.search.call(objTopo);
    },

    /** 상위그룹 */
    gotoUp: function (elm, d, i, objTopo) {
        if(objTopo.vars.curGrpNo == objTopo.vars.topGrpNo) {
            alert("최상위 그룹입니다.");
            return;
        }
        const data = {
            grpNo: objTopo.vars.curGrpNo,
            userId: objTopo.vars.sessUserId
        }

        axios.get("/api/d3map/getParentGrpNo", { params: data }).then(result => {
            objTopo.vars.curGrpNo = result;
            objTopo.search.call(objTopo);
        })

    },

    /** 그룹보기 */
    view_grp: function (elm, d, i, objTopo) {
        return; // 수정필요
        HmWindow.close($('#pwindow'));
        $.post('/d3map/popup/search/pGrpView.do',
            function (result) {
                HmWindow.openFit($('#pwindow'), '그룹보기', result, 500, 600, 'pwindow_init', {objTopo: objTopo});
            }
        );
    },

    /** 그룹들어가기(==더블클릭 이동) */
    chgGrp: function (elm, d, i, objTopo) {
        if(d != null && d.devKind1 == "GRP") {
            objTopo.vars.curGrpNo = d.mngNo;
            objTopo.vars.curGrpNm = d.itemName;
            objTopo.chgGrp.call(objTopo);
        }
    },
    
    /** 토폴로지 보기 */
    view_topo: function (objTopo) {

        try {
            var prefix = objTopo.hasOwnProperty('objId') ? objTopo.objId + '_' : '';
            $('#' + prefix + 'mapCanvas').css('display', 'inline-block');
            $('#' + prefix + 'gisCanvas').css('display', 'none');
            $('input:radio[name=map_viewType][value="topo"]').prop('checked', true);
        } catch (e) {

        }

        objTopo.vars.viewType = TopoConst.viewType.TOPO;
        objTopo.vars.isChgGrp = true;
        objTopo.chgGrp.call(objTopo);

    },

    /** GIS 보기 */
    view_gis: function (elm, d, i, objTopo) {
        try {
            var prefix = objTopo.hasOwnProperty('objId') ? objTopo.objId + '_' : '';
            $('#' + prefix + 'mapCanvas').css('display', 'none');
            $('#' + prefix + 'gisCanvas').css('display', 'inline-block');
            $('input:radio[name=map_viewType][value="gis"]').prop('checked', true);
        } catch (e) {
        }
        if (objTopo.objGis == null) {
            objTopo.objGis = new HmGis(prefix + 'gisCanvas', this);
            objTopo.objGis.initialize();
        }
      
        objTopo.vars.viewType = TopoConst.viewType.GIS;

        objTopo.objGis.chgGrp(objTopo);
    },

    /** 장비상세정보 */
    view_devDetail: function(elm, d, i, objTopo) {
      util.createWinPopup('/main/popup/nms/pDevDetail.do', $('#hForm'), 'pDevDetail', 1300, 700, {mngNo: d.mngNo});
    },

    /** 보기 > 서버상세 */
    view_svrDetail: function (elm, d, i, objTopo) {
      util.createWinPopup('/main/popup/sms/pSvrDetail.do', $('#hForm'), 'pSvrDetail', 1300, 700, {mngNo: d.mngNo});
    },

    /** 보기 > ap상세 */
    view_apDetail: function (elm, d, i, objTopo) {
        var params = {
            apNo: d.mngNo
        };
        util.createWinPopup('/main/popup/nms/pApDetail.do', $('#hForm'), 'pApDetail', 1200, 760, params);
    },

    /** 보기 > Client현황 */
    view_apClientStatus: function (elm, d, i, objTopo) {
        var params = {
            apNo: d.mngNo
        };
        util.createWinPopup('/main/popup/nms/pApClientStatus.do', $('#hForm'), 'pApClientStatus', 1200, 760, params);
    },

    /** 장비찾기 */
    findDev: function (elm, d, i, objTopo) {
        HmWindow.close($('#pwindow'));
        $.post('/d3map/popup/search/pDevFind.do',
            function (result) {
                HmWindow.openFit($('#pwindow'), '장비찾기', result, 980, 620, 'pwindow_init', {data: d, objTopo: objTopo});
            }
        );
    },

    /** 초기화 > 맵초기화 */
    init_map: function (elm, d, i, objTopo) {
        if (confirm("모든 아이템이 지워지고 기본 그룹의 아이템이 등록됩니다.\n맵 초기화를 진행하시겠습니까?") == true) {
            $.post('/d3map/popup/setting/mapInit/saveMapInit.do',
                function (result) {
                    objTopo.search.call(objTopo);
                    if(confirm("맵 초기화 작업이 완료되었습니다. 위치 초기화를 진행하시겠습니까?")) {
                        topo_menu_action.init_pos(elm, d, i, objTopo);
                    }
                }
            );
        }
    },
};

export default topo_menu_action;
