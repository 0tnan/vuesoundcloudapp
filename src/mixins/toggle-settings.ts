import Vue from "vue";

export default Vue.extend({
  data() {
    return {
      showSettings: false,
    };
  },
  methods: {
    toggleSettings() {
      this.showSettings = !this.showSettings;
    },
  },
});
