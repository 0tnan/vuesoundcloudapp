<template>
  <div id="player" class="Player" :class="{ 'Player--dark': getDarkMode }">
    <DraggablePlayer
      @disallowScroll="disableScroll"
      @getNextFavorites="updateFavorites"
      @recursiveGetFavorites="recursiveGetNextFavorites"
    ></DraggablePlayer>
    <transition name="slide" appear>
      <SettingsComponent
        @toggleSettings="toggleSettings"
        @reset="reset"
        @populate="populateFavorites"
        v-if="showSettings"
      ></SettingsComponent>
    </transition>
    <div class="Player-topContainer">
      <div class="Player-text">
        <p class="Player-fetching">Fetching from</p>
        <p class="Player-username">{{ username }}</p>
      </div>
      <button @click="toggleSettings" class="Player-settingsIcon">
        <img src="@/assets/icons/settings.svg" />
      </button>
    </div>
    <div class="Player-search">
      <input
        @input="onSearch"
        type="text"
        class="Player-searchInput"
        placeholder="search"
        v-model="searchQuery"
      />
      <img src="@/assets/icons/search.svg" class="Player-searchIcon" />
      <button
        @click="onRefresh"
        class="Player-searchRefresh"
        :class="{ 'Player-searchRefresh--on': isRefreshing }"
        :disabled="refreshDisabled"
      >
        <img
          class="Player-searchRefreshIcon"
          src="@/assets/icons/refresh.svg"
        />
      </button>
    </div>
    <div class="Player-viewSwitch">
      <div class="Player-viewSwitchTitle">Favorites</div>
      <div class="Player-viewSwitchIcons">
        <button
          @click="switchToGrid"
          v-if="gridEnabled"
          class="Player-viewSwitchGrid Player-viewSwitchButton"
        >
          <img v-if="!getDarkMode" src="@/assets/icons/gridLightEnabled.svg" />
          <img v-else src="@/assets/icons/gridDarkEnabled.svg" />
        </button>
        <button
          @click="switchToGrid"
          v-else
          class="Player-viewSwitchGrid Player-viewSwitchButton"
        >
          <img v-if="!getDarkMode" src="@/assets/icons/gridLightDisabled.svg" />
          <img v-else src="@/assets/icons/gridDarkDisabled.svg" />
        </button>
        <button
          @click="switchToList"
          v-if="!gridEnabled"
          class="Player-viewSwitchList Player-viewSwitchButton"
        >
          <img v-if="!getDarkMode" src="@/assets/icons/listLightEnabled.svg" />
          <img v-else src="@/assets/icons/listDarkEnabled.svg" />
        </button>
        <button
          @click="switchToList"
          v-else
          class="Player-viewSwitchList Player-viewSwitchButton"
        >
          <img v-if="!getDarkMode" src="@/assets/icons/listLightDisabled.svg" />
          <img v-else src="@/assets/icons/listDarkDisabled.svg" />
        </button>
      </div>
    </div>
    <div v-if="!searchQuery" id="unfiltered" class="Player-musicUnfiltered">
      <transition mode="out-in" name="fade" appear>
        <div
          @scroll="onScroll"
          v-if="gridEnabled"
          key="grid"
          id="queue"
          class="Player-musicGrid"
        >
          <GridTile
            v-for="track in tracklist"
            :key="track.id"
            :track="track"
          ></GridTile>
          <div v-if="!scrollEnd" class="Player-loadingContainer">
            <img
              class="Player-loadingIcon"
              loading="lazy"
              src="@/assets/img/loading.gif"
            />
          </div>
        </div>
        <div
          @scroll="onScroll"
          v-else
          key="list"
          id="queue"
          class="Player-musicList"
          appear
        >
          <ListTile
            v-for="track in tracklist"
            :key="track.id"
            :track="track"
          ></ListTile>
          <div v-if="!scrollEnd" class="Player-loadingContainer">
            <img
              class="Player-loadingIcon"
              loading="lazy"
              src="@/assets/img/loading.gif"
            />
          </div>
        </div>
      </transition>
    </div>
    <div v-else class="Player-musicFiltered">
      <transition mode="out-in" name="fade" appear>
        <div
          @scroll="onScroll"
          v-if="gridEnabled"
          key="grid"
          id="queue"
          class="Player-musicGrid"
        >
          <GridTile
            v-for="track in filteredTrackList"
            :key="track.id"
            :track="track"
          ></GridTile>
          <div v-if="!scrollEnd" class="Player-loadingContainer">
            <img
              class="Player-loadingIcon"
              loading="lazy"
              src="@/assets/img/loading.gif"
            />
          </div>
        </div>
        <div
          @scroll="onScroll"
          v-else
          key="list"
          id="queue"
          class="Player-musicList"
          appear
        >
          <ListTile
            v-for="track in filteredTrackList"
            :key="track.id"
            :track="track"
          ></ListTile>
          <div v-if="!scrollEnd" class="Player-loadingContainer">
            <img
              class="Player-loadingIcon"
              loading="lazy"
              src="@/assets/img/loading.gif"
            />
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { Favorites } from "@/interfaces/favorites";
import { Track } from "@/interfaces/track";
import Vue from "vue";
import { mapGetters } from "vuex";
import GridTile from "@/components/GridTile.vue";
import ListTile from "@/components/ListTile.vue";
import DraggablePlayer from "@/components/DraggablePlayer.vue";
import SettingsComponent from "@/components/SettingsComponent.vue";
import { getFavorites, getNextFavorites } from "../utils/soundcloud-api";
import store from "@/store";
import { debounce } from "lodash";

export default Vue.extend({
  components: {
    GridTile,
    ListTile,
    DraggablePlayer,
    SettingsComponent,
  },
  data() {
    return {
      gridEnabled: true,
      tracklist: [] as Track[],
      scrollEnd: false,
      searchQuery: "",
      launchedRecursive: false,
      isRefreshing: false,
      refreshDisabled: false,
      showSettings: false,
    };
  },
  created() {
    this.updateFavorites = debounce(this.updateFavorites, 1000);
    this.searchTracks = debounce(this.searchTracks, 500);
    this.forceUpdate = debounce(this.forceUpdate, 1000);
  },
  mounted() {
    this.populateFavorites();
    this.forceUpdate();
  },
  computed: {
    ...mapGetters([
      "getApiKey",
      "getProfileId",
      "getFavorites",
      "getUser",
      "getNextUrl",
      "getDarkMode",
    ]),
    username(): string {
      return this.getUser.username;
    },
    avatarUrl(): string {
      return this.getUser.avatar_url;
    },
    filteredTrackList(): Track[] {
      const lowercaseQuery = this.searchQuery.toLocaleLowerCase();
      return this.tracklist.filter(
        (item) =>
          item.title.toLocaleLowerCase().includes(lowercaseQuery) ||
          item.user.username.toLocaleLowerCase().includes(lowercaseQuery)
      );
    },
  },
  methods: {
    switchToGrid() {
      this.gridEnabled = true;
    },
    switchToList() {
      this.gridEnabled = false;
    },
    onScroll() {
      const queue = document.getElementById("queue");
      if (queue) {
        const isScrollEnd =
          queue.scrollTop + queue.clientHeight >= queue.scrollHeight;
        if (isScrollEnd && !!this.getNextUrl) {
          this.updateFavorites();
        }
      }
    },
    updateFavorites() {
      if (this.getNextUrl !== null) {
        getNextFavorites(this.getApiKey, this.getNextUrl).then(
          (results: Favorites) => {
            results.collection.forEach((item) => {
              if (item.track) {
                this.tracklist.push(item.track);
              }
            });
            store.commit("addToFavorites", results.collection);
            store.commit("setNextUrl", results.next_href);
          }
        );
      }
    },
    forceUpdate() {
      const unfiltered = document.getElementById("unfiltered");
      const queue = document.getElementById("queue");
      if (
        !!this.getFavorites &&
        !!this.getNextUrl &&
        unfiltered &&
        queue &&
        queue.scrollHeight <= unfiltered.offsetHeight
      ) {
        this.updateFavorites();
        this.forceUpdate();
      }
    },
    onSearch() {
      this.searchTracks();
    },
    onRefresh() {
      this.isRefreshing = true;
      this.refreshDisabled = true;
      this.scrollEnd = false;
      this.launchedRecursive = false;
      store.commit("setFavorites", {});
      store.commit("setNextUrl", "");
      this.tracklist = [];
      getFavorites(this.getApiKey, this.getProfileId)
        .then((response) => {
          store.commit("setFavorites", response);
          store.commit("setNextUrl", response.next_href);
          this.populateFavorites();
        })
        .finally(() => {
          setTimeout(() => {
            this.isRefreshing = false;
            this.refreshDisabled = false;
          }, 1500);
        });
      if (this.searchQuery) {
        this.searchTracks();
      }
      this.forceUpdate();
    },
    searchTracks() {
      if (this.getNextUrl !== null && !this.launchedRecursive) {
        this.launchedRecursive = true;
        this.recursiveGetNextFavorites();
      }
    },
    recursiveGetNextFavorites() {
      if (this.getNextUrl) {
        getNextFavorites(this.getApiKey, this.getNextUrl).then(
          (results: Favorites) => {
            results.collection.forEach((item) => {
              if (item.track) {
                this.tracklist.push(item.track);
              }
            });
            store.commit("addToFavorites", results.collection);
            store.commit("setNextUrl", results.next_href);
            this.recursiveGetNextFavorites();
          }
        );
      }
    },
    populateFavorites() {
      const favorites = this.getFavorites as Favorites;
      favorites.collection.forEach((item) => {
        if (item.track) {
          this.tracklist.push(item.track);
        }
      });
    },
    disableScroll(value: boolean) {
      const queue = document.getElementById("queue");
      if (value && queue) {
        queue.style.overflowY = "hidden";
      } else if (!value && queue) {
        queue.style.overflowY = "auto";
      }
    },
    toggleSettings() {
      this.showSettings = !this.showSettings;
    },
    reset() {
      this.tracklist = [];
    },
  },
  watch: {
    getNextUrl(newVal) {
      if (newVal === null) {
        this.scrollEnd = true;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.Player {
  $block: &;

  padding: 4rem 2.5rem;
  height: 100%;
  position: relative;
  overflow: hidden;
  transition: all 0.5s;

  &--dark {
    & #{$block}-fetching {
      color: $white;
    }

    & #{$block}-username {
      color: $white;
    }

    & #{$block}-settings {
      &Icon {
        filter: invert(100%);
      }
    }

    & #{$block}-search {
      &Input {
        background: $dark;

        &::placeholder {
          color: $white;
        }
      }

      &Refresh {
        background: $dark;

        &Icon {
          filter: invert(100%);
        }
      }

      &Icon {
        filter: invert(100%);
      }
    }

    & #{$block}-loadingContainer {
      filter: invert(100%);
    }

    & #{$block}-viewSwitchTitle {
      color: $white;
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

  &-top {
    &Container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  &-settingsIcon {
    margin-right: 1.25rem;
  }

  &-text {
    display: flex;
    flex-direction: column;
  }

  &-fetching,
  &-username {
    font-size: $xxl;
  }

  &-username {
    font-weight: 700;
    margin-top: 0.5rem;
  }

  &-search {
    display: flex;
    justify-content: space-between;
    margin-top: 2.5rem;
    position: relative;
    height: 5rem;

    &Icon {
      position: absolute;
      left: 1.5rem;
      top: 50%;
      transform: translateY(-50%);
    }

    &Input {
      height: 100%;
      width: calc(100vw - 11rem);
      border-radius: 5rem;
      border: none;
      background: $light;
      padding-left: 5rem;

      &::placeholder {
        color: $black;
      }
    }

    &Refresh {
      background: $light;
      border-radius: 50%;
      height: 5rem;
      width: 5rem;

      &--on {
        animation: spin 1.5s cubic-bezier(0.17, 0.67, 0.83, 0.67);
      }
    }
  }

  &-viewSwitch {
    margin-top: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &Icons {
      display: flex;
      align-items: center;
    }

    &Title {
      font-weight: 700;
      font-size: $xxl;
    }

    &Button {
      padding: 2rem;
    }

    &List {
      padding-right: 1.25rem;
    }
  }

  &-musicGrid,
  &-musicList {
    margin-top: 1.5rem;
    overflow-y: auto;
    overflow-x: hidden;
    height: calc(100vh - 37rem);
    display: flex;
    padding-bottom: 10rem;
  }

  &-musicGrid {
    justify-content: space-between;
    flex-wrap: wrap;
  }

  &-musicList {
    flex-direction: column;
  }

  ::-webkit-scrollbar {
    width: 0.5rem;
    position: absolute;
  }

  ::-webkit-scrollbar-thumb {
    background: $black;
    border-radius: 5rem;
  }
}
</style>
