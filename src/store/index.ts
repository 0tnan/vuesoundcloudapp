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
import { Players } from "@/enums/players";

Vue.use(Vuex);

interface State {
  soundCloudState: SoundCloudState;
  spotifyState: SpotifyState;
  isDarkMode: boolean;
  platform: Platform;
  activeTab: string;
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
  codeVerifier: string;
  user: string;
  redirectURIWeb: string;
  redirectURIAndroid: string;
  redirectURIIos: string;
  authorizationCode: string;
  accessToken: string;
  refreshToken: string;
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
        codeVerifier: "",
        clientId: "c6e30915757446b89e02fce3477fbd41",
        user: "",
        authorizationCode: "",
        redirectURIWeb: "http://localhost:8080/player-selector",
        redirectURIAndroid: "com.app.omniwave:/",
        redirectURIIos: "com.app.omniwave:/",
        accessToken: "",
        refreshToken: "",
      } as SpotifyState,
      isDarkMode: true,
      platform: Platform.web,
      activeTab: "",
    };
  },
  getters: {
    getSpotifyClientId(state: State) {
      return state.spotifyState.clientId;
    },
    getSpotifyCodeVerifier(state: State) {
      return state.spotifyState.codeVerifier;
    },
    getSpotifyUser(state: State) {
      return state.spotifyState.user;
    },
    getSpotifyRedirectURIWeb(state: State) {
      return state.spotifyState.redirectURIWeb;
    },
    getSpotifyRedirectURIIos(state: State) {
      return state.spotifyState.redirectURIIos;
    },
    getSpotifyRedirectURIAndroid(state: State) {
      return state.spotifyState.redirectURIAndroid;
    },
    getSpotifyAuthorizationCode(state: State) {
      return state.spotifyState.authorizationCode;
    },
    getSpotifyAccessToken(state: State) {
      return state.spotifyState.accessToken;
    },
    getSpotifyRefreshToken(state: State) {
      return state.spotifyState.refreshToken;
    },
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
    getActiveTab(state: State) {
      return state.activeTab;
    },
  },
  mutations: {
    setSpotifyAuthorizationCode(state: State, code: string) {
      state.spotifyState.authorizationCode = code;
    },
    setSpotifyCodeVerifier(state: State, codeVerifier: string) {
      state.spotifyState.codeVerifier = codeVerifier;
    },
    setSpotifyAccessToken(state: State, token: string) {
      state.spotifyState.accessToken = token;
      localStorage.setItem(LocalStorage.SpotifyAccessToken, token);
    },
    setSpotifyRefreshToken(state: State, token: string) {
      state.spotifyState.refreshToken = token;
      localStorage.setItem(LocalStorage.SpotifyRefreshToken, token);
    },
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
    setActiveTab(state: State, tab: Players) {
      state.activeTab = tab;
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
