import Vue from "vue";
import store from "@/store";
import { Track } from "@/interfaces/track";
import { mapGetters } from "vuex";

export default Vue.extend({
  props: {
    track: {
      type: Object as () => Track,
      required: true,
    },
  },
  methods: {
    setSong(track: Track) {
      store.dispatch("updateSong", {
        track: track,
        mediaUrl: this.mediaUrl,
      });
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
  },
  computed: {
    ...mapGetters(["getDarkMode"]),
    artwork(): string {
      return this.track.artwork_url;
    },
    title(): string {
      return this.track.title;
    },
    artist(): string {
      return this.track.user.username;
    },
    avatar(): string {
      return this.track.user.avatar_url;
    },
    mediaUrl(): string {
      return this.track.media.transcodings[1].url;
    },
  },
});
