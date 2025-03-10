import { dispatch } from 'd3';
import types, {CHANGE_ZINDEX} from './mutation-types';
import axios from 'axios'
import WidgetControlJS from '@/js/common/widget/widget.control.js'
export default {
    setActive({commit, state}, {id}) {
        for (let i = 0, l = state.rects.length; i < l; i++) {
            if (i === id) {
                commit(types.ENABLE_ACTIVE, i);
                continue;
            }

            commit(types.DISABLE_ACTIVE, i);
        }
    },
    unsetActive({commit}, {id}) {
        commit(types.DISABLE_ACTIVE, id);
    },

    toggleDraggable({commit, state}, {id}) {
        if (!state.rects[id].draggable) {
            commit(types.ENABLE_DRAGGABLE, id);
        } else {
            commit(types.DISABLE_DRAGGABLE, id);
        }
    },

    toggleResizable({commit, state}, {id}) {
        if (!state.rects[id].resizable) {
            commit(types.ENABLE_RESIZABLE, id);
        } else {
            commit(types.DISABLE_RESIZABLE, id);
        }
    },

    toggleParentLimitation({commit, state}, {id}) {
        if (!state.rects[id].parentLim) {
            commit(types.ENABLE_PARENT_LIMITATION, id);
        } else {
            commit(types.DISABLE_PARENT_LIMITATION, id);
        }
    },

    toggleSnapToGrid({commit, state}, {id}) {
        if (!state.rects[id].snapToGrid) {
            commit(types.ENABLE_SNAP_TO_GRID, id);
        } else {
            commit(types.DISABLE_SNAP_TO_GRID, id);
        }
    },

    setAspect({commit}, {id}) {
        commit(types.ENABLE_ASPECT, id);
    },
    unsetAspect({commit}, {id}) {
        commit(types.DISABLE_ASPECT, id);
    },

    setWidth({commit}, {id, width}) {
        commit(types.CHANGE_WIDTH, {id, width});
    },

    setHeight({commit}, {id, height}) {
        commit(types.CHANGE_HEIGHT, {id, height});
    },

    setTop({commit}, {id, top}) {
        commit(types.CHANGE_TOP, {id, top});
    },

    setLeft({commit}, {id, left}) {
        commit(types.CHANGE_LEFT, {id, left});
    },

    changeXLock({commit, state}, {id}) {
        switch (state.rects[id].axis) {
            case 'both':
                commit(types.ENABLE_Y_AXIS, id);
                break;
            case 'x':
                commit(types.ENABLE_NONE_AXIS, id);
                break;
            case 'y':
                commit(types.ENABLE_BOTH_AXIS, id);
                break;
            case 'none':
                commit(types.ENABLE_X_AXIS, id);
                break;
        }
    },

    changeYLock({commit, state}, {id}) {
        switch (state.rects[id].axis) {
            case 'both':
                commit(types.ENABLE_X_AXIS, id);
                break;
            case 'x':
                commit(types.ENABLE_BOTH_AXIS, id);
                break;
            case 'y':
                commit(types.ENABLE_NONE_AXIS, id);
                break;
            case 'none':
                commit(types.ENABLE_Y_AXIS, id);
                break;
        }
    },

    changeZToBottom({commit, state}, {id}) {
        if (state.rects[id].zIndex === 1) {
            return
        }

        commit(types.CHANGE_ZINDEX, {id, zIndex: 1});

        for (let i = 0, l = state.rects.length; i < l; i++) {
            if (i !== id) {
                if(state.rects[i].zIndex === state.rects.length){
                    continue
                }
                commit(types.CHANGE_ZINDEX, {id: i, zIndex: state.rects[i].zIndex + 1});
            }
        }
    },

    changeZToTop({commit, state}, {id}) {
        if (state.rects[id].zIndex === state.rects.length) {
            return
        }

        commit(types.CHANGE_ZINDEX, {id, zIndex: state.rects.length});

        for (let i = 0, l = state.rects.length; i < l; i++) {
            if (i !== id) {
                if(state.rects[i].zIndex === 1){
                    continue
                }
                commit(types.CHANGE_ZINDEX, {id: i, zIndex: state.rects[i].zIndex - 1});
            }
        }
    },

    setMinWidth({commit}, {id, width}) {
        commit(types.CHANGE_MINW, {id, minw:width});
    },

    setMinHeight({commit}, {id, height}) {
        commit(types.CHANGE_MINH, {id, minh:height});
    },

    setPrevent({commit}, {id}) {
        commit(types.ENABLE_PREVENT, id);
    },
    unsetPrevent({commit}, {id}) {
        commit(types.DISABLE_PREVENT, id);
    },
    togglePrevent({commit, state}, {id}) {
        if (!state.rects[id].prevent) {
            commit(types.ENABLE_PREVENT, id);
        } else {
            commit(types.DISABLE_PREVENT, id);
        }
    },

    setResizable({commit}, {id}) {
        commit(types.ENABLE_RESIZABLE, id)
    },
    unsetResizable({commit}, {id}) {
        commit(types.DISABLE_RESIZABLE, id)
    },

    initRects({commit, state}, {mode, tabSeq}) {

      const parms = {
        // tabIdx: state.curTabIdx
        tabSeq: tabSeq ? tabSeq : 1
      };
        axios.get('/api/getWidgetResizeList', { params: parms }).then((res) => {
            // DB에 저장하지 않는 기본 속성 값 설정
            for(let rect of res) {

              rect.icon = 'true'; //아이콘 설정
              rect.title = 'true'; //타이틀 설정
              rect.titleIcon = 'LineUse'; //타이틀 아이콘
              if (rect.conf != null) {
                let widgetConf = JSON.parse(rect.conf);
                if (widgetConf.icon != undefined) {
                  rect.icon = widgetConf.icon;
                }
                if (widgetConf.title != undefined) {
                  rect.title = widgetConf.title;
                }
                //타이틀 아이콘 설정 (widget.control.js 에서 고유 위젯별 제어 -> 기본 위젯 설정(setTitle.vue)에서 제어
                //미설정 빈 위젯을 위한
                if (widgetConf.titleIcon != undefined) { 
                  //rect.titleIcon = 'background: url("/static/img/' + widgetConf.titleIcon +'.svg") no-repeat';
                  rect.titleIcon = widgetConf.titleIcon
                }
              }

              rect.active = false;
              rect.prevent = mode == 'EDIT' ? false : true;
              rect.resizable = false;
            }
            commit('setRects', res)
        })
    },

    changeRect({commit}, {id, rect}) {
        commit(types.CHANGE_TOP, {id, top: rect.top});
        commit(types.CHANGE_LEFT, {id, left: rect.left});
        commit(types.CHANGE_WIDTH, {id, width: rect.width});
        commit(types.CHANGE_HEIGHT, {id, height: rect.height});
    },

    setRect({commit}, {id, rect}) {
        commit('setRect', {id, rect})
    },

    addRect({commit, state}, newRect) {
        let isFirst = true;
        for(const rect of state.rects) {
            if(rect.top == 0 && rect.left == 0) isFirst = false;
        }

        // 추가 시, 위치가 겹치지 않게 하기 위해서
        if(!isFirst) {
            let dist = newRect.dist ? newRect.dist : 10;
            let xMax = -1;
            let yMax = -1;

            for(const rect of state.rects) {
                let a = rect.left / dist
                let b = rect.top / dist
                let c = rect.x % dist
                let d = rect.y % dist

                if(a != b) continue
            // if(rect.x % dist != 0 || rect.y % dist != 0) continue

                if(a > xMax) xMax = a;
                if(b > yMax) yMax = b;
            }

            newRect.left = (xMax + 1) * dist;
            newRect.top = (yMax + 1) * dist;
        }

        commit('addRect', newRect)
    },

    deleteRect({commit}, id) {
        if(!confirm('삭제하시겠습니까?')) return;
        commit('deleteRect', id)
    },

    copyRect({commit, state}, {rect, distX, distY}) {
        let copyRect = {...rect};

        copyRect.left += distX;
        copyRect.top += distY;
        copyRect.itemSeq = state.rects[state.rects.length - 1].itemSeq + 1;

        commit('copyRect', copyRect);
    },

    restoreRect({commit, state}, {rect, id}) {
        let restoreRect = {};
        //크기 및 위치 설정은 이슈 있어서 제외하고 위젯만 되돌리는 형태
        if(rect.itemSeq) { restoreRect = state.originalRects[id]; }

        restoreRect.width = rect.width;
        restoreRect.height = rect.height;
        restoreRect.left = rect.x;
        restoreRect.top = rect.y;

        commit('setRect', {id, rect: restoreRect})
    },

    saveRects({dispatch, state}, {mode, tabSeq}) {
        axios.post('/api/addWidgetResizeList', {list: state.rects, tabSeq: tabSeq}).then((res) => {
            alert("저장되었습니다.");
            dispatch('initRects', {mode: mode, tabSeq: tabSeq})
        })
    },

    widgetRect({dispatch, state}, {id, widget}) {
        if(id < 0) { alert('레이아웃을 선택해주세요.'); return; }

        const noWidgetList = ['LOGO','TITLE','TIMESET']
        let rect = state.rects[id];
        if(noWidgetList.includes(rect.type)) {
            alert('위치 이동만 가능합니다.');
            return;
        }

        dispatch('setActive', {id});
        dispatch('unsetResizable', {id});

        let widgetRect = {...rect, ...widget};

        dispatch('setRect', {id, rect: widgetRect});
    },

    setRectValue({commit}, {idx, valueKey}) {
        commit('setRectValue', {idx, valueKey})
    }
};
