import Vue from "vue";
import getProfile from "../utils/soundcloud/get-profile";
import {
  getFavorites,
  getProfileInfos,
} from "../utils/soundcloud/soundcloud-api";
import store from "@/store";
import { urlRegex } from "../utils/soundcloud/regex";
import { mapGetters } from "vuex";
import { LocalStorage } from "../enums/local-storage";

export interface ProfileMixin {
  getProfile: () => void;
}

export default Vue.extend({
  data() {
    return {
      url: "",
      error: "Not a valid SoundCloud URL !",
      hasError: false,
      isFetching: false,
      route: true,
    };
  },
  computed: {
    ...mapGetters([
      "getSoundCloudApiKey",
      "getSoundCloudProfileId",
      "getSoundCloudFavorites",
      "getSoundCloudUser",
      "getDarkMode",
    ]),
  },
  methods: {
    getProfile() {
      if (urlRegex.test(this.url)) {
        this.hasError = false;
        getProfile(this.url)
          .then((soundcloudId) => {
            store.commit("setSoundCloudProfileId", soundcloudId);
            this.fetchDatas();
          })
          .catch(() => {
            this.hasError = true;
            this.error = "Profile Not Found!";
          });
      } else {
        this.hasError = true;
      }
    },
    fetchDatas() {
      this.isFetching = true;
      Promise.all([
        getFavorites(this.getSoundCloudApiKey, this.getSoundCloudProfileId),
        getProfileInfos(this.getSoundCloudApiKey, this.getSoundCloudProfileId),
      ])
        .then((responses) => {
          store.commit("setSoundCloudFavorites", responses[0]);
          store.commit("setSoundCloudUser", responses[1]);
          store.commit(
            "setSoundCloudNextUrl",
            this.getSoundCloudFavorites.next_href
          );
          const userJSON = JSON.stringify(this.getSoundCloudUser);
          const profileIdJSON = JSON.stringify(this.getSoundCloudProfileId);
          localStorage.setItem(LocalStorage.SoundCloudUser, userJSON);
          localStorage.setItem(LocalStorage.SoundCloudProfileId, profileIdJSON);
          this.$emit("populate");
          this.isFetching = false;
          if (this.route) {
            this.$router.push("/player-selector");
          }
        })
        .catch(() => {
          this.hasError = true;
          this.error = "An error occured !";
          this.isFetching = false;
        });
    },
  },
});
