import axios from 'axios';
import HmUtil from '../../js/common/hm.util';
const code = {
  namespaced: true,
  state: {
    codeList : {}
  },
  actions: {
    //code10. WEB_CONF 설정
    initCodes(context) {
      axios.get('/api/getCodeList').then(res => {
        for (let evtConf of res) {
          context.commit('setCodes', evtConf)
        }
      })
    },
    
  },
  mutations: {
    setCodes(state, payload) {
      const codeId = HmUtil.convertToCamel(payload.codeId);
      state.codeList[codeId] = payload;
    }
  }
}

export default code
