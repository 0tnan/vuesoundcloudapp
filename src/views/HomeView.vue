<template>
  <div class="Home">
    <p class="Home-logo">V</p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({});
</script>

<style lang="scss">
.Home {
  height: 100%;

  &-logo {
    font-family: $font-secondary;
    font-size: 30rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: $black;
    height: 100%;
  }
}
</style>
