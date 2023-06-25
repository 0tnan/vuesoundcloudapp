import Vue from "vue";
import getProfile from "../utils/get-profile";
import { getFavorites, getProfileInfos } from "../utils/soundcloud-api";
import store from "@/store";
import { urlRegex } from "../utils/regex";
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
    ...mapGetters(["getApiKey", "getProfileId", "getFavorites", "getUser"]),
  },
  methods: {
    getProfile() {
      if (urlRegex.test(this.url)) {
        this.hasError = false;
        getProfile(this.url)
          .then((soundcloudId) => {
            store.commit("setProfileId", soundcloudId);
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
        getFavorites(this.getApiKey, this.getProfileId),
        getProfileInfos(this.getApiKey, this.getProfileId),
      ])
        .then((responses) => {
          store.commit("setFavorites", responses[0]);
          store.commit("setUser", responses[1]);
          store.commit("setNextUrl", this.getFavorites.next_href);
          const userJSON = JSON.stringify(this.getUser);
          const profileIdJSON = JSON.stringify(this.getProfileId);
          localStorage.setItem(LocalStorage.User, userJSON);
          localStorage.setItem(LocalStorage.ProfileId, profileIdJSON);
          this.$emit("populate");
          this.isFetching = false;
          if (this.route) {
            this.$router.push("/player");
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
