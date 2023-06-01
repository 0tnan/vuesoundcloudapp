<template>
  <div class="Player">
    <DraggablePlayer
      :hide-draggable-player="hideDraggablePlayer"
      @unhide="unhide"
      @disallowScroll="disableScroll"
    ></DraggablePlayer>
    <div class="Player-topContainer">
      <div class="Player-text">
        <p class="Player-fetching">Fetching from</p>
        <p class="Player-username">{{ username }}</p>
      </div>
      <div class="Player-settingsIcon">
        <img src="@/assets/icons/settings.svg" />
      </div>
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
        @click="onRefresh()"
        class="Player-searchRefresh"
        :class="{ 'Player-searchRefresh--on': isRefreshing }"
        :disabled="refreshDisabled"
      >
        <img src="@/assets/icons/refresh.svg" />
      </button>
    </div>
    <div class="Player-viewSwitch">
      <div class="Player-viewSwitchTitle">Favorites</div>
      <div class="Player-viewSwitchIcons">
        <button
          @click="switchToGrid()"
          v-if="gridEnabled"
          class="Player-viewSwitchGrid"
        >
          <img src="@/assets/icons/gridLightEnabled.svg" />
        </button>
        <button @click="switchToGrid()" v-else class="Player-viewSwitchGrid">
          <img src="@/assets/icons/gridLightDisabled.svg" />
        </button>
        <button
          @click="switchToList()"
          v-if="!gridEnabled"
          class="Player-viewSwitchList"
        >
          <img src="@/assets/icons/listLightEnabled.svg" />
        </button>
        <button @click="switchToList()" v-else class="Player-viewSwitchList">
          <img src="@/assets/icons/listLightDisabled.svg" />
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
            :src="getFullScaleImage(track.artwork_url, track.user.avatar_url)"
            :title="track.title"
            :artist="track.user.username"
          ></GridTile>
          <img
            v-if="scrollEnd"
            class="Player-loading"
            lazy
            src="@/assets/img/loading.gif"
          />
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
            :src="getFullScaleImage(track.artwork_url, track.user.avatar_url)"
            :title="track.title"
            :artist="track.user.username"
          ></ListTile>
          <img
            v-if="scrollEnd"
            class="Player-loading"
            lazy
            src="@/assets/img/loading.gif"
          />
        </div>
      </transition>
    </div>
    <div v-else class="Player-musicFiltered">
      <transition mode="out-in" name="fade" appear>
        <div v-if="gridEnabled" key="grid" id="queue" class="Player-musicGrid">
          <GridTile
            v-for="track in filteredTrackList"
            :key="track.id"
            :src="getFullScaleImage(track.artwork_url, track.user.avatar_url)"
            :title="track.title"
            :artist="track.user.username"
          ></GridTile>
          <img
            v-if="scrollEnd"
            class="Player-loading"
            lazy
            src="@/assets/img/loading.gif"
          />
        </div>
        <div v-else key="list" id="queue" class="Player-musicList" appear>
          <ListTile
            v-for="track in filteredTrackList"
            :key="track.id"
            :src="getFullScaleImage(track.artwork_url, track.user.avatar_url)"
            :title="track.title"
            :artist="track.user.username"
          ></ListTile>
          <img
            v-if="scrollEnd"
            class="Player-loading"
            lazy
            src="@/assets/img/loading.gif"
          />
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
import { getFavorites, getNextFavorites } from "../utils/soundcloud-api";
import store from "@/store";
import { debounce } from "lodash";

export default Vue.extend({
  components: {
    GridTile,
    ListTile,
    DraggablePlayer,
  },
  data() {
    return {
      gridEnabled: true,
      tracklist: [] as Track[],
      scrollEnd: true,
      searchQuery: "",
      launchedRecursive: false,
      isRefreshing: false,
      refreshDisabled: false,
      hideDraggablePlayer: false,
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
    getFullScaleImage(url: string, avatar_url: string): string | null {
      if (url) {
        const highDefinitionUrl = url.replace("-large", "-t500x500");
        return highDefinitionUrl;
      } else if (!url && !!avatar_url) {
        const highDefinitionUrl = avatar_url.replace("-large", "-t500x500");
        return highDefinitionUrl;
      } else {
        return null;
      }
    },
    onScroll() {
      this.hideDraggablePlayer = true;
      const queue = document.getElementById("queue");
      if (queue) {
        const isScrollEnd =
          queue.scrollTop + queue.clientHeight >= queue.scrollHeight;
        if (isScrollEnd && this.getNextUrl) {
          this.updateFavorites();
        }
      }
    },
    updateFavorites() {
      getNextFavorites(this.getApiKey, this.getNextUrl).then(
        (results: Favorites) => {
          results.collection.forEach((item) => {
            this.tracklist.push(item.track);
          });
          store.commit("addToFavorites", results.collection);
          store.commit("setNextUrl", results.next_href);
        }
      );
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
      this.forceUpdate();
    },
    searchTracks() {
      if (this.getNextUrl !== null && !this.launchedRecursive) {
        this.launchedRecursive = true;
        this.recursiveGetNextFavorites();
      }
    },
    recursiveGetNextFavorites() {
      getNextFavorites(this.getApiKey, this.getNextUrl).then(
        (results: Favorites) => {
          results.collection.forEach((item) => {
            this.tracklist.push(item.track);
          });
          store.commit("addToFavorites", results.collection);
          store.commit("setNextUrl", results.next_href);
          if (this.getNextUrl !== null) {
            this.recursiveGetNextFavorites();
          }
        }
      );
    },
    populateFavorites() {
      const favorites = this.getFavorites as Favorites;
      favorites.collection.forEach((item) => {
        this.tracklist.push(item.track);
      });
    },
    unhide(value: boolean) {
      this.hideDraggablePlayer = value;
    },
    disableScroll(value: boolean) {
      const queue = document.getElementById("queue");
      if (value && queue) {
        queue.style.overflowY = "hidden";
      } else if (!value && queue) {
        queue.style.overflowY = "auto";
      }
    },
  },
  watch: {
    getNextUrl(newVal) {
      if (newVal === null) {
        this.scrollEnd = false;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.Player {
  padding: 4rem 2.5rem;
  height: 100%;
  position: relative;

  &-loading {
    margin: 0 auto;
    height: 5rem;
    width: 5rem;
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
    margin-top: 3.5rem;
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

    &List {
      margin-left: 3rem;
    }
  }

  &-musicGrid,
  &-musicList {
    margin-top: 2.5rem;
    overflow-y: auto;
    overflow-x: hidden;
    height: calc(100vh - 26rem);
    display: flex;
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
