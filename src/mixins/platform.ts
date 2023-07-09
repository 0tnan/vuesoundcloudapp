import Vue from "vue";
import { mapGetters } from "vuex";
import { Platform } from "@/enums/platform";

export default Vue.extend({
  computed: {
    ...mapGetters(["getPlatform"]),
    isIos(): boolean {
      return this.getPlatform === Platform.ios ? true : false;
    },
    isWeb(): boolean {
      return this.getPlatform === Platform.web ? true : false;
    },
    isAndroid(): boolean {
      return this.getPlatform === Platform.android ? true : false;
    },
  },
});
