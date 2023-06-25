<template>
  <div
    @click="setSong(track)"
    class="GridTile"
    :class="{ 'GridTile--dark': getDarkMode }"
  >
    <img
      loading="lazy"
      class="GridTile-cover"
      :src="getFullScaleImage(artwork, avatar)"
    />
    <p class="GridTile-title">{{ title }}</p>
    <p class="GridTile-artist">{{ artist }}</p>
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
.GridTile {
  $block: &;

  height: 21rem;
  width: 15rem;
  border-radius: 3rem;
  background: $light;
  margin-bottom: 2.5rem;
  transition: all 0.5s;

  &--dark {
    background: $dark;

    & #{$block}-title,
    & #{$block}-artist {
      color: $white;
    }
  }

  &-cover {
    border-radius: 3rem;
    height: 15rem;
    width: 15rem;
  }

  &-title,
  &-artist {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-left: 1.5rem;
    margin-right: 1.5rem;
  }

  &-title {
    font-size: $m;
    font-weight: 600;
    margin-top: 1rem;
  }

  &-artist {
    font-size: $s;
    font-weight: 300;
    margin-top: 0.5rem;
  }
}
</style>
