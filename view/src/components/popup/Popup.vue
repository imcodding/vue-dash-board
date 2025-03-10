<template>
  <div>
    <modal-popup v-if="isModal"
    :name="popupName"
    :params="popupParams"
    :width="popupWidth"
    :height="popupHeight"
    :title="popupTitle"
    @completed="completedModal"
    @close="modal"
    />
  </div>
</template>

<script>
import ModalPopup from './ModalPopup.vue';

export default {
  components: {
    ModalPopup
  },
  
  data() {
    return {

    }
  },

  computed: {
    isModal() {
      return this.$store.state.dash.isPopup
    },
    popupName() {
      return this.$store.state.dash.popupName
    },
    popupWidth() {
      return this.$store.state.dash.popupWidth
    },
    popupHeight() {
      return this.$store.state.dash.popupHeight
    },

    popupTitle() {
      return this.$store.state.dash.popupTitle
    },
    popupParams() {
      return this.$store.state.dash.popupParams
    }
  },

  methods: {
    completedModal() {

    },
    modal() {

    }
  }
}
</script>

<style>
</style>