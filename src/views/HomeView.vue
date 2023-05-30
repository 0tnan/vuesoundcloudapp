<template>
  <div class="Home">
    <transition name="fade">
      <p v-if="!getApiKey" class="Home-logo">V</p>
      <div v-else class="Home-profile">
        <p class="Home-profileText Text">Fetch From</p>
        <input
          type="text"
          v-model="url"
          class="Home-profileInput Input"
          placeholder='Paste Your SoundCloud Profile Here (no "on." links )'
          @blur="getProfile()"
        />
        <transition name="fade">
          <p v-show="hasError" class="Home-profileError Error">{{ error }}</p>
        </transition>
        <img
          v-if="isFetching"
          class="Home-loading"
          lazy
          src="@/assets/img/loading.gif"
        />
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import getProfile from "../utils/get-profile";
import { getFavorites, getProfileInfos } from "../utils/soundcloud-api";
import store from "@/store";
import { urlRegex } from "../utils/regex";
import { mapGetters } from "vuex";
import { LocalStorage } from "../enums/local-storage";

export default Vue.extend({
  data() {
    return {
      url: "",
      error: "Not a valid SoundCloud URL !",
      hasError: false,
      isFetching: false,
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
          this.isFetching = false;
          this.$router.push("/player");
        })
        .catch(() => {
          this.hasError = true;
          this.error = "An error occured !";
          this.isFetching = false;
        });
    },
  },
});
</script>

<style lang="scss" scoped>
.Home {
  height: 100%;
  padding: 4rem 4.5rem 2.5rem;
  position: relative;

  &-logo {
    font-family: $font-secondary;
    font-size: 30rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: $black;
    height: 100%;
  }

  &-profile {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    font-family: $font-primary;

    &Text {
      font-weight: 700;
    }

    &Text,
    &Input {
      margin-bottom: 0.5rem;
    }

    &Error {
      font-size: $s;
      font-family: $font-primary;
      color: #dc3545;
      font-weight: 300;
    }
  }

  &-loading {
    height: 5rem;
    width: 5rem;
    position: absolute;
    bottom: 25vh;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
