<template>
  <div
    class="DraggablePlayer"
    :class="{ 'DraggablePlayer--hide': hideDraggablePlayer }"
    :style="style"
  >
    <div class="DraggablePlayer-dragButton"></div>
    <div
      @touchstart="startDrag"
      @touchmove="onDrag"
      @touchend="endDrag"
      class="DraggablePlayer-dragArea"
    ></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

const MAX_TOP = 10;
const INITIAL_POSITION = "88.5%";
const TRANSITION = "all 0.5s ease-in";

export default Vue.extend({
  data() {
    return {
      startDragY: 0,
      isDragging: false,
      style: {},
    };
  },
  props: {
    hideDraggablePlayer: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    startDrag(e: TouchEvent) {
      this.$emit("disallowScroll", true);
      this.isDragging = true;
      this.startDragY = e.touches[0].clientY;
    },
    onDrag(e: TouchEvent) {
      this.$emit("unhide", false);
      if (this.isDragging) {
        const currentY = e.touches[0].clientY;
        this.style = { top: `${currentY}px`, transition: "none" };
      }
    },
    endDrag(e: TouchEvent) {
      this.isDragging = false;
      const currentY = e.changedTouches[0].clientY;
      const direction = currentY - this.startDragY;
      if (direction < 0) {
        // Scrolling Up, reach MAX_TOP
        this.style = { top: `${MAX_TOP}px`, transition: TRANSITION };
      } else {
        // Scrolling Down, reach INITIAL_POSITION
        this.style = {
          top: `${INITIAL_POSITION}`,
          transition: TRANSITION,
        };
      }
      this.$emit("disallowScroll", false);
    },
  },
  watch: {
    hideDraggablePlayer(newVal) {
      if (newVal) {
        this.style = {};
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.DraggablePlayer {
  $block: &;

  position: absolute;
  left: 1.5rem;
  top: 88.5%;
  z-index: 1;
  height: 100vh;
  width: calc(100vw - 3rem);
  background: $light;
  border-radius: 3rem 3rem 0 0;
  transition: all 0.5s ease-in;

  &--hide {
    top: 98%;
  }

  &-drag {
    &Button {
      position: absolute;
      height: 1rem;
      width: 8rem;
      border-radius: 5rem;
      background: $black;
      left: 50%;
      transform: translateX(-50%);
      top: 0.5rem;
    }

    &Area {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 3rem;
    }
  }
}
</style>
