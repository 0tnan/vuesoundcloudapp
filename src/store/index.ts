import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

interface State {
  apiKey: string;
  profileName: string;
  profileId: string;
}

export default new Vuex.Store({
  state() {
    return {
      apiKey: "",
      profileName: "",
      profileId: "",
    };
  },
  getters: {
    getApiKey(state: State) {
      return state.apiKey;
    },
    getProfileId(state: State) {
      return state.profileId;
    },
  },
  mutations: {
    setApiKey(state: State, apiKey: string) {
      state.apiKey = apiKey;
    },
    setProfileId(state: State, id: string) {
      state.profileId = id;
    },
  },
  actions: {},
  modules: {},
});
