<template>
  <div
    class="PlayerSelector"
    :class="{
      'PlayerSelector--dark': getDarkMode,
      'PlayerSelector--ios': isIos,
      'PlayerSelector--web': isWeb,
      'PlayerSelector--android': isAndroid,
    }"
  >
    <KeepAlive>
      <SoundCloudPlayer
        v-if="soundCloud"
        @dragDown="onPlayerDragDown"
        @dragUp="onPlayerDragUp"
        @isDragging="onPlayerDrag"
        @soundCloudAsPlayer="setPlayer"
      ></SoundCloudPlayer>
      <SpotifyPlayer v-else-if="spotify"></SpotifyPlayer>
      <AppleMusicPlayer v-else></AppleMusicPlayer>
    </KeepAlive>
    <div class="PlayerSelector-tab">
      <div class="PlayerSelector-tabContainer" :style="containerStyle">
        <button
          @click="showSoundCloud"
          class="PlayerSelector-tabItem"
          :class="{ 'PlayerSelector-tabItem--active': soundCloud }"
        >
          SoundCloud
          <img
            class="PlayerSelector-tabItemIcon"
            src="@/assets/icons/soundcloud.svg"
          />
        </button>
        <button
          @click="showSpotify"
          class="PlayerSelector-tabItem"
          :class="{ 'PlayerSelector-tabItem--active': spotify }"
        >
          Spotify
          <img
            class="PlayerSelector-tabItemIcon"
            src="@/assets/icons/spotify.svg"
          />
        </button>
        <button
          @click="showAppleMusic"
          class="PlayerSelector-tabItem"
          :class="{ 'PlayerSelector-tabItem--active': appleMusic }"
        >
          Apple Music
          <img
            class="PlayerSelector-tabItemIcon"
            src="@/assets/icons/appleMusic.svg"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import store from "@/store";
import SoundCloudPlayer from "@/components/SoundCloudPlayer.vue";
import SpotifyPlayer from "@/components/SpotifyPlayer.vue";
import AppleMusicPlayer from "@/components/AppleMusicPlayer.vue";
import { mapGetters } from "vuex";
import PlatformMixin from "@/mixins/platform";
import { StyleValue } from "vue/types/jsx";
import { Players } from "@/enums/players";

interface Player {
  player: Players;
  height: number;
}

const TRANSITION = "all 0.2s ease-in-out";

export default Vue.extend({
  mixins: [PlatformMixin],
  created() {
    store.commit("setActiveTab", Players.soundcloud);
  },
  data() {
    return {
      soundCloud: true,
      spotify: false,
      appleMusic: false,
      containerStyle: {} as StyleValue,
      activePlayer: {} as Player,
    };
  },
  components: {
    SoundCloudPlayer,
    SpotifyPlayer,
    AppleMusicPlayer,
  },
  computed: {
    ...mapGetters(["getDarkMode"]),
  },
  methods: {
    showSoundCloud() {
      this.soundCloud = true;
      this.spotify = false;
      this.appleMusic = false;
    },
    showSpotify() {
      this.soundCloud = false;
      this.spotify = true;
      this.appleMusic = false;
    },
    showAppleMusic() {
      this.soundCloud = false;
      this.spotify = false;
      this.appleMusic = true;
    },
    setPlayer(player: Player) {
      this.activePlayer = {
        player: player.player,
        height: player.height,
      };
    },
    onPlayerDragDown() {
      this.containerStyle = {
        transform: `translateY(0%)`,
        transition: TRANSITION,
      };
    },
    onPlayerDragUp() {
      this.containerStyle = {
        transform: `translateY(125%)`,
        transition: TRANSITION,
      };
    },
    onPlayerDrag(currentHeight: number) {
      let containerPosition =
        (currentHeight * 75) / (this.activePlayer.height - 100);
      this.containerStyle = {
        transform: `translateY(${containerPosition}%)`,
        transition: "none",
      };
    },
  },
  watch: {
    soundCloud(val) {
      if (val) {
        store.commit("setActiveTab", Players.soundcloud);
      }
    },
    spotify(val) {
      if (val) {
        store.commit("setActiveTab", Players.spotify);
      }
    },
    appleMusic(val) {
      if (val) {
        store.commit("setActiveTab", Players.appleMusic);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.PlayerSelector {
  $block: &;

  height: 100%;
  position: relative;

  &--dark {
    & #{$block}-tab {
      background: $dark;

      &Container {
        background: $dark;
      }

      &Item {
        color: $white;

        &Icon {
          filter: invert(100);
        }
      }
    }
  }

  &--ios {
    & #{$block}-tab {
      height: 7rem;
    }
  }

  &-tab {
    position: absolute;
    display: flex;
    bottom: 0;
    z-index: 2;
    height: 7.5rem;
    width: 100vw;
    font-size: $s;
    background: $light;

    &Container {
      flex-grow: 1;
      padding: 0 2rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: $light;
      transition: all 0.5s ease-in-out;
    }

    &Item {
      $block: &;

      flex-basis: 33%;
      border-radius: 0.5rem;
      height: 5rem;
      display: flex;
      flex-direction: column-reverse;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem 0;

      &Icon {
        height: 2.5rem;
      }

      &--active {
        background: rgba($color: $blue, $alpha: 1);
        animation: bounce 1.5s ease-in-out;
        font-weight: 700;
      }
    }
  }
}
</style>
