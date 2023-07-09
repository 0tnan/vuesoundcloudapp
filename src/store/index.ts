import { FavoriteItem } from "@/interfaces/soundcloud/favorite-item";
import { Favorites } from "@/interfaces/soundcloud/favorites";
import { Track } from "@/interfaces/soundcloud/track";
import { User } from "@/interfaces/soundcloud/user";
import { getMediaFinalUrl } from "../utils/soundcloud/soundcloud-api";
import Vue from "vue";
import Vuex from "vuex";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";
import { LocalStorage } from "@/enums/local-storage";
import { DarkMode } from "@/enums/dark-mode";
import { Platform } from "@/enums/platform";

Vue.use(Vuex);

interface State {
  soundCloudState: SoundCloudState;
  spotifyState: SpotifyState;
  isDarkMode: boolean;
  platform: Platform;
}

interface Payload {
  track: Track;
  mediaUrl: string;
  initiator: string;
}

interface SoundCloudState {
  apiKey: string;
  user: User;
  profileId: string;
  favorites: Favorites;
  nextUrl: string;
  currentSong: Track;
  currentMediaUrl: string;
  initiatedBy: string;
}

interface SpotifyState {
  clientId: string;
  user: string;
  apiKey: string;
}

function handleDarkMode(mode: boolean) {
  if (mode) {
    localStorage.setItem(LocalStorage.DarkMode, JSON.stringify(DarkMode.Dark));
  } else {
    localStorage.setItem(LocalStorage.DarkMode, JSON.stringify(DarkMode.Light));
  }
}

export default new Vuex.Store({
  state() {
    return {
      soundCloudState: {
        apiKey: "",
        user: {} as User,
        profileId: "",
        favorites: {} as Favorites,
        nextUrl: "",
        currentSong: {} as Track,
        currentMediaUrl: "",
        initiatedBy: "",
      } as SoundCloudState,
      spotifyState: {
        clientId: "",
        user: "",
        apiKey: "",
      } as SpotifyState,
      isDarkMode: true,
      platform: Platform.web,
    };
  },
  getters: {
    getSoundCloudApiKey(state: State) {
      return state.soundCloudState.apiKey;
    },
    getSoundCloudProfileId(state: State) {
      return state.soundCloudState.profileId;
    },
    getSoundCloudFavorites(state: State) {
      return state.soundCloudState.favorites;
    },
    getSoundCloudUser(state: State) {
      return state.soundCloudState.user;
    },
    getSoundCloudNextUrl(state: State) {
      return state.soundCloudState.nextUrl;
    },
    getSoundCloudCurrentSong(state: State) {
      return state.soundCloudState.currentSong;
    },
    getSoundCloudCurrentMediaUrl(state: State) {
      return state.soundCloudState.currentMediaUrl;
    },
    getDarkMode(state: State) {
      return state.isDarkMode;
    },
    getSoundCloudInitiator(state: State) {
      return state.soundCloudState.initiatedBy;
    },
    getPlatform(state: State) {
      return state.platform;
    },
  },
  mutations: {
    setSoundCloudApiKey(state: State, apiKey: string) {
      state.soundCloudState.apiKey = apiKey;
    },
    setSoundCloudProfileId(state: State, id: string) {
      state.soundCloudState.profileId = id;
    },
    setSoundCloudFavorites(state: State, favorites: Favorites) {
      state.soundCloudState.favorites = favorites;
    },
    addToSoundCloudFavorites(state: State, collection: FavoriteItem[]) {
      state.soundCloudState.favorites.collection.push(...collection);
    },
    setSoundCloudUser(state: State, user: User) {
      state.soundCloudState.user = user;
    },
    setSoundCloudNextUrl(state: State, nextUrl: string) {
      state.soundCloudState.nextUrl = nextUrl;
    },
    setSoundCloudCurrentMediaUrl(state: State, url: string) {
      state.soundCloudState.currentMediaUrl = url;
    },
    setSoundCloudCurrentSong(state: State, track: Track) {
      state.soundCloudState.currentSong = track;
    },
    setSoundCloudInitiator(state: State, initiator: string) {
      if (initiator) {
        state.soundCloudState.initiatedBy = initiator;
      }
    },
    toggleDarkMode(state: State) {
      state.isDarkMode = !state.isDarkMode;
      handleDarkMode(state.isDarkMode);
    },
    setDarkMode(state: State, value: boolean) {
      state.isDarkMode = value;
      handleDarkMode(state.isDarkMode);
    },
    resetSoundCloudState(state: State) {
      state.soundCloudState.user = {} as User;
      state.soundCloudState.profileId = "";
      state.soundCloudState.favorites = {} as Favorites;
      state.soundCloudState.nextUrl = "";
      state.soundCloudState.currentSong = {} as Track;
      state.soundCloudState.currentMediaUrl = "";
    },
    setPlatform(state: State, value: Platform) {
      state.platform = value;
    },
  },
  actions: {
    updateSoundCloudSong({ commit, getters }, payload: Payload) {
      getMediaFinalUrl(getters.getSoundCloudApiKey, payload.mediaUrl).then(
        (response) => {
          commit("setSoundCloudCurrentMediaUrl", response);
          commit("setSoundCloudCurrentSong", payload.track);
          commit("setSoundCloudInitiator", payload.initiator);
        }
      );
    },
    async toggleDarkMode({ commit, getters }) {
      if (Capacitor.getPlatform() === "ios") {
        if (getters.getDarkMode) {
          await StatusBar.setStyle({ style: Style.Light });
        } else {
          await StatusBar.setStyle({ style: Style.Dark });
        }
      }
      commit("toggleDarkMode");
    },
  },
  modules: {},
});
