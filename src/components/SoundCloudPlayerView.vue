<template>
  <div
    id="player"
    class="SoundCloudPlayer"
    :class="{ 'SoundCloudPlayer--dark': getDarkMode }"
  >
    <DraggablePlayer
      @disallowScroll="disableScroll"
      @getNextFavorites="updateFavorites"
      :filteredList="filteredTrackList"
      :oldFilteredList="oldFilteredTracklist"
    ></DraggablePlayer>
    <transition name="slide" appear>
      <SettingsComponent
        @toggleSettings="toggleSettings"
        @reset="reset"
        @populate="populateFavorites"
        v-if="showSettings"
      ></SettingsComponent>
    </transition>
    <div class="SoundCloudPlayer-topContainer">
      <div class="SoundCloudPlayer-avatar">
        <img
          loading="lazy"
          :src="avatarUrl"
          class="SoundCloudPlayer-avatarImg"
        />
      </div>
      <button @click="toggleSettings" class="SoundCloudPlayer-settingsIcon">
        <img src="@/assets/icons/settings.svg" />
      </button>
    </div>
    <div class="SoundCloudPlayer-search">
      <input
        @input="onSearch"
        type="text"
        class="SoundCloudPlayer-searchInput"
        placeholder="search"
        v-model="searchQuery"
      />
      <button @click="onRemove" class="SoundCloudPlayer-searchRemove">
        <img
          class="SoundCloudPlayer-searchRemoveIcon"
          src="@/assets/icons/cross.svg"
        />
      </button>
      <img
        src="@/assets/icons/search.svg"
        class="SoundCloudPlayer-searchIcon"
      />
      <button
        @click="onRefresh"
        class="SoundCloudPlayer-searchRefresh"
        :class="{ 'SoundCloudPlayer-searchRefresh--on': isRefreshing }"
        :disabled="refreshDisabled"
      >
        <img
          class="SoundCloudPlayer-searchRefreshIcon"
          src="@/assets/icons/refresh.svg"
        />
      </button>
    </div>
    <div class="SoundCloudPlayer-viewSwitch">
      <div class="SoundCloudPlayer-viewSwitchTitle">Favorites</div>
      <div class="SoundCloudPlayer-viewSwitchIcons">
        <button
          @click="switchToGrid"
          v-if="gridEnabled"
          class="SoundCloudPlayer-viewSwitchGrid SoundCloudPlayer-viewSwitchButton"
        >
          <img v-if="!getDarkMode" src="@/assets/icons/gridLightEnabled.svg" />
          <img v-else src="@/assets/icons/gridDarkEnabled.svg" />
        </button>
        <button
          @click="switchToGrid"
          v-else
          class="SoundCloudPlayer-viewSwitchGrid SoundCloudPlayer-viewSwitchButton"
        >
          <img v-if="!getDarkMode" src="@/assets/icons/gridLightDisabled.svg" />
          <img v-else src="@/assets/icons/gridDarkDisabled.svg" />
        </button>
        <button
          @click="switchToList"
          v-if="!gridEnabled"
          class="SoundCloudPlayer-viewSwitchList SoundCloudPlayer-viewSwitchButton"
        >
          <img v-if="!getDarkMode" src="@/assets/icons/listLightEnabled.svg" />
          <img v-else src="@/assets/icons/listDarkEnabled.svg" />
        </button>
        <button
          @click="switchToList"
          v-else
          class="SoundCloudPlayer-viewSwitchList SoundCloudPlayer-viewSwitchButton"
        >
          <img v-if="!getDarkMode" src="@/assets/icons/listLightDisabled.svg" />
          <img v-else src="@/assets/icons/listDarkDisabled.svg" />
        </button>
      </div>
    </div>
    <div
      v-if="!searchQuery"
      id="unfiltered"
      class="SoundCloudPlayer-musicUnfiltered"
    >
      <transition mode="out-in" name="fade" appear>
        <div
          @scroll="onScroll"
          v-if="gridEnabled"
          key="grid"
          id="queue"
          class="SoundCloudPlayer-musicGrid"
        >
          <GridTile
            v-for="track in filteredTrackList"
            :key="track.id"
            :track="track"
            :initiator="stateInitiator.unfiltered"
          ></GridTile>
          <div v-if="!scrollEnd" class="SoundCloudPlayer-loadingContainer">
            <img
              class="SoundCloudPlayer-loadingIcon"
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
          class="SoundCloudPlayer-musicList"
          appear
        >
          <ListTile
            v-for="track in filteredTrackList"
            :key="track.id"
            :track="track"
            :initiator="stateInitiator.unfiltered"
          ></ListTile>
          <div v-if="!scrollEnd" class="SoundCloudPlayer-loadingContainer">
            <img
              class="SoundCloudPlayer-loadingIcon"
              loading="lazy"
              src="@/assets/img/loading.gif"
            />
          </div>
        </div>
      </transition>
    </div>
    <div v-else class="SoundCloudPlayer-musicFiltered">
      <transition mode="out-in" name="fade" appear>
        <div
          @scroll="onScrollFiltered"
          v-if="gridEnabled"
          key="grid"
          id="queue"
          class="SoundCloudPlayer-musicGrid"
        >
          <GridTile
            v-for="track in oldFilteredTracklist"
            :key="track.id"
            :track="track"
            :initiator="stateInitiator.filtered"
          ></GridTile>
          <div v-if="!scrollEnd" class="SoundCloudPlayer-loadingContainer">
            <img
              class="SoundCloudPlayer-loadingIcon"
              loading="lazy"
              src="@/assets/img/loading.gif"
            />
          </div>
        </div>
        <div
          @scroll="onScrollFiltered"
          v-else
          key="list"
          id="queue"
          class="SoundCloudPlayer-musicList"
          appear
        >
          <ListTile
            v-for="track in oldFilteredTracklist"
            :key="track.id"
            :track="track"
            :initiator="stateInitiator.filtered"
          ></ListTile>
          <div v-if="!scrollEnd" class="SoundCloudPlayer-loadingContainer">
            <img
              class="SoundCloudPlayer-loadingIcon"
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
import { Favorites } from "@/interfaces/soundcloud/favorites";
import { Track } from "@/interfaces/soundcloud/track";
import Vue from "vue";
import { mapGetters } from "vuex";
import GridTile from "@/components/GridTile.vue";
import ListTile from "@/components/ListTile.vue";
import DraggablePlayer from "@/components/DraggablePlayer.vue";
import SettingsComponent from "@/components/SettingsComponent.vue";
import {
  getFavorites,
  getNextFavorites,
  getPlaylistWithTracks,
  getMultipleTracks,
} from "../utils/soundcloud/soundcloud-api";
import store from "@/store";
import { debounce } from "lodash";
import { StateInitiator } from "@/enums/state-initiator";
import { FavoriteItem } from "@/interfaces/soundcloud/favorite-item";

const MAX_FILTER_ITEM = 10; // Maximum number of items that will be displayed to avoid too much api calls

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
      oldSearchQuery: "",
      searchQuery: "",
      isRefreshing: false,
      refreshDisabled: false,
      showSettings: false,
      filterTracker: MAX_FILTER_ITEM,
      stateInitiator: StateInitiator,
    };
  },
  created() {
    this.updateFavorites = debounce(this.updateFavorites, 1000);
    this.searchTracks = debounce(this.searchTracks, 500);
    this.forceUpdate = debounce(this.forceUpdate, 1000);
    this.recursiveGetNextFavorites = debounce(
      this.recursiveGetNextFavorites,
      500
    );
  },
  mounted() {
    this.populateFavorites();
    this.forceUpdate();
  },
  computed: {
    ...mapGetters([
      "getSoundCloudApiKey",
      "getSoundCloudProfileId",
      "getSoundCloudFavorites",
      "getSoundCloudUser",
      "getSoundCloudNextUrl",
      "getDarkMode",
    ]),
    username(): string {
      return this.getSoundCloudUser.username;
    },
    avatarUrl(): string {
      return this.getSoundCloudUser.avatar_url.replace("-large", "-t500x500");
    },
    filteredTrackList(): Track[] {
      const lowercaseQuery = this.searchQuery.toLocaleLowerCase();
      const filteredList = this.tracklist.filter(
        (item) =>
          item.title.toLocaleLowerCase().includes(lowercaseQuery) ||
          item.user.username.toLocaleLowerCase().includes(lowercaseQuery)
      );

      const uniqueFiltered = [
        ...new Map(filteredList.map((item) => [item.id, item])).values(),
      ];

      return uniqueFiltered;
    },
    oldFilteredTracklist(): Track[] {
      const lowercaseQuery = this.oldSearchQuery.toLocaleLowerCase();
      const filteredList = this.tracklist.filter(
        (item) =>
          item.title.toLocaleLowerCase().includes(lowercaseQuery) ||
          item.user.username.toLocaleLowerCase().includes(lowercaseQuery)
      );

      const uniqueFiltered = [
        ...new Map(filteredList.map((item) => [item.id, item])).values(),
      ];

      return uniqueFiltered;
    },
    filteredTrackListLength(): number {
      return this.filteredTrackList.length;
    },
    oldFilteredTracklistLength(): number {
      return this.oldFilteredTracklist.length;
    },
  },
  methods: {
    switchToGrid() {
      this.gridEnabled = true;
    },
    switchToList() {
      this.gridEnabled = false;
    },
    updateFavorites() {
      if (this.getSoundCloudNextUrl !== null) {
        getNextFavorites(
          this.getSoundCloudApiKey,
          this.getSoundCloudNextUrl
        ).then((results: Favorites) => {
          results.collection.forEach((favoriteItem: FavoriteItem) => {
            this.handleFavoriteItem(favoriteItem);
          });
          store.commit("addToSoundCloudFavorites", results.collection);
          store.commit("setSoundCloudNextUrl", results.next_href);
        });
      }
    },
    forceUpdate() {
      const unfiltered = document.getElementById("unfiltered");
      const queue = document.getElementById("queue");
      if (
        !!this.getSoundCloudFavorites &&
        !!this.getSoundCloudNextUrl &&
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
      store.commit("setSoundCloudFavorites", {});
      store.commit("setSoundCloudNextUrl", "");
      this.tracklist = [];
      getFavorites(this.getSoundCloudApiKey, this.getSoundCloudProfileId)
        .then((response) => {
          store.commit("setSoundCloudFavorites", response);
          store.commit("setSoundCloudNextUrl", response.next_href);
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
    onRemove() {
      this.searchQuery = "";
    },
    searchTracks() {
      this.oldSearchQuery = this.searchQuery;
      if (this.oldFilteredTracklistLength >= this.filterTracker) {
        this.filterTracker = this.oldFilteredTracklistLength;
      } else {
        this.filterTracker = MAX_FILTER_ITEM;
      }
      if (this.getSoundCloudNextUrl !== null) {
        this.recursiveGetNextFavorites();
      }
    },
    recursiveGetNextFavorites() {
      if (this.getSoundCloudNextUrl) {
        getNextFavorites(
          this.getSoundCloudApiKey,
          this.getSoundCloudNextUrl
        ).then((results: Favorites) => {
          results.collection.forEach((favoriteItem: FavoriteItem) => {
            this.handleFavoriteItem(favoriteItem);
          });
          store.commit("addToSoundCloudFavorites", results.collection);
          store.commit("setSoundCloudNextUrl", results.next_href);
          if (this.oldFilteredTracklistLength < this.filterTracker) {
            this.recursiveGetNextFavorites();
          } else if (this.oldFilteredTracklistLength === this.filterTracker) {
            this.filterTracker += this.filterTracker;
            return;
          }
        });
      }
    },
    scrollHandler(callback: () => void) {
      const queue = document.getElementById("queue");
      if (queue) {
        const isScrollEnd =
          queue.scrollTop + queue.clientHeight >= queue.scrollHeight;
        if (isScrollEnd && !!this.getSoundCloudNextUrl) {
          callback();
        }
      }
    },
    onScroll() {
      this.scrollHandler(this.updateFavorites);
    },
    onScrollFiltered() {
      this.scrollHandler(this.recursiveGetNextFavorites);
    },
    populateFavorites() {
      const favorites = this.getSoundCloudFavorites as Favorites;
      favorites.collection.forEach((favoriteItem: FavoriteItem) => {
        this.handleFavoriteItem(favoriteItem);
      });
    },
    handleFavoriteItem(favoriteItem: FavoriteItem) {
      if (favoriteItem.track && !this.tracklist.includes(favoriteItem.track)) {
        this.tracklist.push(favoriteItem.track);
      } else if (favoriteItem.playlist) {
        const ids = [] as number[];
        getPlaylistWithTracks(
          this.getSoundCloudApiKey,
          favoriteItem.playlist.id
        )
          .then((playlistWithTracks) => {
            playlistWithTracks.tracks.forEach((track: Track) => {
              const hasMedia = !!track.media;
              const hasIdNotMedia = !!track.id && !track.media;
              if (hasMedia) {
                this.tracklist.push(track);
              } else if (hasIdNotMedia) {
                ids.push(track.id);
              }
            });
          })
          .finally(() => {
            if (ids.length > 0) {
              getMultipleTracks(this.getSoundCloudApiKey, ids).then(
                (tracks: Track[]) => {
                  tracks.forEach((track: Track) => {
                    if (track && !this.tracklist.includes(track)) {
                      this.tracklist.push(track);
                    }
                  });
                }
              );
            }
          });
      }
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
.SoundCloudPlayer {
  $block: &;

  padding: 4rem 2.5rem;
  height: 100%;
  position: relative;
  overflow: hidden;
  transition: all 0.5s;

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
    padding: 1.25rem;
  }

  &-avatar {
    &Img {
      border-radius: 50%;
      height: 7.5rem;
      width: 7.5rem;
    }
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

      &Icon {
        width: 3rem;
        height: 3rem;
      }
    }

    &Icon {
      width: 3rem;
      height: 3rem;
    }

    &Remove {
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      margin-right: 6rem;
      padding: 1rem;
      z-index: 1;

      &Icon {
        height: 3rem;
        width: 3rem;
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

    &Grid {
      padding-right: 1.75rem;
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
    scrollbar-color: $black;
  }

  ::-webkit-scrollbar-thumb {
    background: $black;
    border-radius: 5rem;
  }

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
        color: $white;

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

      &Remove {
        &Icon {
          filter: invert(100%);
        }
      }
    }

    & #{$block}-loadingContainer {
      filter: invert(100%);
    }

    & #{$block}-viewSwitchTitle {
      color: $white;
    }

    & ::-webkit-scrollbar-thumb {
      background: $white;
    }
  }
}
</style>
