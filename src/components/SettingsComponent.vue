<template>
  <div
    class="Settings"
    :class="{ 'Settings--dark': getDarkMode }"
    :style="settingsStyle"
  >
    <div class="Settings-contentTop">
      <button class="Settings-contentTopReturn Touch" @click="hide">
        <img
          v-if="!getDarkMode"
          src="@/assets/icons/returnLight.svg"
          class="Settings-contentTopIcon"
        />
        <img
          v-else
          src="@/assets/icons/returnDark.svg"
          class="Settings-contentTopIcon"
        />
      </button>
      <p class="Settings-contentTopText">Settings</p>
    </div>
    <div class="Settings-profile">
      <p class="Settings-profileText Text">Fetch From</p>
      <input
        type="text"
        v-model="url"
        class="Settings-profileInput Input"
        placeholder='Paste Your SoundCloud Profile Here (no "on." links )'
        @blur="reset(getProfile)"
      />
      <transition name="fade">
        <p v-show="hasError" class="Settings-profileError Error">{{ error }}</p>
      </transition>
      <img
        v-if="isFetching"
        class="Settings-loading"
        lazy
        src="@/assets/img/loading.gif"
      />
    </div>
    <div class="Settings-theme">
      <p class="Settings-themeText Text">Theme</p>
      <button
        @click="toggleDarkMode"
        class="Settings-themeSwitch"
        :class="{ 'Settings-themeSwitch--dark': getDarkMode }"
      >
        <div class="Settings-themeSwitchIcons">
          <img src="@/assets/icons/sun.svg" class="Settings-themeIcon" />
          <img src="@/assets/icons/moon.svg" class="Settings-themeIcon" />
        </div>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import store from "@/store";
import Vue from "vue";
import ProfileMixin from "@/mixins/profile";
import { StyleValue } from "vue/types/jsx";
import { mapGetters } from "vuex";

export default Vue.extend({
  mixins: [ProfileMixin],
  created() {
    const player = document.getElementById("player");

    if (player) {
      this.maxHeight = player.offsetHeight;
    }

    this.updateSettingsStyle();
  },
  data() {
    return {
      maxHeight: 0,
      settingsStyle: {} as StyleValue,
      route: false,
    };
  },
  computed: {
    ...mapGetters(["getDarkMode"]),
  },
  methods: {
    toggleDarkMode() {
      store.dispatch("toggleDarkMode");
    },
    hide() {
      this.$emit("toggleSettings");
    },
    reset(callback: () => void) {
      store.commit("resetState");
      this.$emit("reset");
      callback();
    },
    updateSettingsStyle(): StyleValue {
      this.settingsStyle = { height: `${this.maxHeight}px` };
      return this.settingsStyle;
    },
  },
});
</script>

<style lang="scss">
.Settings {
  $block: &;

  position: absolute;
  bottom: 0;
  left: 1.5rem;
  z-index: 998;
  width: 100%;
  width: calc(100vw - 3rem);
  background: $white;
  transition: all 0.5s;

  &--dark {
    background: $black;

    & #{$block}-contentTopText {
      color: $white;
    }

    & #{$block}-profileText {
      color: $white;
    }

    & #{$block}-profileInput {
      border-bottom-color: $white;
      color: $white;
    }

    & #{$block}-theme {
      color: $white;
    }
  }

  &-content {
    &Top {
      margin-top: 5rem;
      display: flex;
      align-items: center;
      position: relative;
      padding: 0 3rem;
      margin-bottom: 1.5rem;

      &Return {
        position: absolute;
        left: 0.6rem;
      }

      &Text {
        width: 100%;
        font-weight: 700;
        font-size: $xxl;
        text-align: center;
      }
    }
  }

  &-profile {
    margin-top: 5.5rem;
    padding: 0 3rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-family: $font-primary;

    &Text {
      font-weight: 700;
    }

    &Text,
    &Input {
      margin-bottom: 0.5rem;
    }

    &Error {
      font-size: $s;
      font-family: $font-primary;
      color: #dc3545;
      font-weight: 300;
    }
  }

  &-loading {
    height: 5rem;
    width: 5rem;
    position: absolute;
    bottom: 25vh;
    left: 50%;
    transform: translateX(-50%);
  }

  &-theme {
    padding: 0 3rem;
    margin-top: 4rem;
    font-family: $font-primary;
    font-weight: 700;

    &Switch {
      background: $black;
      position: relative;
      width: 7.5rem;
      height: 3.2rem;
      border-radius: 5rem;
      margin-top: 1rem;
      transition: all 0.5s;

      &::before {
        content: "";
        position: absolute;
        z-index: 1;
        left: 0;
        top: 50%;
        height: 3rem;
        width: 3rem;
        background: $white;
        border-radius: 50%;
        transform: translateY(-50%);
        transition: all 0.5s;
      }

      &--dark {
        background: $white;

        &::before {
          background: $dark;
          transform: translateX(4.5rem) translateY(-50%);
        }
      }

      &Icons {
        position: absolute;
        z-index: 2;
        left: 0;
        display: flex;
        width: 100%;
        justify-content: space-between;
        top: 50%;
        transform: translateY(-50%);
        padding: 0 0.5rem;
      }
    }
  }
}
</style>
