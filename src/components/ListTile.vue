<template>
  <div class="ListTile">
    <img lazy class="ListTile-cover" :src="src" />
    <div class="ListTile-text">
      <p class="ListTile-title">{{ title }}</p>
      <p class="ListTile-artist">by {{ artist }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    src: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    artist: {
      type: String,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
.ListTile {
  display: flex;
  height: 7.5rem;
  margin-bottom: 1.5rem;

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
