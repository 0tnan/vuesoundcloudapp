<template>
  <div
    @click="setSoundCloudSong"
    class="GridTile"
    :class="{ 'GridTile--dark': getDarkMode }"
    v-if="isSoundCloudTrack"
  >
    <img
      loading="lazy"
      class="GridTile-cover"
      :src="getFullScaleImage(soundCloudArtwork, soundCloudAvatar)"
    />
    <p class="GridTile-title">{{ soundCloudTitle }}</p>
    <p class="GridTile-artist">{{ soundCloudArtist }}</p>
  </div>
  <div
    v-else-if="isSpotifyPlaylist"
    class="GridTile"
    :class="{ 'GridTile--dark': getDarkMode }"
  >
    <img loading="lazy" class="GridTile-cover" :src="playlistSource" />
    <p class="GridTile-name">{{ playlistName }}</p>
    <p class="GridTile-description">{{ playlistDescription }}</p>
  </div>
  <div
    v-else-if="isSpotifyTrack"
    class="GridTile"
    :class="{ 'GridTile--dark': getDarkMode }"
  >
    <img loading="lazy" class="GridTile-cover" :src="spotifyArtwork" />
    <p class="GridTile-name">{{ spotifyTitle }}</p>
    <p class="GridTile-description">{{ spotifyArtists }}</p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import MediaMixin from "@/mixins/media";
export default Vue.extend({
  mixins: [MediaMixin],
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
  &-artist,
  &-name,
  &-description {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-left: 1.5rem;
    margin-right: 1.5rem;
  }

  &-title,
  &-name {
    font-size: $m;
    font-weight: 600;
    margin-top: 1rem;
  }

  &-artist,
  &-description {
    font-size: $s;
    font-weight: 300;
    margin-top: 0.5rem;
  }
}
</style>
