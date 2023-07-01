<template>
  <div
    ref="draggable"
    id="draggable"
    class="DraggablePlayer"
    :class="{ 'DraggablePlayer--dark': getDarkMode }"
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
      <p v-if="!hasCurrentSong">A bit quiet here...</p>
      <div v-else class="DraggablePlayer-miniPlayerSong" @click="dragUp">
        <img
          loading="lazy"
          :src="getCurrentFullScaleImage"
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
      <div class="DraggablePlayer-miniPlayerControls">
        <button class="DraggablePlayer-miniPlayerPrevious" @click="previous">
          <img
            v-if="getDarkMode"
            src="@/assets/icons/previousDark.svg"
            class="DraggablePlayer-contentTopIcon--outside"
          />
          <img
            v-else
            src="@/assets/icons/previousLight.svg"
            class="DraggablePlayer-contentTopIcon--outside"
          />
        </button>
        <button
          v-if="paused"
          class="DraggablePlayer-miniPlayerPlay"
          @click="play"
          :disabled="disableWhileFetching"
        >
          <img
            v-if="getDarkMode"
            src="@/assets/icons/playDark.svg"
            class="DraggablePlayer-contentTopIcon--outside"
          />
          <img
            v-else
            src="@/assets/icons/playLight.svg"
            class="DraggablePlayer-contentTopIcon--outside"
          />
        </button>
        <button
          v-else
          class="DraggablePlayer-miniPlayerPause"
          @click="pause"
          :disabled="disableWhileFetching"
        >
          <img
            v-if="getDarkMode"
            src="@/assets/icons/pauseDark.svg"
            class="DraggablePlayer-contentTopIcon--outside"
          />
          <img
            v-else
            src="@/assets/icons/pauseLight.svg"
            class="DraggablePlayer-contentTopIcon--outside"
          />
        </button>
        <button class="DraggablePlayer-miniPlayerNext" @click="next">
          <img
            v-if="getDarkMode"
            src="@/assets/icons/nextDark.svg"
            class="DraggablePlayer-contentTopIcon--outside"
          />
          <img
            v-else
            src="@/assets/icons/nextLight.svg"
            class="DraggablePlayer-contentTopIcon--outside"
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
            v-if="getDarkMode"
            src="@/assets/icons/returnDark.svg"
            class="DraggablePlayer-contentTopIcon"
          />
          <img
            v-else
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
          <div v-else class="DraggablePlayer-contentSliderSelection">
            <div class="DraggablePlayer-contentSliderSelectionPrevious">
              <div class="DraggablePlayer-contentSliderPreviousImageContainer">
                <img
                  v-if="previousTrack"
                  loading="lazy"
                  :src="getPreviousFullScaleImage"
                  class="DraggablePlayer-contentSliderPreviousArtwork"
                />
              </div>
            </div>
            <div class="DraggablePlayer-contentSliderSelectionCurrent">
              <div class="DraggablePlayer-contentSliderCurrentImageContainer">
                <img
                  loading="lazy"
                  :src="getCurrentFullScaleImage"
                  class="DraggablePlayer-contentSliderCurrentArtwork"
                />
                <img
                  loading="lazy"
                  :src="getCurrentFullScaleImage"
                  class="DraggablePlayer-contentSliderCurrentArtwork--blurred"
                />
              </div>
            </div>
            <div class="DraggablePlayer-contentSliderSelectionNext">
              <div class="DraggablePlayer-contentSliderNextImageContainer">
                <img
                  v-if="nextTrack"
                  loading="lazy"
                  :src="getNextFullScaleImage"
                  class="DraggablePlayer-contentSliderNextArtwork"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="DraggablePlayer-contentSliderCurrentInfos">
        <p
          v-if="currentTitle"
          id="title"
          class="DraggablePlayer-contentSliderCurrentTitle"
          :class="{
            'DraggablePlayer-contentSliderCurrentTitle--scrollThrough':
              scrollThroughTitle,
          }"
        >
          {{ currentTitle }}
        </p>
        <p
          v-if="currentArtist"
          id="artist"
          class="DraggablePlayer-contentSliderCurrentArtist"
          :class="{
            'DraggablePlayer-contentSliderCurrentArtist--scrollThrough':
              scrollThroughArtist,
          }"
        >
          {{ currentArtist }}
        </p>
      </div>
      <div class="DraggablePlayer-contentAdditionalControls">
        <button
          :class="{
            'DraggablePlayer-contentRepeat--one': loopOne,
            'DraggablePlayer-contentRepeat--all': loopAll,
          }"
          class="DraggablePlayer-contentRepeat Touch"
          @click="repeat"
        >
          <img
            v-if="getDarkMode"
            src="@/assets/icons/loopDark.svg"
            class="DraggablePlayer-contentTopIcon--inside"
          />
          <img
            v-else
            src="@/assets/icons/loopLight.svg"
            class="DraggablePlayer-contentTopIcon--inside"
          />
        </button>
        <button
          :class="{ 'DraggablePlayer-contentShuffle--active': shuffleActive }"
          class="DraggablePlayer-contentShuffle Touch"
          @click="shuffle"
        >
          <img
            v-if="getDarkMode"
            src="@/assets/icons/shuffleDark.svg"
            class="DraggablePlayer-contentTopIcon--inside"
          />
          <img
            v-else
            src="@/assets/icons/shuffleLight.svg"
            class="DraggablePlayer-contentTopIcon--inside"
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
            @touchstart="startSeek"
            @touchmove="onSeek"
            @touchend="endSeek"
          ></div>
          <div
            id="progress-bar"
            class="DraggablePlayer-contentBarProgress"
            :style="progressStyle"
          ></div>
        </div>
      </div>
      <div class="DraggablePlayer-contentControls">
        <button
          class="DraggablePlayer-contentControlsPrevious Touch"
          @click="previous"
        >
          <img
            v-if="getDarkMode"
            src="@/assets/icons/previousDark.svg"
            class="DraggablePlayer-contentControlsIcon"
          />
          <img
            v-else
            src="@/assets/icons/previousLight.svg"
            class="DraggablePlayer-contentControlsIcon"
          />
        </button>
        <button
          v-if="paused"
          class="DraggablePlayer-contentControlsPlay Touch"
          @click="play"
          :disabled="disableWhileFetching"
        >
          <img
            v-if="getDarkMode"
            src="@/assets/icons/playDark.svg"
            class="DraggablePlayer-contentControlsIcon"
          />
          <img
            v-else
            src="@/assets/icons/playLight.svg"
            class="DraggablePlayer-contentControlsIcon"
          />
        </button>
        <button
          v-else
          class="DraggablePlayer-contentControlsPause Touch"
          @click="pause"
          :disabled="disableWhileFetching"
        >
          <img
            v-if="getDarkMode"
            src="@/assets/icons/pauseDark.svg"
            class="DraggablePlayer-contentControlsIcon"
          />
          <img
            v-else
            src="@/assets/icons/pauseLight.svg"
            class="DraggablePlayer-contentControlsIcon"
          />
        </button>
        <button class="DraggablePlayer-contentControlsNext Touch" @click="next">
          <img
            v-if="getDarkMode"
            src="@/assets/icons/nextDark.svg"
            class="DraggablePlayer-contentControlsIcon"
          />
          <img
            v-else
            src="@/assets/icons/nextLight.svg"
            class="DraggablePlayer-contentControlsIcon"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { debounce, isEqual } from "lodash";
import store from "@/store";
import Vue, { PropType } from "vue";
import { mapGetters } from "vuex";
import { Track } from "@/interfaces/track";
import { StyleValue } from "vue/types/jsx";
import { MediaSession } from "@jofr/capacitor-media-session";

const INITIAL_POSITION = "12%";
const TRANSITION = "all 0.5s ease-in";
const BUTTON_TRANSFORM = "translateX(-50%) translateY(-2rem)";
const BUTTON_INITIAL = "translateX(-50%) translateY(0)";
const DEFAULT_OPACITY = 95;
const TOTAL_OPACITY = 100;
const INITIAL_DOTSTYLE = "translateX(0) translateY(-50%)";
const DOT_WIDTH = 20;

interface MediaSessionMetaData {
  title: string;
  artist: string;
  artwork: ArtworkItem[];
}

interface ArtworkItem {
  src: string;
  type: string;
  sizes: string;
}

export default Vue.extend({
  data() {
    return {
      viewportHeight: 0,
      maxHeight: 0,
      topBound: 0,
      startDragY: 0,
      isSeeking: false,
      isDragging: false,
      draggableStyle: {} as StyleValue,
      contentStyle: {} as StyleValue,
      miniPlayerStyle: {} as StyleValue,
      buttonStyle: {} as StyleValue,
      dotStyle: {} as StyleValue,
      progressStyle: {} as StyleValue,
      barWidth: 0,
      dotMaxBound: 0,
      initialPlayerPosition: 0,
      currentPlayerPosition: 0,
      currentDotPosition: { x: 0, y: 0 },
      seekOffset: { x: 0, y: 0 },
      hideContent: true,
      hideMiniPlayer: false,
      initialDuration: "00:00",
      initialRemaining: "00:00",
      audio: {} as HTMLAudioElement,
      paused: true,
      currentTime: 0,
      currentSongDuration: 0,
      currentSongEnded: false,
      displayedCurrentTime: "00:00",
      disableWhileFetching: false,
      loopOne: false,
      loopAll: false,
      shuffleActive: false,
      shuffleArray: [] as number[],
      mediaSessionMetadata: {
        title: "",
        artist: "",
        artwork: [],
      } as MediaSessionMetaData,
      title: {} as HTMLElement | null,
      artist: {} as HTMLElement | null,
      draggableWidth: 0,
      scrollThroughTitle: false,
      scrollThroughArtist: false,
      updateHandler: (() => {
        /* initial handler */
      }) as (ev: Event) => void,
      playHandler: (() => {
        /* initial handler */
      }) as (ev: Event) => void,
      pauseHandler: (() => {
        /* initial handler */
      }) as (ev: Event) => void,
      endHandler: (() => {
        /* initial handler */
      }) as (ev: Event) => void,
      visibilityHandler: (() => {
        /* initial handler */
      }) as (ev: Event) => void,
    };
  },
  props: {
    filteredList: {
      type: Array as PropType<Track[]>,
      default: () => [],
    },
  },
  mounted() {
    this.audio = new Audio("");
    this.viewportHeight = window.innerHeight;

    const player = document.getElementById("player");
    const draggable = document.getElementById("draggable");
    const bar = document.getElementById("bar");

    if (bar && draggable && player) {
      this.barWidth = bar.offsetWidth;
      this.dotMaxBound = this.barWidth - DOT_WIDTH;
      this.audio = new Audio("");
      this.maxHeight = player.offsetHeight;
      this.topBound = this.viewportHeight - this.maxHeight;
      this.draggableWidth = draggable.offsetWidth;
    }

    this.updateHandler = this.updateTime;
    this.playHandler = this.onPlay;
    this.pauseHandler = this.onPause;
    this.endHandler = this.onEnded;
    this.visibilityHandler = this.handleVisibility;

    document.addEventListener("visibilitychange", this.visibilityHandler);

    this.next = debounce(this.next, 200);
    this.previous = debounce(this.previous, 200);
  },
  beforeDestroy() {
    document.removeEventListener("visibilitychange", this.visibilityHandler);
  },
  computed: {
    ...mapGetters([
      "getCurrentMediaUrl",
      "getCurrentSong",
      "getFavorites",
      "getNextUrl",
      "getDarkMode",
    ]),
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
    getCurrentFullScaleImage(): string {
      if (this.currentMediaArtwork) {
        const highDefinitionUrl = this.currentMediaArtwork.replace(
          "-large",
          "-t500x500"
        );
        return highDefinitionUrl;
      } else if (!this.currentMediaArtwork && !!this.currentAvatarArtwork) {
        const highDefinitionUrl = this.currentAvatarArtwork.replace(
          "-large",
          "-t500x500"
        );
        return highDefinitionUrl;
      } else {
        return "";
      }
    },
    currentArtist(): string {
      return this.getCurrentSong.user
        ? this.getCurrentSong.user.username
        : null;
    },
    currentTitle(): string {
      return this.getCurrentSong ? this.getCurrentSong.title : null;
    },
    queue(): Track[] {
      return this.filteredList ? this.filteredList : [];
    },
    currentSongIndex(): number | null {
      if (this.queue) {
        return this.queue.findIndex((item) =>
          isEqual(item, this.getCurrentSong)
        );
      }
      return null;
    },
    previousTrack(): Track | undefined | null {
      let previous = {} as Track;
      if (this.currentSongIndex) {
        previous = this.queue[this.currentSongIndex - 1];
      }

      if (this.currentSongIndex === 0) {
        return null;
      }

      if (previous) {
        return previous;
      }

      return null;
    },
    previousMediaArtwork(): string | null {
      return this.previousTrack ? this.previousTrack.artwork_url : null;
    },
    previousAvatarArtwork(): string | null {
      return this.previousTrack && this.previousTrack.user
        ? this.previousTrack.user.avatar_url
        : null;
    },
    getPreviousFullScaleImage(): string {
      if (this.previousMediaArtwork) {
        const highDefinitionUrl = this.previousMediaArtwork.replace(
          "-large",
          "-t500x500"
        );
        return highDefinitionUrl;
      } else if (!this.previousMediaArtwork && !!this.previousAvatarArtwork) {
        const highDefinitionUrl = this.previousAvatarArtwork.replace(
          "-large",
          "-t500x500"
        );
        return highDefinitionUrl;
      } else {
        return "";
      }
    },
    nextTrack(): Track | undefined | null {
      let next = {} as Track;
      if (this.currentSongIndex !== null) {
        next = this.queue[this.currentSongIndex + 1];
      }

      if (this.currentSongIndex === -1) {
        return undefined;
      }
      if (next) {
        return next;
      }
      return null;
    },
    nextMediaArtwork(): string {
      return this.nextTrack ? this.nextTrack.artwork_url : "";
    },
    nextAvatarArtwork(): string {
      return this.nextTrack ? this.nextTrack.user.avatar_url : "";
    },
    getNextFullScaleImage(): string {
      if (this.nextMediaArtwork) {
        const highDefinitionUrl = this.nextMediaArtwork.replace(
          "-large",
          "-t500x500"
        );
        return highDefinitionUrl;
      } else if (!this.nextMediaArtwork && !!this.nextAvatarArtwork) {
        const highDefinitionUrl = this.nextAvatarArtwork.replace(
          "-large",
          "-t500x500"
        );
        return highDefinitionUrl;
      } else {
        return "";
      }
    },
    queueLength(): number {
      return this.queue ? this.queue.length : 0;
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
      this.currentPlayerPosition = e.touches[0].clientY;
      if (this.isDragging && this.currentPlayerPosition >= this.topBound) {
        this.draggableStyle = {
          height: `${this.viewportHeight - this.currentPlayerPosition}px`,
          transition: "none",
          opacity: `${TOTAL_OPACITY}%`,
          transform: `translate3d(0, 0, 0)`,
        };
        let positionFraction =
          (this.viewportHeight - this.topBound - this.currentPlayerPosition) /
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
      this.currentPlayerPosition = e.changedTouches[0].clientY;
      const direction = this.currentPlayerPosition - this.startDragY;
      const thirdScreen = window.innerHeight / 3;
      const twoThirdScreen = (window.innerHeight * 2) / 3;
      // remove unnecessary initial modifier when style is controled by the drag movement
      this.hideContent = false;

      if (direction < 0) {
        // Dragging Up, reach MAX_TOP
        if (this.currentPlayerPosition > twoThirdScreen) {
          // Dragging up but didn't drag up to two third of the screen
          this.dragDown();
        } else {
          this.dragUp();
        }
      } else {
        // Dragging Down, reach INITIAL_POSITION
        if (this.currentPlayerPosition < thirdScreen) {
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
        transform: `translate3d(0, 0, 0)`,
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
        transform: `translate3d(0, 0, 0)`,
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
    startSeek(e: TouchEvent) {
      this.isSeeking = true;
      let touch = e.touches[0];
      this.seekOffset.x = touch.clientX - this.currentDotPosition.x;
      this.seekHandler(touch);
    },
    onSeek(e: TouchEvent) {
      let touch = e.touches[0];
      this.seekHandler(touch);
    },
    async endSeek() {
      const songDuration = await this.getSongDuration();
      let progress = this.currentDotPosition.x / this.dotMaxBound;
      let newTime = songDuration * progress;
      if (this.audio && songDuration > 0) {
        this.audio.currentTime = newTime / 1000;
        MediaSession.setPositionState({
          position: this.audio.currentTime,
          duration: this.audio.duration,
        });
        if (this.paused) {
          this.onPause();
          this.isSeeking = false;
        } else {
          this.onPlay();
        }
      }
    },
    seekHandler(touch: Touch) {
      this.currentDotPosition.x = touch.clientX - this.seekOffset.x;
      if (this.currentDotPosition.x < 0) {
        this.currentDotPosition.x = 0;
      } else if (this.currentDotPosition.x > this.dotMaxBound) {
        this.currentDotPosition.x = this.dotMaxBound;
      }
      this.dotStyle = {
        transform: `translateX(${this.currentDotPosition.x}px) translateY(-50%)`,
        transition: "none",
      };
      this.progressStyle = {
        width: `${this.currentDotPosition.x + DOT_WIDTH}px`,
        transition: "none",
      };
    },
    previous() {
      if (this.previousTrack) {
        if (this.currentTime < 3000) {
          if (!this.shuffleActive) {
            store.dispatch("updateSong", {
              track: this.previousTrack,
              mediaUrl: this.previousTrack.media.transcodings[1].url,
            });
          } else {
            const randomTrack = this.getRandomSong();
            if (randomTrack) {
              store.dispatch("updateSong", {
                track: randomTrack,
                mediaUrl: randomTrack.media.transcodings[1].url,
              });
            }
          }
        } else {
          this.replayCurrentSong(false);
        }
      } else {
        this.replayCurrentSong(false);
      }
    },
    replayCurrentSong(withPlay: boolean) {
      this.resetDotPosition();
      this.resetDotAnimation();
      this.audio.currentTime = 0;
      if (withPlay) {
        this.audio.play();
      } else {
        MediaSession.setPositionState({
          position: 0,
          duration: this.audio.duration,
        });
      }
    },
    play() {
      if (!!this.audio && !!this.getCurrentMediaUrl) {
        this.audio.play();
        this.onPlay();
      }
    },
    pause() {
      if (!!this.audio && !!this.getCurrentMediaUrl) {
        this.audio.pause();
        this.onPause();
      }
    },
    next() {
      if (this.loopAll && !this.nextTrack) {
        const firstSong = this.queue.find((item) => item !== undefined);
        if (firstSong) {
          store.dispatch("updateSong", {
            track: firstSong,
            mediaUrl: firstSong.media.transcodings[1].url,
          });
        }
        return;
      }
      if (this.nextTrack && !this.shuffleActive) {
        store.dispatch("updateSong", {
          track: this.nextTrack,
          mediaUrl: this.nextTrack.media.transcodings[1].url,
        });
      } else if (!this.nextTrack && !this.shuffleActive) {
        return;
      } else if (this.shuffleActive) {
        const randomTrack = this.getRandomSong();
        if (randomTrack) {
          store.dispatch("updateSong", {
            track: randomTrack,
            mediaUrl: randomTrack.media.transcodings[1].url,
          });
        }
      }
    },
    repeat() {
      if (!this.loopAll && !this.loopOne) {
        this.loopOne = true;
      } else if (this.loopOne && !this.loopAll) {
        this.loopAll = true;
        this.loopOne = false;
      } else {
        this.loopAll = false;
      }
    },
    shuffle() {
      if (!this.shuffleActive) {
        this.shuffleActive = true;
        this.$emit("getNextFavorites");
      } else {
        this.shuffleActive = false;
      }
    },
    getRandomSong(): Track | undefined {
      if (this.shuffleArray.length === this.queueLength) {
        this.shuffleArray = [];
      }
      let randomIndex = -1;
      let track = {} as Track | undefined;
      while (
        (this.shuffleArray.includes(randomIndex) &&
          this.shuffleArray.length < this.queueLength) ||
        randomIndex === -1
      ) {
        randomIndex = this.generateRandomNumber();
      }
      this.shuffleArray.push(randomIndex);
      track = this.queue[randomIndex];
      return track;
    },
    generateRandomNumber(): number {
      return this.queueLength
        ? Math.floor(Math.random() * this.queueLength)
        : 0;
    },
    updateTime(): Promise<number> {
      return new Promise((resolve) => {
        this.currentTime = this.audio.currentTime * 1000;
        this.currentDotPosition.x = this.getDotPosition();
        this.displayedCurrentTime = this.computeTime(
          Math.trunc(this.currentTime)
        );
        resolve(this.currentTime);
      });
    },
    async onPlay() {
      MediaSession.setPositionState({
        position: this.audio.currentTime,
        duration: this.audio.duration,
      });

      MediaSession.setPlaybackState({
        playbackState: "playing",
      });

      this.paused = false;
      const remainingDuration =
        this.currentSongDuration - (await this.updateTime());
      this.currentSongEnded = false;

      if (this.currentDotPosition.x === 0 && !this.currentSongEnded) {
        this.resetDotAnimation();
      } else if (
        this.currentDotPosition.x < this.dotMaxBound &&
        this.currentDotPosition.x > 0 &&
        !this.currentSongEnded
      ) {
        this.dotStyle = {
          transform: `translateX(${this.currentDotPosition.x}px) translateY(-50%)`,
          transition: "none",
        };
        this.progressStyle = {
          width: `${this.currentDotPosition.x + DOT_WIDTH}px`,
          transition: "none",
        };
        setTimeout(() => {
          this.dotStyle = {
            transform: `translateX(${this.dotMaxBound}px) translateY(-50%)`,
            transition: `transform ${remainingDuration}ms linear, background 0s`,
          };
          this.progressStyle = {
            width: `${this.barWidth}px`,
            transition: `width ${remainingDuration}ms linear, background 0s`,
          };
        }, 500);
      }

      this.isSeeking = false;
    },
    onPause() {
      MediaSession.setPositionState({
        position: this.audio.currentTime,
        duration: this.audio.duration,
      });

      MediaSession.setPlaybackState({
        playbackState: "paused",
      });

      this.paused = true;
      if (
        this.currentDotPosition.x > 0 &&
        this.currentDotPosition.x < this.dotMaxBound
      ) {
        this.dotStyle = {
          transform: `translateX(${this.currentDotPosition.x}px) translateY(-50%)`,
          transition: "none",
        };
        this.progressStyle = {
          width: `${this.currentDotPosition.x + DOT_WIDTH}px`,
          transition: "none",
        };
      }
    },
    onEnded() {
      this.currentSongEnded = true;
      this.currentTime = 0;
      setTimeout(() => {
        this.displayedCurrentTime = "00:00";
      }, 500);
      this.currentDotPosition = { x: 0, y: 0 };
      this.seekOffset = { x: 0, y: 0 };
      this.resetDotPosition();
      if (this.loopOne && !this.loopAll) {
        this.replayCurrentSong(true);
      } else if (this.loopAll && !this.loopOne) {
        if (this.queueLength === 1) {
          this.replayCurrentSong(true);
        }
        if (
          this.currentSongIndex === this.queueLength - 1 &&
          this.queueLength > 1
        ) {
          const firstSong = this.queue.find((item) => item !== undefined);
          if (firstSong) {
            store.dispatch("updateSong", {
              track: firstSong,
              mediaUrl: firstSong.media.transcodings[1].url,
            });
          }
        } else if (this.queueLength > 1) {
          this.next();
        }
      } else {
        this.next();
      }
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
    audioAvailability(): Promise<void> {
      return new Promise<void>(() => {
        this.audio.addEventListener("loadedmetadata", this.updateHandler, {
          once: true,
        });
      });
    },
    resetDotPosition() {
      this.dotStyle = {
        transform: `${INITIAL_DOTSTYLE}`,
        transition: "none",
      };
    },
    resetProgressBar() {
      this.progressStyle = {
        width: DOT_WIDTH,
        transition: "none",
      };
    },
    startAnimation() {
      this.dotStyle = {
        transform: `translateX(${this.dotMaxBound}px) translateY(-50%)`,
        transition: `transform ${this.currentSongDuration}ms linear, background 0s`,
      };
      this.progressStyle = {
        width: `${this.barWidth}px`,
        transition: `all ${this.currentSongDuration}ms linear, background 0s`,
      };
    },
    resetDotAnimation() {
      this.resetDotPosition();
      setTimeout(() => {
        this.startAnimation();
      }, 600);
    },
    getSongDuration(): Promise<number> {
      return new Promise((resolve) => {
        if (!this.audio.duration || this.currentSongDuration === 0) {
          this.audio.onloadedmetadata = () => {
            this.currentSongDuration = this.audio.duration * 1000;
            resolve(this.currentSongDuration);
            return;
          };
        }
        resolve(this.currentSongDuration);
      });
    },
    whenAudioReady(): Promise<boolean> {
      return new Promise((resolve, reject) => {
        const onCanPlayThrough = () => {
          this.audio.removeEventListener("canplaythrough", onCanPlayThrough);
          resolve(true);
        };

        const onError = (error: Event) => {
          this.audio.removeEventListener("error", onError);
          reject(error);
        };

        this.audio.addEventListener("canplaythrough", onCanPlayThrough);
        this.audio.addEventListener("error", onError);
      });
    },
    mediaSessionSetup() {
      MediaSession.setActionHandler({ action: "play" }, () => {
        this.play();
      });

      MediaSession.setActionHandler({ action: "pause" }, () => {
        this.pause();
      });

      MediaSession.setActionHandler({ action: "nexttrack" }, () => {
        this.next();
      });

      MediaSession.setActionHandler({ action: "previoustrack" }, () => {
        this.previous();
      });

      MediaSession.setActionHandler({ action: "seekto" }, (details) => {
        if (
          details &&
          details.seekTime !== null &&
          details.seekTime !== undefined
        ) {
          this.audio.currentTime = details.seekTime;
          this.updateOnExternalControl();
          MediaSession.setPositionState({
            position: this.audio.currentTime,
            duration: this.audio.duration,
          });
        }
      });
    },
    setMediaSessionMetaData(
      title: string,
      artist: string,
      artworkItems: ArtworkItem[]
    ) {
      this.mediaSessionMetadata.artwork = [];
      this.mediaSessionMetadata.title = title;
      this.mediaSessionMetadata.artist = artist;
      this.mediaSessionMetadata.artwork.push(...artworkItems);
    },
    handleVisibility() {
      if (!document.hidden && this.audio) {
        this.updateOnExternalControl();
      }
    },
    async updateOnExternalControl() {
      const remainingDuration =
        this.currentSongDuration - (await this.updateTime());
      const newPosition =
        (this.currentTime * this.dotMaxBound) / this.currentSongDuration;
      this.dotStyle = {
        transform: `translateX(${newPosition}px) translateY(-50%)`,
        transition: "none",
      };
      this.progressStyle = {
        width: `${newPosition + DOT_WIDTH}px`,
        transition: "none",
      };
      if (!this.paused) {
        setTimeout(() => {
          this.dotStyle = {
            transform: `translateX(${this.dotMaxBound}px) translateY(-50%)`,
            transition: `transform ${remainingDuration}ms linear, background 0s`,
          };
          this.progressStyle = {
            width: `${this.barWidth}px`,
            transition: `all ${remainingDuration}ms linear, background 0s`,
          };
        }, 500);
      }
    },
  },
  watch: {
    getCurrentMediaUrl: {
      async handler(newVal) {
        if (this.audio) {
          await this.$nextTick();
          this.title = document.getElementById("title");
          this.artist = document.getElementById("artist");
          if (this.title && this.title.scrollWidth > this.draggableWidth) {
            this.scrollThroughTitle = true;
          } else {
            this.scrollThroughTitle = false;
          }
          if (this.artist && this.artist.scrollWidth > this.draggableWidth) {
            this.scrollThroughArtist = true;
          } else {
            this.scrollThroughArtist = false;
          }
          this.resetDotPosition();
          this.resetProgressBar();
          this.disableWhileFetching = true;
          this.audio.removeEventListener("timeupdate", this.updateHandler);
          this.audio.removeEventListener("play", this.playHandler);
          this.audio.removeEventListener("pause", this.pauseHandler);
          this.audio.removeEventListener("ended", this.endHandler);
          this.audio.pause();
          this.paused = true;
          this.audio.currentTime = 0;
          this.currentSongDuration = 0;
          this.audio.src = newVal.url;
          this.audio.addEventListener("timeupdate", this.updateHandler);
          this.audio.addEventListener("play", this.playHandler);
          this.audio.addEventListener("pause", this.pauseHandler);
          this.audio.addEventListener("ended", this.endHandler);
          this.mediaSessionSetup();
          this.getSongDuration().then((duration) => {
            this.currentSongDuration = duration;
            this.audio.play();
            this.paused = false;
            this.currentTime = 0;
            this.disableWhileFetching = false;
          });
          const artworkItems = [
            {
              src: this.getCurrentFullScaleImage,
              type: "image/jpg",
              sizes: "500x500",
            },
            {
              src: this.currentMediaArtwork
                ? this.currentMediaArtwork
                : this.currentAvatarArtwork,
              type: "image/jpg",
              sizes: "100x100",
            },
          ] as ArtworkItem[];
          this.setMediaSessionMetaData(
            this.currentTitle,
            this.currentArtist,
            artworkItems
          );
          this.whenAudioReady().then(() => {
            this.resetDotAnimation();
            this.resetProgressBar();
            MediaSession.setPositionState({
              position: this.audio.currentTime,
              duration: this.audio.duration,
            });
            MediaSession.setMetadata({
              ...this.mediaSessionMetadata,
            });
          });
        }
      },
      deep: true,
    },
    nextTrack: {
      handler(newVal) {
        if (newVal !== undefined && newVal === null) {
          this.$emit("getNextFavorites", true);
        }
      },
      deep: true,
      immediate: true,
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
  opacity: 95%;

  &--dark {
    background: $dark;

    & #{$block}-drag {
      &Button {
        background: $white;
      }
    }

    & #{$block}-miniPlayer {
      color: $white;

      &Title,
      &Artist {
        color: $white;
      }
    }

    & #{$block}-content {
      &Top {
        &Text {
          color: $white;
        }
      }

      &Slider {
        &Current {
          &Empty,
          &Title,
          &Artist {
            color: $white;
          }
        }
      }

      &Duration {
        color: $white;
      }

      &Bar {
        background: #{$white}80;

        &Progress {
          background: $white;
        }
      }

      &Dot {
        background: $white;
      }

      &Shuffle {
        &--active {
          &::after {
            background: $white;
          }
        }
      }

      &Repeat {
        &--one,
        &--all {
          &::after {
            color: $white;
          }
        }
      }
    }
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
      min-height: 4rem;
      min-width: 4rem;
    }

    &Song {
      display: flex;
      align-items: center;
      min-width: calc(100% - 10rem);
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
      margin-right: 1.5rem;
    }

    &Artist {
      font-size: $s;
      margin-top: 0.5rem;
    }

    &Title {
      font-weight: 600;
      font-size: $m;
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
    overflow: hidden;

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

      &Icon {
        width: 3rem;
        height: 3rem;

        &--inside {
          width: 3.5rem;
          height: 3.5rem;
        }

        &--outside {
          width: 2rem;
          height: 2rem;
        }
      }
    }

    &Slider {
      padding: 0 2rem;

      &Selection {
        display: flex;

        &Previous {
          margin-right: 1.5rem;
        }

        &Next {
          margin-left: 1.5rem;
        }

        &Previous,
        &Next {
          width: 25rem;
        }
      }

      &Previous {
        &ImageContainer {
          height: 30rem;
          display: flex;
          align-items: center;
        }

        &Artwork {
          height: 25rem;
          width: 25rem;
          border-radius: 3rem;
        }
      }

      &Next {
        &ImageContainer {
          height: 30rem;
          display: flex;
          align-items: center;
        }

        &Artwork {
          height: 25rem;
          width: 25rem;
          border-radius: 3rem;
        }
      }

      &Current {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100%;
        position: relative;

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
            z-index: -1;
            filter: blur(5rem);
            transform: scale(1.05) translateY(1rem) translate3d(0, 0, 0);
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
          margin-top: 2.5rem;
          text-align: center;
          line-height: 2.2rem;
          white-space: nowrap;
          width: calc(100vw - 3rem);
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

        &Title,
        &Artist {
          &--scrollThrough {
            animation: scrollThrough 15s linear infinite;
          }
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
      background: #{$black}80;
      border-radius: 5rem;
      margin-top: 1.5rem;
      position: relative;

      &Progress {
        background: $black;
        height: 0.5rem;
        width: 0;
        border-radius: 5rem;
        transform: translate3d(0, 0, 0);
      }
    }

    &Dot {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      height: 2rem;
      width: 2rem;
      border-radius: 50%;
      background: $black;
      transition: transform 0.5s ease-in, background 0s ease-in;
    }

    &Controls {
      width: calc(100% - 10rem);
      align-self: center;

      &Icon {
        height: 3.5rem;
        width: 3.5rem;
      }
    }

    &Repeat {
      &--one {
        &::after {
          content: "1";
          font-weight: 700;
        }
      }

      &--all {
        &::after {
          content: "all";
          font-weight: 700;
        }
      }
    }

    &Shuffle {
      position: relative;

      &--active {
        &::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translateX(-50%) translateY(50%);
          margin-top: 0.5rem;
          height: 0.5rem;
          width: 0.5rem;
          display: block;
          border-radius: 50%;
          background: $black;
        }
      }
    }
  }
}
</style>
