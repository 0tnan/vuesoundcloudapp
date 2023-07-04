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
import fetchKey from "./utils/soundcloud/fetch-key";
import store from "@/store";
import { LocalStorage } from "./enums/local-storage";
import { DarkMode } from "@/enums/dark-mode";
import { getFavorites } from "./utils/soundcloud/soundcloud-api";
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
    if (parsedDarkMode === DarkMode.Light) {
      store.commit("setDarkMode", false);
    } else {
      store.commit("setDarkMode", true);
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

    const soundcloudUser = localStorage.getItem(LocalStorage.SoundCloudUser);
    const soundcloudProfileId = localStorage.getItem(
      LocalStorage.SoundCloudProfileId
    );
    let parsedSoundCloudUser = "";
    let parsedSoundCloudProfileId = "";

    if (!!soundcloudUser && !!soundcloudProfileId) {
      parsedSoundCloudUser = JSON.parse(soundcloudUser);
      parsedSoundCloudProfileId = JSON.parse(soundcloudProfileId);
      store.commit("setSoundCloudUser", parsedSoundCloudUser);
      store.commit("setSoundCloudProfileId", parsedSoundCloudProfileId);
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
        console.error("No key bitch");
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
