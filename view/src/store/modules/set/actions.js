import { dispatch } from 'd3';
import axios from 'axios'

export default {
    addTab({dispatch}, saveData) {
      axios.post('/api/dash/setting/addTab', saveData).then((res) => {
        dispatch('initTabs')
      });
    },

    initTabs({commit}) {
      axios.get('/api/dash/setting/getTabList').then((res) => {
        commit('setTabs', res)
      })
    },

    initTabRotation({commit}, tabRotation) {
      commit('setTabRotation', Number(tabRotation));
    },

    initTabUse({commit}, tabUse) {
      commit('setTabUse', Number(tabUse))
    },

    editCurrTabSeq({commit}, tabSeq) {
      commit('setCurrTabSeq', tabSeq)
    }
};
