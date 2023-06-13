import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import FastClick from "fastclick";

Vue.config.productionTip = false;

new Vue({
  mounted() {
    FastClick.attach(document.body);
  },
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
