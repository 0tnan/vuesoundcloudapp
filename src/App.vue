<template>
  <div
    id="app"
    class="App"
    :class="{
      'App--dark': getDarkMode,
      'App--ios': isIos,
      'App--web': isWeb,
      'App--android': isAndroid,
    }"
  >
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import fetchKey from "./utils/soundcloud/fetch-key";
import store from "@/store";
import { LocalStorage } from "./enums/local-storage";
import { DarkMode } from "@/enums/dark-mode";
import { getFavorites } from "./utils/soundcloud/soundcloud-api";
import { StatusBar, Style } from "@capacitor/status-bar";
import { Keyboard, KeyboardResize } from "@capacitor/keyboard";
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import { mapGetters } from "vuex";
import { Platform } from "@/enums/platform";
import { Players } from "@/enums/players";
import PlatformMixin from "@/mixins/platform";

export default Vue.extend({
  mixins: [PlatformMixin],
  async created() {
    const darkMode = localStorage.getItem(LocalStorage.DarkMode);
    let parsedDarkMode = "" as DarkMode;
    if (darkMode) {
      parsedDarkMode = JSON.parse(darkMode);
    }
    if (parsedDarkMode === DarkMode.Light) {
      store.commit("setDarkMode", false);
    } else {
      store.commit("setDarkMode", true);
    }

    if (Capacitor.getPlatform() === Platform.ios) {
      store.commit("setPlatform", Platform.ios);
      if (this.getDarkMode) {
        await StatusBar.setStyle({ style: Style.Dark });
      } else {
        await StatusBar.setStyle({ style: Style.Light });
      }
      Keyboard.setScroll({ isDisabled: true });
      Keyboard.setResizeMode({ mode: KeyboardResize.None });
    } else if (Capacitor.getPlatform() === Platform.android) {
      store.commit("setPlatform", Platform.android);
    } else {
      store.commit("setPlatform", Platform.web);
    }

    const soundcloudUser = localStorage.getItem(LocalStorage.SoundCloudUser);
    const soundcloudProfileId = localStorage.getItem(
      LocalStorage.SoundCloudProfileId
    );
    const spotifyAccessToken = localStorage.getItem(
      LocalStorage.SpotifyAccessToken
    );
    const spotifyRefreshToken = localStorage.getItem(
      LocalStorage.SpotifyRefreshToken
    );

    let parsedSoundCloudUser = "";
    let parsedSoundCloudProfileId = "";
    let parsedSpotifyAccessToken = "";
    let parsedSpotifyRefreshToken = "";

    if (!!soundcloudUser && !!soundcloudProfileId) {
      parsedSoundCloudUser = JSON.parse(soundcloudUser);
      parsedSoundCloudProfileId = JSON.parse(soundcloudProfileId);
      store.commit("setSoundCloudUser", parsedSoundCloudUser);
      store.commit("setSoundCloudProfileId", parsedSoundCloudProfileId);
    }

    if (!!spotifyAccessToken && !!spotifyRefreshToken) {
      parsedSpotifyAccessToken = JSON.parse(spotifyAccessToken);
      parsedSpotifyRefreshToken = JSON.parse(spotifyRefreshToken);
      store.commit("setSpotifyAccessToken", parsedSpotifyAccessToken);
      store.commit("setSpotifyRefreshToken", parsedSpotifyRefreshToken);
    }

    fetchKey()
      .then((clientId: string) => {
        store.commit("setSoundCloudApiKey", clientId);

        if (parsedSoundCloudProfileId) {
          getFavorites(clientId, parsedSoundCloudProfileId).then((response) => {
            store.commit("setSoundCloudFavorites", response);
            store.commit("setSoundCloudNextUrl", response.next_href);
            this.$router.push("/player-selector").catch(() => {
              // DO NOTHING IF ALREADY HERE
            });
          });
        }
      })
      .catch(() => {
        //
      });
  },
  async mounted() {
    await App.addListener("appUrlOpen", (data) => {
      if (this.getActiveTab === Players.spotify) {
        store.commit("setSpotifyAuthorizationCode", data.url.split("code=")[1]);
      }
    });
  },
  computed: {
    ...mapGetters(["getDarkMode", "getActiveTab"]),
  },
});
</script>

<style lang="scss">
@import "@/assets/scss/main";

.App {
  height: 100%;
  padding: 1rem 0 0;
  transition: all 0.5s;

  &--dark {
    background: $black;
  }

  &--ios {
    padding: 5rem 0 0;
  }
}
</style>
