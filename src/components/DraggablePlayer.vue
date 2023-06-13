<template>
  <div
    id="draggable"
    class="DraggablePlayer"
    :class="{ 'DraggablePlayer--hide': hideDraggablePlayer }"
    :style="draggableStyle"
  >
    <div class="DraggablePlayer-dragButton" :style="buttonStyle"></div>
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
      <transition name="fade">
        <p v-if="!hasCurrentSong">A bit quiet here...</p>
        <div v-else class="DraggablePlayer-miniPlayerSong">
          <img
            lazy
            :src="getFullScaleImage(currentMediaArtwork, currentAvatarArtwork)"
            class="DraggablePlayer-miniPlayerArtwork"
          />
          <div class="DraggablePlayer-miniPlayerInfos">
            <p v-if="currentTitle" class="DraggablePlayer-miniPlayerTitle">
              {{ currentTitle }}
            </p>
            <p v-if="currentArtist" class="DraggablePlayer-miniPlayerArtist">
              {{ currentArtist }}
            </p>
          </div>
        </div>
      </transition>
      <div class="DraggablePlayer-miniPlayerControls">
        <button class="DraggablePlayer-miniPlayerPrevious" @click="previous">
          <img
            src="@/assets/icons/previousLight.svg"
            class="DraggablePlayer-contentTopIcon"
          />
        </button>
        <button
          v-if="paused"
          class="DraggablePlayer-miniPlayerPlay"
          @click="play"
        >
          <img
            src="@/assets/icons/playLight.svg"
            class="DraggablePlayer-contentTopIcon"
          />
        </button>
        <button v-else class="DraggablePlayer-miniPlayerPause" @click="pause">
          <img
            src="@/assets/icons/pauseLight.svg"
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
        <button
          class="DraggablePlayer-contentTopReturn Touch"
          @click="dragDown"
        >
          <img
            src="@/assets/icons/returnLight.svg"
            class="DraggablePlayer-contentTopIcon"
          />
        </button>
        <p class="DraggablePlayer-contentTopText">Playing Now</p>
      </div>
      <div class="DraggablePlayer-contentSlider">
        <div class="DraggablePlayer-contentSliderCurrent">
          <p
            class="DraggablePlayer-contentSliderCurrentEmpty"
            v-if="!hasCurrentSong"
          >
            A bit quiet here...
          </p>
          <div
            v-else
            class="DraggablePlayer-contentSliderCurrentImageContainer"
          >
            <img
              lazy
              :src="
                getFullScaleImage(currentMediaArtwork, currentAvatarArtwork)
              "
              class="DraggablePlayer-contentSliderCurrentArtwork"
            />
            <img
              lazy
              :src="
                getFullScaleImage(currentMediaArtwork, currentAvatarArtwork)
              "
              class="DraggablePlayer-contentSliderCurrentArtwork--blurred"
            />
          </div>
          <div class="DraggablePlayer-contentSliderCurrentInfos">
            <p
              v-if="currentTitle"
              class="DraggablePlayer-contentSliderCurrentTitle"
            >
              {{ currentTitle }}
            </p>
            <p
              v-if="currentArtist"
              class="DraggablePlayer-contentSliderCurrentArtist"
            >
              {{ currentArtist }}
            </p>
          </div>
        </div>
      </div>
      <div class="DraggablePlayer-contentAdditionalControls">
        <button class="DraggablePlayer-contentRepeat Touch" @click="repeat">
          <img
            src="@/assets/icons/loopLight.svg"
            class="DraggablePlayer-contentTopIcon"
          />
        </button>
        <button class="DraggablePlayer-contentShuffle Touch" @click="shuffle">
          <img
            src="@/assets/icons/shuffleLight.svg"
            class="DraggablePlayer-contentTopIcon"
          />
        </button>
      </div>
      <div class="DraggablePlayer-contentProgressBar">
        <div class="DraggablePlayer-contentDuration">
          <p>{{ displayedCurrentTime }}</p>
          <p v-if="!currentSongDuration">{{ initialDuration }}</p>
          <p v-else>{{ computeTime(currentSongDuration) }}</p>
        </div>
        <div id="bar" class="DraggablePlayer-contentBar">
          <div
            id="dot"
            class="DraggablePlayer-contentDot"
            :style="dotStyle"
          ></div>
        </div>
      </div>
      <div class="DraggablePlayer-contentControls">
        <button
          class="DraggablePlayer-contentControlsPrevious Touch"
          @click="previous"
        >
          <img
            src="@/assets/icons/previousLight.svg"
            class="DraggablePlayer-contentControlsIcon"
          />
        </button>
        <button
          v-if="paused"
          class="DraggablePlayer-contentControlsPlay Touch"
          @click="play"
        >
          <img
            src="@/assets/icons/playLight.svg"
            class="DraggablePlayer-contentControlsIcon"
          />
        </button>
        <button
          v-else
          class="DraggablePlayer-contentControlsPause Touch"
          @click="pause"
        >
          <img
            src="@/assets/icons/pauseLight.svg"
            class="DraggablePlayer-contentControlsIcon"
          />
        </button>
        <button class="DraggablePlayer-contentControlsNext Touch" @click="next">
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
import { mapGetters } from "vuex";

const INITIAL_POSITION = "12%";
const TRANSITION = "all 0.5s ease-in";
const BUTTON_TRANSFORM = "translateX(-50%) translateY(-2rem)";
const BUTTON_INITIAL = "translateX(-50%) translateY(0)";
const DEFAULT_OPACITY = 98;
const TOTAL_OPACITY = 100;
const INITIAL_DOTSTYLE = "translateX(0) translateY(-50%)";

export default Vue.extend({
  data() {
    return {
      viewportHeight: 0,
      maxHeight: 0,
      topBound: 0,
      startDragY: 0,
      isDragging: false,
      draggableStyle: {},
      contentStyle: {},
      miniPlayerStyle: {},
      buttonStyle: {},
      dotStyle: {},
      barWidth: 0,
      initialPosition: 0,
      currentPosition: 0,
      hideContent: true,
      hideMiniPlayer: false,
      initialDuration: "00:00",
      initialRemaining: "00:00",
      audio: {} as HTMLAudioElement,
      paused: true,
      currentTime: 0,
      displayedCurrentTime: "00:00",
      intervalId: 0,
    };
  },
  props: {
    hideDraggablePlayer: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    this.viewportHeight = window.innerHeight;

    const player = document.getElementById("player");
    const draggable = document.getElementById("draggable");
    const bar = document.getElementById("bar");

    if (bar && draggable && player) {
      this.barWidth = bar.offsetWidth;
      this.audio = new Audio("");
      this.maxHeight = player.offsetHeight;
      this.topBound = this.viewportHeight - this.maxHeight;
      console.log(this.topBound);
    }

    this.checkAudioStatus();
  },
  computed: {
    ...mapGetters(["getCurrentMediaUrl", "getCurrentSong"]),
    hasCurrentSong(): boolean {
      return this.getCurrentMediaUrl ? true : false;
    },
    currentMediaArtwork(): string {
      return this.getCurrentSong ? this.getCurrentSong.artwork_url : null;
    },
    currentAvatarArtwork(): string {
      return this.getCurrentSong.user
        ? this.getCurrentSong.user.avatar_url
        : null;
    },
    currentArtist(): string {
      return this.getCurrentSong.user
        ? this.getCurrentSong.user.username
        : null;
    },
    currentTitle(): string {
      return this.getCurrentSong ? this.getCurrentSong.title : null;
    },
    currentSongDuration(): number {
      return this.getCurrentSong.full_duration;
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
      this.currentPosition = e.touches[0].clientY;
      if (this.isDragging && this.currentPosition >= this.topBound) {
        this.draggableStyle = {
          height: `${this.viewportHeight - this.currentPosition}px`,
          transition: "none",
          opacity: `${TOTAL_OPACITY}%`,
        };
        let positionFraction =
          (this.viewportHeight - this.topBound - this.currentPosition) /
          this.viewportHeight;
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
        height: `${INITIAL_POSITION}`,
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
      this.buttonStyle = {
        transform: BUTTON_TRANSFORM,
      };
    },
    dragUp() {
      this.draggableStyle = {
        height: `${this.maxHeight}px`,
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
      this.buttonStyle = {
        transform: BUTTON_INITIAL,
      };
    },
    previous() {
      // do something
    },
    play() {
      if (!!this.audio && !!this.getCurrentMediaUrl) {
        this.audio.play();
        if (this.currentTime >= this.currentSongDuration) {
          this.currentTime = 0;
          this.resetDotAnimation();
        }
        if (
          this.currentTime > 0 &&
          this.currentTime < this.currentSongDuration
        ) {
          const remainingDuration = this.currentSongDuration - this.currentTime;
          this.dotStyle = {
            transform: `translateX(${this.barWidth - 20}px) translateY(-50%)`,
            transition: `all ${remainingDuration}ms linear`,
          };
        }
      }
    },
    pause() {
      if (!!this.audio && !!this.getCurrentMediaUrl) {
        this.audio.pause();
        if (
          this.currentTime > 0 &&
          this.currentTime < this.currentSongDuration
        ) {
          const dotPosition = this.getDotPosition();
          this.dotStyle = {
            transform: `translateX(${dotPosition}px) translateY(-50%)`,
            transition: "",
          };
        }
      }
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
    checkAudioStatus() {
      setInterval(() => {
        this.paused = this.audio && this.audio.paused;
      }, 100);
    },
    getFullScaleImage(url: string, avatar_url: string): string | undefined {
      if (url) {
        const highDefinitionUrl = url.replace("-large", "-t500x500");
        return highDefinitionUrl;
      } else if (!url && !!avatar_url) {
        const highDefinitionUrl = avatar_url.replace("-large", "-t500x500");
        return highDefinitionUrl;
      } else {
        return undefined;
      }
    },
    updateTime() {
      this.currentTime = this.audio.currentTime;
      this.displayedCurrentTime = this.computeTime(
        Math.trunc(this.currentTime * 1000)
      );
    },
    onPause() {
      if (this.currentTime > 0 && this.currentTime < this.currentSongDuration) {
        const dotPosition = this.getDotPosition();
        this.dotStyle = {
          transform: `translateX(${dotPosition}px) translateY(-50%)`,
          transition: "",
        };
      }
    },
    onEnded() {
      this.dotStyle = {
        transform: `${INITIAL_DOTSTYLE}`,
        transition: "",
      };
    },
    computeTime(time: number): string {
      if (time < 1000 || !time) {
        return "00:00";
      }
      let totalSeconds = Math.floor(time / 1000);
      let hours = 0;
      let minutes = 0;

      if (totalSeconds >= 3600) {
        hours = Math.floor(totalSeconds / 3600);
        totalSeconds = totalSeconds % 3600;
      }

      if (totalSeconds >= 60) {
        minutes = Math.floor(totalSeconds / 60);
        totalSeconds = totalSeconds % 60;
      }

      const paddedHours = String(hours).padStart(2, "0");
      const paddedMinutes = String(minutes).padStart(2, "0");
      const paddedSeconds = String(totalSeconds).padStart(2, "0");

      if (hours > 0) {
        return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
      } else {
        return `${paddedMinutes}:${paddedSeconds}`;
      }
    },
    getDotPosition(): number {
      const dot = document.getElementById("dot");
      if (dot) {
        const style = window.getComputedStyle(dot);
        const transform = style.transform;
        const values = transform.split("(")[1].split(")")[0].split(",");
        const dotPosition = parseFloat(values[4]);
        return dotPosition;
      }
      return 0;
    },
    resetDotAnimation() {
      this.dotStyle = {
        transform: `${INITIAL_DOTSTYLE}`,
        transition: "",
      };
      setTimeout(() => {
        this.dotStyle = {
          transform: `translateX(${this.barWidth - 20}px) translateY(-50%)`,
          transition: `all ${this.currentSongDuration}ms linear`,
        };
      }, 100);
    },
  },
  watch: {
    hideDraggablePlayer(newVal) {
      if (newVal) {
        this.draggableStyle = {};
      }
    },
    getCurrentMediaUrl: {
      handler(newVal) {
        if (this.audio) {
          this.audio.removeEventListener("timeupdate", this.updateTime);
          this.audio.removeEventListener("pause", this.onPause);
          this.audio.removeEventListener("ended", this.onEnded);
          this.audio.pause();
          this.audio.currentTime = 0;
          this.audio = new Audio(newVal.url);
          this.audio.addEventListener("timeupdate", this.updateTime);
          this.audio.addEventListener("pause", this.onPause);
          this.audio.addEventListener("ended", this.onEnded);
          this.audio.play();
          this.currentTime = 0;
          this.resetDotAnimation();
        }
      },
      deep: true,
    },
  },
});
</script>

<style lang="scss" scoped>
.DraggablePlayer {
  $block: &;

  position: absolute;
  left: 1.5rem;
  bottom: 0;
  z-index: 999;
  height: 12%;
  width: calc(100vw - 3rem);
  background: $light;
  border-radius: 3rem 3rem 0 0;
  transition: all 0.5s ease-in;
  opacity: 98%;

  &--hide {
    height: 2%;
  }

  &-drag {
    &Button {
      position: absolute;
      height: 1rem;
      width: 8rem;
      border-radius: 5rem;
      background: $black;
      left: 50%;
      transform: translateX(-50%) translateY(-2rem);
      top: 0.5rem;
      transition: all 0.5s;
    }

    &Area {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 6rem;
      transform: translateY(-3rem);
      z-index: 999;
    }
  }

  &-miniPlayer {
    position: absolute;
    z-index: 1;
    width: 100%;
    padding: 1.5rem 3rem 0 1rem;
    height: 7.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.5s;

    &Controls {
      display: flex;
    }

    &Previous,
    &Next,
    &Pause,
    &Play {
      padding: 1.2rem;
      min-height: 4rem;
      min-width: 4rem;
    }

    &Song {
      display: flex;
      align-items: center;
      min-width: calc(100% - 9.5rem);
    }

    &Infos {
      display: flex;
      flex-direction: column;
      max-width: calc(100% - 9rem);
    }

    &Artwork {
      width: 7.5rem;
      height: 7.5rem;
      border-radius: 1.5rem;
      margin-right: 1rem;
    }

    &Artist {
      font-size: $s;
    }

    &Title {
      font-weight: 600;
      font-size: $m;
      margin-bottom: 0.2rem;
    }

    &Artist,
    &Title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  &-content {
    padding: 5rem 0 0;
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
      margin-bottom: 1.5rem;

      &Return {
        position: absolute;
        left: 0.6rem;
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
      padding: 0 2rem;

      &Current {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100%;

        &Empty {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
        }

        &ImageContainer {
          position: relative;
        }

        &Artwork {
          position: relative;
          z-index: 2;

          &--blurred {
            position: absolute;
            left: 0;
            z-index: 1;
            filter: blur(1rem);
            transform: scale(1.05) translateY(1rem);
            opacity: 0.7;
          }
        }

        &Artwork,
        &Artwork--blurred {
          height: 30rem;
          width: 30rem;
          border-radius: 3rem;
        }

        &Infos {
          margin-top: 4.5rem;
          text-align: center;
          line-height: 2.2rem;
        }

        &Title {
          font-size: $xl;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        &Artist {
          font-size: $l;
          font-weight: 300;
        }
      }
    }

    &ProgressBar {
      width: 100%;
      padding: 0 2rem;
      margin-bottom: 1.5rem;
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
      margin: 0 6rem;

      &Play,
      &Previous,
      &Next {
        min-width: 8rem;
        min-height: 8rem;
      }

      &Icon {
        height: 2.5rem;
      }
    }
  }
}
</style>
