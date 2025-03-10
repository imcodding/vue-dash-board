/**
 * 토폴로지 컨텍스트 메뉴
 */
 import topo_menu_action from './topo.menu.action';
var topo_menu = {
    m_menu_back: [
        {
            title: "최상위그룹",
            icon: 'list_icon',
            action: topo_menu_action.gotoTop
        },
        {
            title: "상위그룹",
            action: topo_menu_action.gotoUp
        },
        
        {
            title: "장비찾기",
            action: topo_menu_action.findDev
        },
       
    ],
    m_menu_item: [
        {
            title: "그룹이동",
            action: topo_menu_action.moveGrp
        },
       
    ],
    m_menu_svr: [
        {
            title: "그룹이동",
            action: topo_menu_action.moveGrp
        },
       
    ],
    m_menu_grp: [
        {
            title: "그룹이동",
            action: topo_menu_action.moveGrp
        },
     
    ],
    m_menu_rack: [
        {
            title: "그룹이동",
            action: topo_menu_action.moveGrp
        },
    ],
    
    m_menu_two_item: [
        {
            title: "그룹이동",
            action: topo_menu_action.moveGrp
        },
    ],
    m_menu_multi_item: [
        {
            title: "그룹이동",
            action: topo_menu_action.moveGrp
        },
    ],
    
    m_menu_etc: [
        {
            title: "그룹이동",
            action: topo_menu_action.moveGrp
        },
    ],
    m_menu_other: [
        {
            title: "그룹이동",
            action: topo_menu_action.moveGrp
        },
    ],
    s_menu_ap: [
        {
            title: "AP상세정보",
            action: topo_menu_action.view_apDetail
        },
        {
            title: "Client현황",
            action: topo_menu_action.view_apClientStatus
        }
    ],
   
    s_menu_back: [
        {
            title: "최상위그룹",
            action: topo_menu_action.gotoTop
        },
        {
            title: "상위그룹",
            action: topo_menu_action.gotoUp
        }
       
    ],
    s_menu_grp: [
        {
            title: "그룹들어가기",
            action: topo_menu_action.chgGrp
        }
    ],
    s_menu_switch: [
        {
            title: "장비상세정보",
            action: function (elm, d, i) {
            },
            childrenItems: []
        },
        {
            title: "장애발생이력",
            action: function (elm, d, i) {
            },
            childrenItems: []
        },
        {
            title: "실시간이벤트",
            action: function (elm, d, i) {
            },
            childrenItems: []
        },
       
    ],
    s_menu_dev: [
        {
            title: "장비상세정보",
            action: topo_menu_action.view_devDetail
        },
    ],
    s_menu_svr: [
        {
            title: "서버상세정보",
            action: topo_menu_action.view_svrDetail
        },
    ],
    
   
};

export default topo_menu;
