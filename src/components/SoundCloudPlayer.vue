<template>
  <GenericPlayer
    class="SoundCloudPlayer"
    :class="{ 'SoundCloudPlayer--dark': getDarkMode }"
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
    <DraggablePlayer
      @disallowScroll="disableScroll"
      @getNextFavorites="updateFavorites"
      @unsetTrigger="unsetTrigger"
      :filteredList="filteredTrackList"
      :oldFilteredList="oldFilteredTracklist"
      :triggerAnimation="triggerAnimation"
      slot="player"
    ></DraggablePlayer>
    <SettingsComponent
      @toggleSettings="toggleSettings"
      @reset="reset"
      @populate="populateFavorites"
      v-if="showSettings"
      slot="settings"
    ></SettingsComponent>
    <div class="SoundCloudPlayer-viewSwitchTitle" slot="menu">Favorites</div>
    <div class="SoundCloudPlayer-list" slot="lists">
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
  </GenericPlayer>
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
import GenericPlayer from "./GenericPlayer.vue";
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
import { PlaylistWithTracks } from "@/interfaces/soundcloud/playlist-with-tracks";
import ToggleSettingsMixin from "@/mixins/toggle-settings";
const MAX_FILTER_ITEM = 10; // Maximum number of items that will be displayed to avoid too much api calls

export default Vue.extend({
  mixins: [ToggleSettingsMixin],
  components: {
    GridTile,
    ListTile,
    DraggablePlayer,
    SettingsComponent,
    GenericPlayer,
  },
  data() {
    return {
      gridEnabled: true,
      isRefreshing: false,
      refreshDisabled: false,
      tracklist: [] as Track[],
      scrollEnd: false,
      oldSearchQuery: "",
      searchQuery: "",
      filterTracker: MAX_FILTER_ITEM,
      stateInitiator: StateInitiator,
      triggerAnimation: false,
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
  activated() {
    this.triggerAnimation = true;
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
    avatarURL(): string {
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
        queue.scrollHeight <= unfiltered.offsetHeight - 100
      ) {
        this.updateFavorites();
        this.forceUpdate();
      }
    },
    onSearch(value: string) {
      this.searchQuery = value;
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
        const tracksFromPlaylist = [] as Track[];
        let playlist = {} as PlaylistWithTracks;
        getPlaylistWithTracks(
          this.getSoundCloudApiKey,
          favoriteItem.playlist.id
        )
          .then((playlistWithTracks) => {
            playlist = playlistWithTracks;
            playlistWithTracks.tracks.forEach((track: Track) => {
              const hasMedia = !!track.media;
              const hasIdNotMedia = !!track.id && !track.media;
              if (hasMedia) {
                tracksFromPlaylist.push(track);
              } else if (hasIdNotMedia) {
                ids.push(track.id);
              }
            });
          })
          .then(() => {
            if (ids.length > 0) {
              getMultipleTracks(this.getSoundCloudApiKey, ids)
                .then((tracks: Track[]) => {
                  tracks.forEach((track: Track) => {
                    if (track && !this.tracklist.includes(track)) {
                      tracksFromPlaylist.push(track);
                    }
                  });
                })
                .then(() => {
                  const orderedTracksFromPlaylist = [] as Track[];
                  if (tracksFromPlaylist.length > 0) {
                    playlist.tracks.forEach((track) => {
                      const item = tracksFromPlaylist.find(
                        (item) => item.id === track.id
                      );
                      if (item) {
                        orderedTracksFromPlaylist.push(item);
                      }
                    });
                  }
                  this.tracklist = [
                    ...this.tracklist,
                    ...orderedTracksFromPlaylist,
                  ];
                });
            } else {
              this.tracklist = [...this.tracklist, ...tracksFromPlaylist];
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
    reset() {
      this.tracklist = [];
    },
    unsetTrigger() {
      this.triggerAnimation = false;
    },
  },
  watch: {
    getSoundCloudNextUrl(newVal) {
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

  &-viewSwitch {
    &Title {
      font-weight: 700;
      font-size: $xxl;
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

  &-musicGrid,
  &-musicList {
    margin-top: 1.5rem;
    overflow-y: auto;
    overflow-x: hidden;
    height: calc(100vh - 37rem);
    display: flex;
    padding-bottom: 12rem;
  }

  &-musicGrid {
    justify-content: space-between;
    flex-wrap: wrap;
  }

  &-musicList {
    flex-direction: column;
  }

  &--dark {
    & #{$block}-viewSwitchTitle {
      color: $white;
    }

    & #{$block}-loadingContainer {
      filter: invert(100%);
    }
  }
}
</style>
