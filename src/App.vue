<template>
  <div id="app" class="App">
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import fetchKey from "./utils/fetch-key";
import store from "@/store";
import { LocalStorage } from "./enums/local-storage";

export default Vue.extend({
  created() {
    fetchKey().then((clientId) => {
      store.commit("setApiKey", clientId);
    });

    const favorites = localStorage.getItem(LocalStorage.Favorites);
    const user = localStorage.getItem(LocalStorage.User);
    const profileId = localStorage.getItem(LocalStorage.ProfileId);

    if (!!favorites && !!user && !!profileId) {
      const parsedFavorites = JSON.parse(favorites);
      const parsedUser = JSON.parse(user);
      const parsedProfileId = JSON.parse(profileId);
      store.commit("setFavorites", parsedFavorites);
      store.commit("setUser", parsedUser);
      store.commit("setProfileId", parsedProfileId);
      this.$router.push("/player");
    }
  },
});
</script>

<style lang="scss">
@import "@/assets/scss/main";

.App {
  height: 100%;
}
</style>
