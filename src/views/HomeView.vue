<template>
  <div class="Home" :class="{ 'Home--dark': getDarkMode }">
    <transition name="fade">
      <p v-if="!getSoundCloudApiKey" class="Home-logo">V</p>
      <div v-else class="Home-profile">
        <p class="Home-profileText Text">Fetch From</p>
        <input
          type="text"
          v-model="url"
          class="Home-profileInput Input"
          placeholder='Paste Your SoundCloud Profile URL Here (no "on." links )'
          @blur="getProfile"
        />
        <transition name="fade">
          <p v-show="hasError" class="Home-profileError Error">{{ error }}</p>
        </transition>
        <button
          v-if="getSoundCloudProfileId"
          @click="pursue"
          :disabled="isFetching"
          class="Home-button Button"
        >
          Continue to SoundCloud
        </button>
        <img
          v-if="isFetching"
          class="Home-loading"
          lazy
          src="@/assets/img/loading.gif"
        />
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Profile from "@/mixins/profile";

export default Vue.extend({
  mixins: [Profile],
  data() {
    return {
      route: false,
    };
  },
  methods: {
    pursue() {
      this.$router.push("/player-selector").catch(() => {
        // DO NOTHING IF ALREADY HERE
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.Home {
  $block: &;

  height: 100%;
  padding: 4rem 4.5rem 2.5rem;
  position: relative;

  &--dark {
    & #{$block}-profileText {
      color: $white;
    }

    & #{$block}-profileInput {
      border-bottom-color: $white;
      color: $white;
    }
  }

  &-logo {
    font-family: $font-secondary;
    font-size: 30rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: $black;
    height: 100%;
  }

  &-profile {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
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

  &-button {
    margin-top: 1rem;
  }

  &-loading {
    height: 5rem;
    width: 5rem;
    position: absolute;
    bottom: 25vh;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
