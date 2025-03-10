import axios from 'axios';

const map = {
  namespaced: true,
  state: {
    mapObj: null,
    mapData: [],
    center: [37.5648188, 126.9119496],
    zoom: 10
  },
  actions: {
    searchItem(context, params) {
      axios.post("/api/d3map/gisTopo/getGisItemList", params).then((result) => {
        context.commit('setMapData', result)
      })
    },
    initPostion(context, params) {
      context.commit('setPosition', params)
    }
  },
  mutations: {
    setMapData(state, payload) {
      state.mapData = payload;
    },
    setPosition(state, payload) {
      state.center = [payload.gisLat, payload.gisLnt];
      state.zoom = payload.gisZoom;
    },
    setMap(state, payload) {
      state.mapObj = payload;
    }
  }
}

export default map