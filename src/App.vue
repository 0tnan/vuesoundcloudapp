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
import { getFavorites } from "./utils/soundcloud-api";

export default Vue.extend({
  created() {
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
});
</script>

<style lang="scss">
@import "@/assets/scss/main";

.App {
  height: 100%;
  padding: 5rem 0;
}
</style>
