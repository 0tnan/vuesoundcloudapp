<template>
  <div class="SpotifyPlayer" :class="{ 'SpotifyPlayer--dark': getDarkMode }">
    <div v-if="!getSpotifyAccessToken" class="SpotifyPlayer-notConnected">
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
    <div v-else>SUCCESS</div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import store from "@/store";
import { mapGetters } from "vuex";
import { OAuth2Client } from "@byteowls/capacitor-oauth2";
import PlatformMixin from "@/mixins/platform";
import getSpotifyAccessToken from "../utils/spotify/get-access-token";
import { AccessTokenRequestBody } from "@/interfaces/spotify/access-token-request-body";
import { AccessTokenResponse } from "@/interfaces/spotify/access-token-response";

const RANDOM_LENGTH = 128;
const spotifyAuthorizeURI = "https://accounts.spotify.com/authorize";
const POSSIBLE =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const HASH_METHOD = "SHA-256";
const SPOTIFY_SCOPE =
  "user-read-private user-read-email playlist-read-private streaming app-remote-control user-read-playback-state user-modify-playback-state user-read-currently-playing";
const CODE_CHALLENGE_METHOD = "S256";
const RESPONSE_TYPE = "code";
const WINDOW_OPTIONS = "height=600,left=0,top=0";
const WINDOW_TARGET = "_blank";

export default Vue.extend({
  mixins: [PlatformMixin],
  data() {
    return {
      hasError: false,
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
      "getSpotifyCodeVerifier",
    ]),
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
    getSpotifyAccessToken(newVal) {
      console.log(newVal);
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
  padding-bottom: 7.5rem;

  &--dark {
    color: $white;

    & #{$block}-buttonConnect {
      &Icon {
        filter: invert(100);
      }
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
}
</style>
