<template>
  <div>
    <div id="section" style="width:100%;height:100%">
      <div id="mapCanvas" style="width:100%;height: 100%;"></div>
      <div id="gisCanvas" style="height: 700px;width: 1195px;">
        <l-map ref="myMap"
      :zoom="20"
      :center="mapCenter"
      style="height: 100%; width: 100%;"
    >
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='http://osm.org/copyrighte'>OpenStreetMap</a> contributors"
      />
      <v-marker-cluster>
        <l-marker v-for="item, key in mapData" :key="key" @dblclick="onMarkerClick"
          :lat-lng="[`${item.lat}`, `${item.lnt}`]"
        >
        <l-icon
          :icon-size="dynamicSize"
          :icon-url="'/static/img/d3/micons/' +`${item.devKind2}`+'.PNG'"
        />
      </l-marker>
      </v-marker-cluster>
    </l-map>
      </div>
      <div style="display: none; position: absolute; left: 10px; top: 10px; padding: 5px; color: #fff; background: rgba(66, 134, 244, 1)">그룹: <span id="map_curGrpNm" alt="전체"></span></div>
    </div>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LIcon } from "vue2-leaflet";
import Vue2LeafletMarkerCluster from "vue2-leaflet-markercluster";
import 'leaflet/dist/leaflet.css';
import "../../assets/css/MarkerCluster.css"
import "../../assets/css/MarkerCluster.Default.css"

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LIcon,
    "v-marker-cluster": Vue2LeafletMarkerCluster
  },
  created() {

  },
  mounted() {
    this.D3Topology.initialize();
    this.D3Topology.getTopGrp();
    $('#gisCanvas').hide()

    this.$store.commit('map/setMap', this.$refs.myMap.mapObject);
  },
  computed: {
    mapData() {
      return this.$store.state.map.mapData;
    },
    mapCenter() {
      return this.$store.state.map.center;
    },
    dynamicSize() {
      return [this.iconSize, this.iconSize ];
    },
    dynamicAnchor() {
      return [this.iconSize / 2, this.iconSize * 1.15];
    },
  },
  methods: {
    onMarkerClick() {
      
    }
  },
  
  data() {
    return {
      iconSize: 24
    }
  }
}
</script>

<style>

</style>
