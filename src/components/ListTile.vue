<template>
  <div
    class="ListTile"
    @click="setSong(track)"
    :class="{ 'ListTile--dark': getDarkMode }"
  >
    <img
      loading="lazy"
      class="ListTile-cover"
      :src="getFullScaleImage(artwork, avatar)"
    />
    <div class="ListTile-text">
      <p class="ListTile-title">{{ title }}</p>
      <p class="ListTile-artist">{{ artist }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import TrackMixin from "@/mixins/track";
export default Vue.extend({
  mixins: [TrackMixin],
});
</script>

<style lang="scss" scoped>
.ListTile {
  $block: &;

  display: flex;
  height: 7.5rem;
  margin-bottom: 1.5rem;

  &--dark {
    & #{$block}-title,
    & #{$block}-artist {
      color: $white;
    }
  }

  &-cover {
    border-radius: 1.5rem;
    height: 7.5rem;
    width: 7.5rem;
  }

  &-title,
  &-artist {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-left: 1.5rem;
    margin-right: 1.5rem;
  }

  &-text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: calc(100% - 7.5rem);
  }

  &-title {
    font-size: $m;
    font-weight: 600;
  }

  &-artist {
    font-size: $s;
    font-weight: 300;
    margin-top: 0.5rem;
  }
}
</style>
