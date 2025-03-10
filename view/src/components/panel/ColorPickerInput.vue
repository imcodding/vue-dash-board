<template>
  <div>
    <div class="color-picker">
      <div style="float: left; width: 30%; margin-right: 3px; margin-left: 3px;">
        <input
          v-model="localColor"
          type="text"
          :placeholder="placeholder"
          class="p_inputTxt"
          style="width: 100px;"
        />
      </div>
      <input
        type="color"
        class="color-picker__color"
        v-model="localColor"
        style="margin-top: 0px; margin-left: 2px; height: 32px; width: 32px;"
        :style="[backgroundStyle, stylePickerPosition]"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "ColorPickerInput",
  data() {
    return {

    }
  },
  props: {
    value: {
      type: String,
      default: "#000000",
    },
    placeholder: {
      type: String,
      default: "#000000",
    },
    labelName: {
      type: String,
      default: "Color",
    },
    labelClass: {
      type: String,
      default: "mb-2",
    },
    stylePickerPosition: {
      type: Object,
      default() {
        return { left: "10px"  };
      },
    },
    stylePaddingPicker: {
      type: String,
      default: "padding-left: 35px;",
    },
    inputClass: {
      type: String,
      default: "form-control",
    },
  },
  computed: {
    localColor: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("change", val);
        this.$emit("input", val);
      },
    },
    backgroundStyle() {
      return {
        background:
          this.localColor.length > 0 && this.localColor.length === 7
            ? this.localColor
            : "#000000",
      };
    },
  },
};
</script>

