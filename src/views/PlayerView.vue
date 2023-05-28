<template>
  <div class="Player">
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
      <input type="text" class="Player-searchInput" placeholder="search" />
      <img src="@/assets/icons/search.svg" class="Player-searchIcon" />
      <button class="Player-searchRefresh">
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
    <transition mode="out-in" name="fade" appear>
      <div v-if="gridEnabled" key="grid" class="Player-musicGrid">
        <GridTile
          v-for="track in tracklist"
          :key="track.id"
          :src="getFullScaleImage(track.artwork_url)"
          :title="track.title"
          :artist="track.user.username"
        ></GridTile>
      </div>
      <div v-else key="list" class="Player-musicList" appear>
        <ListTile
          v-for="track in tracklist"
          :key="track.id"
          :src="getFullScaleImage(track.artwork_url)"
          :title="track.title"
          :artist="track.user.username"
        ></ListTile>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Favorites } from "@/interfaces/favorites";
import { Track } from "@/interfaces/track";
import Vue from "vue";
import { mapGetters } from "vuex";
import GridTile from "@/components/GridTile.vue";
import ListTile from "@/components/ListTile.vue";

export default Vue.extend({
  components: {
    GridTile,
    ListTile,
  },
  data() {
    return {
      gridEnabled: true,
      tracklist: [] as Track[],
    };
  },
  mounted() {
    const favorites = this.getFavorites as Favorites;
    favorites.collection.forEach((item) => {
      this.tracklist.push(item.track);
    });
    console.log(this.tracklist);
  },
  computed: {
    ...mapGetters(["getApiKey", "getProfileId", "getFavorites", "getUser"]),
    username(): string {
      return this.getUser.username;
    },
  },
  methods: {
    switchToGrid() {
      this.gridEnabled = true;
    },
    switchToList() {
      this.gridEnabled = false;
    },
    getFullScaleImage(url: string) {
      if (url) {
        const highDefinitionUrl = url.replace("-large", "-t500x500");
        return highDefinitionUrl;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.Player {
  padding: 4rem 2.5rem;
  height: 100%;

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
}
</style>
