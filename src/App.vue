<template>
  <div id="app" class="App">
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import fetchKey from "./utils/fetch-key";
import store from "@/store";

export default Vue.extend({
  created() {
    fetchKey().then((clientId) => {
      store.commit("setApiKey", clientId);
    });
  },
});
</script>

<style lang="scss">
@import "@/assets/scss/main";

.App {
  height: 100%;
}
</style>
