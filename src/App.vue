<template>
  <div
    id="app"
    class="App"
    :class="{ 'App--dark': getDarkMode, 'App--ios': isIos }"
  >
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import fetchKey from "./utils/fetch-key";
import store from "@/store";
import { LocalStorage } from "./enums/local-storage";
import { DarkMode } from "@/enums/dark-mode";
import { getFavorites } from "./utils/soundcloud-api";
import { StatusBar, Style } from "@capacitor/status-bar";
import { Keyboard, KeyboardResize } from "@capacitor/keyboard";
import { Capacitor } from "@capacitor/core";
import { mapGetters } from "vuex";

export default Vue.extend({
  async created() {
    const darkMode = localStorage.getItem(LocalStorage.DarkMode);
    let parsedDarkMode = "" as DarkMode;
    if (darkMode) {
      parsedDarkMode = JSON.parse(darkMode);
    }
    if (parsedDarkMode === DarkMode.Dark) {
      store.commit("setDarkMode", true);
    } else {
      store.commit("setDarkMode", false);
    }

    if (Capacitor.getPlatform() === "ios") {
      this.isIos = true;
      if (this.getDarkMode) {
        await StatusBar.setStyle({ style: Style.Dark });
      } else {
        await StatusBar.setStyle({ style: Style.Light });
      }
      Keyboard.setScroll({ isDisabled: true });
      Keyboard.setResizeMode({ mode: KeyboardResize.None });
    }

    const user = localStorage.getItem(LocalStorage.User);
    const profileId = localStorage.getItem(LocalStorage.ProfileId);
    let parsedUser = "";
    let parsedProfileId = "";

    if (!!user && !!profileId) {
      parsedUser = JSON.parse(user);
      parsedProfileId = JSON.parse(profileId);
      store.commit("setUser", parsedUser);
      store.commit("setProfileId", parsedProfileId);
    }

    fetchKey().then((clientId: string) => {
      store.commit("setApiKey", clientId);

      if (parsedProfileId) {
        getFavorites(clientId, parsedProfileId).then((response) => {
          store.commit("setFavorites", response);
          store.commit("setNextUrl", response.next_href);
          this.$router.push("/player");
        });
      }
    });
  },
  data() {
    return {
      isIos: false,
    };
  },
  computed: {
    ...mapGetters(["getDarkMode"]),
  },
});
</script>

<style lang="scss">
@import "@/assets/scss/main";

.App {
  height: 100%;
  padding: 0;
  transition: all 0.5s;

  &--dark {
    background: $black;
  }

  &--ios {
    padding: 5rem 0;
  }
}
</style>
