<template>
  <div class="GridTile">
    <img lazy class="GridTile-cover" :src="src" />
    <p class="GridTile-title">{{ title }}</p>
    <p class="GridTile-artist">by {{ artist }}</p>
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
.GridTile {
  height: 21rem;
  width: 15rem;
  border-radius: 3rem;
  background: $light;
  margin-bottom: 2.5rem;

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
