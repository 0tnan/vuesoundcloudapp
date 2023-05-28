import { Favorites } from "@/interfaces/favorites";
import { User } from "@/interfaces/user";
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

interface State {
  apiKey: string;
  user: User;
  profileId: string;
  favorites: Favorites;
}

export default new Vuex.Store({
  state() {
    return {
      apiKey: "",
      user: {} as User,
      profileId: "",
      favorites: {} as Favorites,
    };
  },
  getters: {
    getApiKey(state: State) {
      return state.apiKey;
    },
    getProfileId(state: State) {
      return state.profileId;
    },
    getFavorites(state: State) {
      return state.favorites;
    },
    getUser(state: State) {
      return state.user;
    },
  },
  mutations: {
    setApiKey(state: State, apiKey: string) {
      state.apiKey = apiKey;
    },
    setProfileId(state: State, id: string) {
      state.profileId = id;
    },
    setFavorites(state: State, favorites: Favorites) {
      state.favorites = favorites;
    },
    setUser(state: State, user: User) {
      state.user = user;
    },
  },
  actions: {},
  modules: {},
});
