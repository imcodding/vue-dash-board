export default {

    setTabs(state, payload) {
      state.tabs = payload;
      if(state.tabs.length > 0) state.currTabSeq = state.tabs[0].tabSeq;
    },

    setTabRotation(state, payload) {
      state.tabRotation = payload;
    },

    setTabUse(state, payload) {
      state.tabUse = payload;
    },

    setCurrTabSeq(state, payload) {
      state.currTabSeq = payload;
    }
};
