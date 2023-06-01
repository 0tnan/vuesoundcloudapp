<template>
  <div
    id="draggable"
    class="DraggablePlayer"
    :class="{ 'DraggablePlayer--hide': hideDraggablePlayer }"
    :style="draggableStyle"
  >
    <div class="DraggablePlayer-dragButton"></div>
    <div
      @touchstart="startDrag"
      @touchmove="onDrag"
      @touchend="endDrag"
      class="DraggablePlayer-dragArea"
    ></div>
    <div
      class="DraggablePlayer-miniPlayer"
      :class="{ 'DraggablePlayer-miniPlayer--hide': hideMiniPlayer }"
      :style="miniPlayerStyle"
    >
      <p>A bit quiet here...</p>
      <div class="DraggablePlayer-miniPlayerControls">
        <button class="DraggablePlayer-miniPlayerPrevious" @click="previous">
          <img
            src="@/assets/icons/previousLight.svg"
            class="DraggablePlayer-contentTopIcon"
          />
        </button>
        <button class="DraggablePlayer-miniPlayerPlay" @click="play">
          <img
            src="@/assets/icons/playLight.svg"
            class="DraggablePlayer-contentTopIcon"
          />
        </button>
        <button class="DraggablePlayer-miniPlayerNext" @click="next">
          <img
            src="@/assets/icons/nextLight.svg"
            class="DraggablePlayer-contentTopIcon"
          />
        </button>
      </div>
    </div>
    <div
      class="DraggablePlayer-content"
      :class="{ 'DraggablePlayer-content--hide': hideContent }"
      :style="contentStyle"
    >
      <div class="DraggablePlayer-contentTop">
        <button class="DraggablePlayer-contentTopReturn" @click="dragDown">
          <img
            src="@/assets/icons/returnLight.svg"
            class="DraggablePlayer-contentTopIcon"
          />
        </button>
        <p class="DraggablePlayer-contentTopText">Playing Now</p>
      </div>
      <div class="DraggablePlayer-contentSlider"></div>
      <div class="DraggablePlayer-contentAdditionalControls">
        <button class="DraggablePlayer-contentRepeat" @click="repeat">
          <img
            src="@/assets/icons/loopLight.svg"
            class="DraggablePlayer-contentTopIcon"
          />
        </button>
        <button class="DraggablePlayer-contentShuffle" @click="shuffle">
          <img
            src="@/assets/icons/shuffleLight.svg"
            class="DraggablePlayer-contentTopIcon"
          />
        </button>
      </div>
      <div class="DraggablePlayer-contentProgressBar">
        <div class="DraggablePlayer-contentDuration">
          <p>{{ initialRemaining }}</p>
          <p>{{ initialDuration }}</p>
        </div>
        <div class="DraggablePlayer-contentBar">
          <div class="DraggablePlayer-contentDot"></div>
        </div>
      </div>
      <div class="DraggablePlayer-contentControls">
        <button
          class="DraggablePlayer-contentControlsPrevious"
          @click="previous"
        >
          <img
            src="@/assets/icons/previousLight.svg"
            class="DraggablePlayer-contentControlsIcon"
          />
        </button>
        <button class="DraggablePlayer-contentControlsPlay" @click="play">
          <img
            src="@/assets/icons/playLight.svg"
            class="DraggablePlayer-contentControlsIcon"
          />
        </button>
        <button class="DraggablePlayer-contentControlsNext" @click="next">
          <img
            src="@/assets/icons/nextLight.svg"
            class="DraggablePlayer-contentControlsIcon"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

const MAX_TOP = 10;
const INITIAL_POSITION = "88.5%";
const TRANSITION = "all 0.5s ease-in";
const DEFAULT_OPACITY = 98;
const TOTAL_OPACITY = 100;

export default Vue.extend({
  data() {
    return {
      startDragY: 0,
      isDragging: false,
      draggableStyle: {},
      contentStyle: {},
      miniPlayerStyle: {},
      initialPosition: 0,
      currentPosition: 0,
      hideContent: true,
      hideMiniPlayer: false,
      initialDuration: "00:00",
      initialRemaining: "00:00",
    };
  },
  props: {
    hideDraggablePlayer: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    const draggable = document.getElementById("draggable");
    if (draggable) {
      this.initialPosition = draggable.offsetTop;
    }
  },
  methods: {
    startDrag(e: TouchEvent) {
      this.$emit("disallowScroll", true);
      this.isDragging = true;
      this.startDragY = e.touches[0].clientY;
    },
    onDrag(e: TouchEvent) {
      this.$emit("unhide", false);
      this.currentPosition = e.touches[0].clientY;
      if (this.isDragging && this.currentPosition >= 0) {
        this.draggableStyle = {
          top: `${this.currentPosition}px`,
          transition: "none",
          opacity: `${TOTAL_OPACITY}%`,
        };
        let positionFraction =
          (this.currentPosition - this.initialPosition) /
          (MAX_TOP - this.initialPosition);
        if (positionFraction < 0) {
          positionFraction = 0;
        }
        if (positionFraction > 1) {
          positionFraction = 1;
        }
        this.contentStyle = { opacity: positionFraction, transition: "none" };
        this.miniPlayerStyle = {
          opacity: 1 - positionFraction,
          scale: 1 - positionFraction,
          transition: "none",
        };
      }
    },
    endDrag(e: TouchEvent) {
      this.isDragging = false;
      this.currentPosition = e.changedTouches[0].clientY;
      const direction = this.currentPosition - this.startDragY;
      const thirdScreen = window.innerHeight / 3;
      const twoThirdScreen = (window.innerHeight * 2) / 3;
      // remove unnecessary initial modifier when style is controled by the drag movement
      this.hideContent = false;

      if (direction < 0) {
        // Dragging Up, reach MAX_TOP
        if (this.currentPosition > twoThirdScreen) {
          // Dragging up but didn't drag up to two third of the screen
          this.dragDown();
        } else {
          this.dragUp();
        }
      } else {
        // Dragging Down, reach INITIAL_POSITION
        if (this.currentPosition < thirdScreen) {
          // Dragging Down but didn't drag to a third of the screen height
          this.dragUp();
        } else {
          this.dragDown();
        }
      }
      this.$emit("disallowScroll", false);
    },
    dragDown() {
      this.draggableStyle = {
        top: `${INITIAL_POSITION}`,
        transition: TRANSITION,
        opacity: `${DEFAULT_OPACITY}%`,
      };
      this.contentStyle = {
        opacity: 0,
        transition: TRANSITION,
      };
      this.miniPlayerStyle = {
        scale: 1,
        opacity: 1,
        transition: TRANSITION,
      };
    },
    dragUp() {
      this.draggableStyle = {
        top: `${MAX_TOP}px`,
        transition: TRANSITION,
        opacity: `${TOTAL_OPACITY}%`,
      };
      this.contentStyle = {
        opacity: `${TOTAL_OPACITY}%`,
        transition: TRANSITION,
      };
      this.miniPlayerStyle = {
        scale: 0,
        opacity: 0,
        transition: TRANSITION,
      };
    },
    previous() {
      // do something
    },
    play() {
      // do something
    },
    next() {
      // do something
    },
    repeat() {
      // do something
    },
    shuffle() {
      // do something
    },
  },
  watch: {
    hideDraggablePlayer(newVal) {
      if (newVal) {
        this.draggableStyle = {};
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
  opacity: 98%;

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
      z-index: 2;
    }
  }

  &-miniPlayer {
    position: absolute;
    width: 100%;
    padding: 1.5rem 3rem 0 1rem;
    height: 7.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.5s;

    &Previous {
      margin-right: 2.5rem;
    }

    &Next {
      margin-left: 2.5rem;
    }
  }

  &-content {
    padding: 5rem 0;
    height: 100%;
    transition: all 0.5s;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    &--hide {
      opacity: 0;
    }

    &Top {
      display: flex;
      align-items: center;
      position: relative;
      padding: 0 3rem;

      &Return {
        position: absolute;
        left: 3rem;
      }

      &Text {
        width: 100%;
        font-weight: 700;
        font-size: $xxl;
        text-align: center;
      }
    }

    &Slider {
      height: 37.5rem;
    }

    &AdditionalControls,
    &ProgressBar {
      width: 100%;
      padding: 0 2rem;
    }

    &AdditionalControls,
    &ProgressBar,
    &Duration,
    &Controls {
      display: flex;
      justify-content: space-between;
    }

    &Duration {
      font-weight: 300;
    }

    &ProgressBar {
      display: flex;
      flex-direction: column;
    }

    &Bar {
      height: 0.5rem;
      width: 100%;
      background: $black;
      border-radius: 5rem;
      margin-top: 1.5rem;
      position: relative;
    }

    &Dot {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      height: 2rem;
      width: 2rem;
      border-radius: 50%;
      background: $black;
    }

    &Controls {
      margin: 0 25%;

      &Icon {
        height: 2.5rem;
      }
    }
  }
}
</style>
