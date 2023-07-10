<template>
  <div id="player" class="Player" :class="{ 'Player--dark': getDarkMode }">
    <slot name="player"></slot>
    <transition name="slide" appear>
      <slot name="settings"></slot>
    </transition>
    <div class="Player-topContainer">
      <div class="Player-avatar">
        <img loading="lazy" :src="avatarURL" class="Player-avatarImg" />
      </div>
      <button @click="toggleSettings" class="Player-settingsIcon">
        <img src="@/assets/icons/settings.svg" />
      </button>
    </div>
    <div class="Player-search">
      <input
        autocomplete="off"
        autocorrect="off"
        @input="updateValue"
        type="text"
        class="Player-searchInput"
        placeholder="search"
        :value="value"
      />
      <button @click="onRemove" class="Player-searchRemove">
        <img class="Player-searchRemoveIcon" src="@/assets/icons/cross.svg" />
      </button>
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
      <slot name="menu"></slot>
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
    <slot name="lists"></slot>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { mapGetters } from "vuex";

export default Vue.extend({
  computed: {
    ...mapGetters(["getDarkMode"]),
  },
  props: {
    avatarURL: {
      type: String,
      required: true,
    },
    toggleSettings: {
      type: Function as PropType<(payload: MouseEvent) => void>,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    onRemove: {
      type: Function as PropType<(payload: MouseEvent) => void>,
      required: true,
    },
    onRefresh: {
      type: Function as PropType<(payload: MouseEvent) => void>,
      required: true,
    },
    isRefreshing: {
      type: Boolean,
      required: true,
    },
    refreshDisabled: {
      type: Boolean,
      required: true,
    },
    switchToGrid: {
      type: Function as PropType<(payload: MouseEvent) => void>,
      required: true,
    },
    switchToList: {
      type: Function as PropType<(payload: MouseEvent) => void>,
      required: true,
    },
    gridEnabled: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    updateValue(event: Event) {
      if (event && event.target) {
        const target = event.target as HTMLInputElement;
        this.$emit("input", target.value);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.Player {
  $block: &;

  padding: 0 2.5rem;
  height: 100%;
  position: relative;
  overflow: hidden;
  transition: all 0.5s;
  position: relative;
  z-index: 1;

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
    padding-bottom: 12rem;
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

    & ::-webkit-scrollbar-thumb {
      background: $white;
    }
  }
}
</style>
