<template>
  <div>
        <l-map id="gisCanvas"
      :zoom="20"
      :center="[37.5648188,126.9119496]"
      style="height: 700px; width: 100%; "
    >
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='http://osm.org/copyrighte'>OpenStreetMap</a> contributors"
      />
      <v-marker-cluster>
        <l-marker v-for="item, key in result" :key="key"
          :lat-lng="[`${item.lat}`, `${item.lnt}`]"
        >
        <l-icon
          :icon-size="dynamicSize"
          :icon-anchor="dynamicAnchor"
          :icon-url="'/static/img/d3/micons/' +`${item.img}`+'.PNG'"
        />
      </l-marker>
        
      </v-marker-cluster>
    </l-map>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LIcon  } from "vue2-leaflet";
import L from "leaflet";
import Vue2LeafletMarkerCluster from "vue2-leaflet-markercluster";
import 'leaflet/dist/leaflet.css';
import "../assets/css/MarkerCluster.css"
import "../assets/css/MarkerCluster.Default.css"

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LIcon,
    "v-marker-cluster": Vue2LeafletMarkerCluster
  },
  mounted() {
    this.D3Topology.initialize();
    this.D3Topology.getTopGrp();
  },
  computed: {
    mapData() {
      return this.$store.state.gis.mapData;
    },
    dynamicSize() {
      return [this.iconSize, this.iconSize * 1.15];
    },
    dynamicAnchor() {
      return [this.iconSize / 2, this.iconSize * 1.15];
    }
  },
  data() {
    return {
      result: [
        {lat: 37.5648188, lnt: 126.9119496, img: 'AP_A1' },
        {lat: 37.5648188, lnt: 126.9119496, img: 'AP_A1' }
      ],
      defaultIcon: L.icon({
        iconUrl: '/static/img/micons/AP_A1.PNG',
        iconSize: [26, 42],
        iconAnchor: [13, 42],
      }),
      iconSize: 24,

    }
  }
}
</script>

<style>

</style>
