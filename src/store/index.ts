import { FavoriteItem } from "@/interfaces/favorite-item";
import { Favorites } from "@/interfaces/favorites";
import { Track } from "@/interfaces/track";
import { User } from "@/interfaces/user";
import { getMediaFinalUrl } from "../utils/soundcloud-api";
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

interface State {
  apiKey: string;
  user: User;
  profileId: string;
  favorites: Favorites;
  nextUrl: string;
  currentSong: Track;
  currentMediaUrl: string;
}

interface Payload {
  track: Track;
  mediaUrl: string;
}

export default new Vuex.Store({
  state() {
    return {
      apiKey: "",
      user: {} as User,
      profileId: "",
      favorites: {} as Favorites,
      nextUrl: "",
      currentSong: {} as Track,
      currentMediaUrl: "",
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
    getNextUrl(state: State) {
      return state.nextUrl;
    },
    getCurrentSong(state: State) {
      return state.currentSong;
    },
    getCurrentMediaUrl(state: State) {
      return state.currentMediaUrl;
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
    addToFavorites(state: State, collection: FavoriteItem[]) {
      state.favorites.collection.push(...collection);
    },
    setUser(state: State, user: User) {
      state.user = user;
    },
    setNextUrl(state: State, nextUrl: string) {
      state.nextUrl = nextUrl;
    },
    setCurrentMediaUrl(state: State, url: string) {
      state.currentMediaUrl = url;
    },
    setCurrentSong(state: State, track: Track) {
      state.currentSong = track;
    },
  },
  actions: {
    updateSong({ commit, getters }, payload: Payload) {
      getMediaFinalUrl(getters.getApiKey, payload.mediaUrl).then((response) => {
        commit("setCurrentMediaUrl", response);
        commit("setCurrentSong", payload.track);
      });
    },
  },
  modules: {},
});
