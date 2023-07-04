<template>
  <div class="PlayerSelectorView">
    <SoundCloudPlayerView></SoundCloudPlayerView>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import SoundCloudPlayerView from "@/components/SoundCloudPlayerView.vue";

export default Vue.extend({
  components: {
    SoundCloudPlayerView,
  },
});
</script>

<style lang="scss" scoped></style>
