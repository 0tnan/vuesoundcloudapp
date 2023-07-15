<template>
  <div
    v-if="isSoundCloudTrack"
    class="ListTile"
    @click="setSoundCloudSong"
    :class="{ 'ListTile--dark': getDarkMode }"
  >
    <img
      loading="lazy"
      class="ListTile-cover"
      :src="getFullScaleImage(soundCloudArtwork, soundCloudAvatar)"
    />
    <div class="ListTile-text">
      <p class="ListTile-title">{{ soundCloudTitle }}</p>
      <p class="ListTile-artist">{{ soundCloudArtist }}</p>
    </div>
  </div>
  <div v-else-if="isSpotifyPlaylist" class="ListTile">
    <img loading="lazy" class="ListTile-cover" :src="playlistSource" />
    <div class="ListTile-text">
      <p class="ListTile-name">{{ playlistName }}</p>
      <p class="ListTile-description">{{ playlistDescription }}</p>
    </div>
  </div>
  <div v-else-if="isSpotifyTrack" class="ListTile">
    <img loading="lazy" class="ListTile-cover" :src="spotifyArtwork" />
    <div class="ListTile-text">
      <p class="ListTile-title">{{ spotifyTitle }}</p>
      <p class="ListTile-artist">{{ spotifyArtists }}</p>
    </div>
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
  &-artist,
  &-name,
  &-description {
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

  &-title,
  &-name {
    font-size: $m;
    font-weight: 600;
  }

  &-artist,
  &-description {
    font-size: $s;
    font-weight: 300;
    margin-top: 0.5rem;
  }
}
</style>
