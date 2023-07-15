<template>
  <div
    v-if="!hasUser"
    class="SpotifyPlayer"
    :class="{ 'SpotifyPlayer--dark': getDarkMode }"
  >
    <div class="SpotifyPlayer-notConnected">
      <button @click="getAccess" class="SpotifyPlayer-buttonConnect Button">
        <img
          class="SpotifyPlayer-buttonConnectIcon"
          src="@/assets/icons/spotify.svg"
        />
        Connect With Spotify
      </button>
      <p v-if="hasError" class="SpotifyPlayer-error">
        An error occured, please retry
      </p>
    </div>
  </div>
  <div v-else>
    <GenericPlayer
      :class="{ 'SpotifyPlayer--dark': getDarkMode }"
      :avatarURL="avatarURL"
      :toggleSettings="toggleSettings"
      :value="searchQuery"
      @input="onSearch"
      :onRemove="onRemove"
      :onRefresh="onRefresh"
      :isRefreshing="isRefreshing"
      :refreshDisabled="refreshDisabled"
      :switchToGrid="switchToGrid"
      :switchToList="switchToList"
      :gridEnabled="gridEnabled"
    >
      <div class="SpotifyPlayer-menu" slot="menu">
        <div
          class="SpotifyPlayer-menuItem"
          :class="{ 'SpotifyPlayer-menuItem--active': playlistViewActive }"
          @click="goToPlaylists"
        >
          Playlists
        </div>
        <div
          class="SpotifyPlayer-menuItem"
          :class="{ 'SpotifyPlayer-menuItem--active': savedTracksViewActive }"
          @click="goToSavedTracks"
        >
          Liked Tracks
        </div>
      </div>
      <div class="SpotifyPlayer-lists" slot="lists">
        <transition mode="out-in" name="fade" appear>
          <div v-if="playlistViewActive" key="playlistView">
            <div class="SpotifyPlayer-listUnfiltered">
              <transition mode="out-in" name="fade" appear>
                <div
                  v-if="gridEnabled"
                  key="grid"
                  class="SpotifyPlayer-listGrid"
                  id="list"
                  @scroll="onScrollUnfiltered"
                >
                  <GridTile
                    v-for="item in getPlaylistItems"
                    :key="item.uri"
                    type="SPOTIFY_PLAYLIST"
                    :playlistSource="item.images[0].url"
                    :playlistDescription="item.description"
                    :playlistName="item.name"
                  ></GridTile>
                  <div
                    v-if="!scrollEndPlaylist"
                    class="SpotifyPlayer-loadingContainer"
                  >
                    <img
                      class="SpotifyPlayer-loadingIcon"
                      loading="lazy"
                      src="@/assets/img/loading.gif"
                    />
                  </div>
                </div>
                <div
                  v-else
                  key="list"
                  class="SpotifyPlayer-listList"
                  id="list"
                  @scroll="onScrollUnfiltered"
                >
                  <ListTile
                    v-for="item in getPlaylistItems"
                    :key="item.uri"
                    type="SPOTIFY_PLAYLIST"
                    :playlistSource="item.images[0].url"
                    :playlistDescription="item.description"
                    :playlistName="item.name"
                  ></ListTile>
                  <div
                    v-if="!scrollEndPlaylist"
                    class="SpotifyPlayer-loadingContainer"
                  >
                    <img
                      class="SpotifyPlayer-loadingIcon"
                      loading="lazy"
                      src="@/assets/img/loading.gif"
                    />
                  </div>
                </div>
              </transition>
            </div>
          </div>
          <div v-else key="savedTracksView">
            <div class="SpotifyPlayer-listUnfiltered">
              <transition mode="out-in" name="fade" appear>
                <div
                  v-if="gridEnabled"
                  key="grid"
                  class="SpotifyPlayer-listGrid"
                  id="list"
                  @scroll="onScrollUnfiltered"
                >
                  <GridTile
                    v-for="item in getSavedTracksItems"
                    :key="item.track.id"
                    type="SPOTIFY_TRACK"
                    :spotifyTrack="item.track"
                  ></GridTile>
                  <div
                    v-if="!scrollEndTracks"
                    class="SpotifyPlayer-loadingContainer"
                  >
                    <img
                      class="SpotifyPlayer-loadingIcon"
                      loading="lazy"
                      src="@/assets/img/loading.gif"
                    />
                  </div>
                </div>
                <div
                  v-else
                  key="list"
                  class="SpotifyPlayer-listList"
                  id="list"
                  @scroll="onScrollUnfiltered"
                >
                  <ListTile
                    v-for="item in getSavedTracksItems"
                    :key="item.track.id"
                    type="SPOTIFY_TRACK"
                    :spotifyTrack="item.track"
                  ></ListTile>
                  <div
                    v-if="!scrollEndTracks"
                    class="SpotifyPlayer-loadingContainer"
                  >
                    <img
                      class="SpotifyPlayer-loadingIcon"
                      loading="lazy"
                      src="@/assets/img/loading.gif"
                    />
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </transition>
      </div>
    </GenericPlayer>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import store from "@/store";
import { mapGetters } from "vuex";
import GenericPlayer from "./GenericPlayer.vue";
import GridTile from "@/components/GridTile.vue";
import ListTile from "@/components/ListTile.vue";
import { OAuth2Client } from "@byteowls/capacitor-oauth2";
import {
  getSpotifyAccessToken,
  refreshToken,
} from "../utils/spotify/get-access-token";
import { AccessTokenRequestBody } from "@/interfaces/spotify/access-token-request-body";
import { RefreshTokenRequestBody } from "@/interfaces/spotify/refresh-token-request-body";
import { AccessTokenResponse } from "@/interfaces/spotify/access-token-response";
import { Playlists } from "@/interfaces/spotify/playlists";
import { PlaylistsItem } from "@/interfaces/spotify/playlists-item";
import { SavedTracks } from "@/interfaces/spotify/saved-tracks";
import { SavedTracksItem } from "@/interfaces/spotify/saved-tracks-item";
import { User } from "@/interfaces/spotify/user";
import {
  getUser,
  getPlaylists,
  getPlaylistsNextPageItems,
  getSavedTracks,
  getSavedTracksNextPageItems,
} from "@/utils/spotify/spotify-api";
import PlatformMixin from "@/mixins/platform";
import ToggleSettingsMixin from "@/mixins/toggle-settings";

const RANDOM_LENGTH = 128;
const spotifyAuthorizeURI = "https://accounts.spotify.com/authorize";
const POSSIBLE =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const HASH_METHOD = "SHA-256";
const SPOTIFY_SCOPE =
  "user-read-private user-read-email playlist-read-private user-library-read streaming app-remote-control user-read-playback-state user-modify-playback-state user-read-currently-playing";
const CODE_CHALLENGE_METHOD = "S256";
const RESPONSE_TYPE = "code";
const WINDOW_OPTIONS = "height=600,left=0,top=0";
const WINDOW_TARGET = "_blank";
const REFRESH_TOKEN_EXPIRED_CODE = 401;
const REFRESH_GRANT_TYPE = "refresh_token";

export default Vue.extend({
  mixins: [PlatformMixin, ToggleSettingsMixin],
  components: {
    GenericPlayer,
    GridTile,
    ListTile,
  },
  created() {
    if (this.getSpotifyAccessToken) {
      this.getData();
    }
  },
  data() {
    return {
      gridEnabled: true,
      isRefreshing: false,
      refreshDisabled: false,
      hasError: false,
      user: {} as User,
      playlistItems: [] as PlaylistsItem[],
      savedTracksItems: [] as SavedTracksItem[],
      searchQuery: "",
      scrollEndPlaylist: false,
      scrollEndTracks: false,
      playlistViewActive: true,
      savedTracksViewActive: false,
    };
  },
  computed: {
    ...mapGetters([
      "getDarkMode",
      "getSpotifyClientId",
      "getSpotifyRedirectURIWeb",
      "getSpotifyRedirectURIIos",
      "getSpotifyRedirectURIAndroid",
      "getSpotifyAuthorizationCode",
      "getSpotifyAccessToken",
      "getSpotifyRefreshToken",
      "getSpotifyCodeVerifier",
      "getSpotifyNextPlaylistURL",
      "getSpotifyNextSavedTracksURL",
    ]),
    hasUser(): boolean {
      return !!this.user && Object.keys(this.user).length > 0;
    },
    avatarURL(): string {
      if (this.user.images && this.user.images) {
        return this.user.images[1].url;
      }
      return "";
    },
    getRedirectURI(): string {
      if (this.isWeb) {
        return this.getSpotifyRedirectURIWeb;
      } else if (this.isAndroid) {
        return this.getSpotifyRedirectURIAndroid;
      } else if (this.isIos) {
        return this.getSpotifyRedirectURIIos;
      }
      return "";
    },
    getPlaylistItems(): PlaylistsItem[] {
      const unique = [
        ...new Map(this.playlistItems.map((item) => [item.id, item])).values(),
      ];

      return unique;
    },
    getSavedTracksItems(): SavedTracksItem[] {
      const unique = [
        ...new Map(
          this.savedTracksItems.map((item) => [item.track.id, item])
        ).values(),
      ];
      return unique;
    },
  },
  methods: {
    generateRandomString(length: number) {
      let text = "";

      for (let i = 0; i < length; i++) {
        text += POSSIBLE.charAt(Math.floor(Math.random() * POSSIBLE.length));
      }
      return text;
    },
    async generateCodeChallenge(codeVerifier: string) {
      function base64encode(string: ArrayBuffer) {
        return btoa(
          String.fromCharCode.apply(null, Array.from(new Uint8Array(string)))
        )
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=+$/, "");
      }
      const encoder = new TextEncoder();
      const data = encoder.encode(codeVerifier);
      const digest = await window.crypto.subtle.digest(HASH_METHOD, data);

      return base64encode(digest);
    },
    getAccess() {
      const codeVerifier = this.generateRandomString(RANDOM_LENGTH);
      this.generateCodeChallenge(codeVerifier).then(async (codeChallenge) => {
        const state = this.generateRandomString(16);
        const scope = SPOTIFY_SCOPE;
        store.commit("setSpotifyCodeVerifier", codeVerifier);
        let options = {
          pkceEnable: true,
          authorizationBaseUrl: spotifyAuthorizeURI,
          scope: scope,
          state: state,
          additionalParameters: {
            code_challenge_method: CODE_CHALLENGE_METHOD,
            code_challenge: codeChallenge,
          },
        };

        const mobile = {
          appId: this.getSpotifyClientId,
          responseType: RESPONSE_TYPE,
          redirectUrl: this.getRedirectURI,
        };

        const web = {
          ...mobile,
          windowOptions: WINDOW_OPTIONS,
          windowTarget: WINDOW_TARGET,
        };

        if (this.isWeb) {
          options = {
            ...options,
            ...web,
          };
        } else if (this.isIos || this.isAndroid) {
          options = {
            ...options,
            ...mobile,
          };
        }
        OAuth2Client.authenticate(options)
          .then((response) => {
            store.commit(
              "setSpotifyAuthorizationCode",
              response.authorization_response.code
            );
          })
          .catch(() => {
            this.hasError = true;
          });
      });
    },
    requestAccessToken(data: AccessTokenRequestBody) {
      getSpotifyAccessToken(data).then((response: AccessTokenResponse) => {
        store.commit("setSpotifyAccessToken", response.access_token);
        store.commit("setSpotifyRefreshToken", response.refresh_token);
      });
    },
    refreshToken(reason: number, callback: () => void) {
      if (reason === REFRESH_TOKEN_EXPIRED_CODE) {
        const refreshTokenRequestBody = {
          grant_type: REFRESH_GRANT_TYPE,
          refresh_token: this.getSpotifyRefreshToken,
          client_id: this.getSpotifyClientId,
        } as RefreshTokenRequestBody;
        refreshToken(refreshTokenRequestBody)
          .then((response: AccessTokenResponse) => {
            store.commit("setSpotifyAccessToken", response.access_token);
            store.commit("setSpotifyRefreshToken", response.refresh_token);
          })
          .then(() => {
            callback;
          });
      }
    },
    getData() {
      getUser(this.getSpotifyAccessToken)
        .then((response: User) => {
          this.user = response;
        })
        .then(() => {
          getPlaylists(this.getSpotifyAccessToken).then(
            (response: Playlists) => {
              this.handlePlaylistsResponse(response);
            }
          );
        })
        .then(() => {
          getSavedTracks(this.getSpotifyAccessToken).then(
            (response: SavedTracks) => {
              this.handleSavedTracksResponse(response);
            }
          );
        })
        .catch((reason) => {
          this.refreshToken(reason.error.status, this.getData);
        });
    },
    getNextPageItems() {
      if (this.playlistViewActive) {
        if (this.getSpotifyNextPlaylistURL !== null) {
          getPlaylistsNextPageItems(
            this.getSpotifyAccessToken,
            this.getSpotifyNextPlaylistURL
          )
            .then((response: Playlists) => {
              this.handlePlaylistsResponse(response);
            })
            .catch((reason) => {
              this.refreshToken(reason.error.status, this.getNextPageItems);
            });
        }
      } else {
        getSavedTracksNextPageItems(
          this.getSpotifyAccessToken,
          this.getSpotifyNextSavedTracksURL
        )
          .then((response: SavedTracks) => {
            this.handleSavedTracksResponse(response);
          })
          .catch((reason) => {
            this.refreshToken(reason.error.status, this.getNextPageItems);
          });
      }
    },
    handlePlaylistsResponse(response: Playlists) {
      this.playlistItems = [...this.playlistItems, ...response.items];
      store.commit("setSpotifyNextPlaylistURL", response.next);
    },
    handleSavedTracksResponse(response: SavedTracks) {
      this.savedTracksItems = [...this.savedTracksItems, ...response.items];
      store.commit("setSpotifyNextSavedTracksURL", response.next);
    },
    scrollHandler(callback: () => void) {
      const watchedURL = this.playlistViewActive
        ? this.getSpotifyNextPlaylistURL
        : this.getSpotifyNextSavedTracksURL;
      const list = document.getElementById("list");
      if (list) {
        const isScrollEnd =
          list.scrollTop + list.clientHeight >= list.scrollHeight;
        if (isScrollEnd && !!watchedURL) {
          callback();
        }
      }
    },
    onScrollUnfiltered() {
      this.scrollHandler(this.getNextPageItems);
    },
    onSearch() {
      //
    },
    onRemove() {
      //
    },
    onRefresh() {
      //
    },
    switchToGrid() {
      this.gridEnabled = true;
    },
    switchToList() {
      this.gridEnabled = false;
    },
    goToPlaylists() {
      this.playlistViewActive = true;
      this.savedTracksViewActive = false;
    },
    goToSavedTracks() {
      this.playlistViewActive = false;
      this.savedTracksViewActive = true;
    },
  },
  watch: {
    getSpotifyAuthorizationCode(newVal) {
      const requestBody = {
        grant_type: "authorization_code",
        code: newVal,
        redirect_uri: this.getRedirectURI,
        client_id: this.getSpotifyClientId,
        code_verifier: this.getSpotifyCodeVerifier,
      } as AccessTokenRequestBody;
      this.requestAccessToken(requestBody);
    },
    getSpotifyAccessToken() {
      this.getData();
    },
    getSpotifyNextPlaylistURL(newVal) {
      if (newVal === null) {
        this.scrollEndPlaylist = true;
      }
    },
    getSpotifyNextSavedTracksURL(newVal) {
      if (newVal === null) {
        this.scrollEndTracks = true;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.SpotifyPlayer {
  $block: &;

  color: $black;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 2.5rem 7.5rem;

  &--dark {
    color: $white;

    & #{$block}-buttonConnect {
      &Icon {
        filter: invert(100);
      }
    }
  }

  &-loading {
    &Container {
      width: 100%;
      display: flex;
      justify-content: center;
    }

    &Icon {
      height: 5rem;
      width: 5rem;
    }
  }

  &-buttonConnect {
    width: 17.5rem;
    height: 5rem;
    justify-content: space-evenly;
    display: flex;
    align-items: center;
    background: $green;
    margin-bottom: 1rem;

    &Icon {
      height: 3rem;
      width: 3rem;
    }
  }

  &-notConnected {
    margin: auto;
  }

  &-error {
    color: $red;
  }

  &-avatar {
    &Img {
      height: 7.5rem;
      width: 7.5rem;
      border-radius: 50%;
    }
  }

  &-menu {
    font-weight: 700;
    font-size: $xxl;
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;
    width: calc(100% - 11.5rem);
    white-space: nowrap;
    margin-top: 1rem;

    &::-webkit-scrollbar {
      height: 0.5rem;
    }

    &::-webkit-scrollbar-thumb {
      transition: all 0.5s ease-in-out;
    }

    &Item {
      margin-right: 2.5rem;
      padding-bottom: 1rem;
      color: $dark;

      &--active {
        color: inherit;
      }
    }
  }

  &-listGrid,
  &-listList {
    margin-top: 1.5rem;
    overflow-y: auto;
    overflow-x: hidden;
    height: calc(100vh - 37rem);
    display: flex;
    padding-bottom: 12rem;
  }

  &-listGrid {
    justify-content: space-between;
    flex-wrap: wrap;
  }

  &-listList {
    flex-direction: column;
  }
}
</style>
