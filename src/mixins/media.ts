import Vue, { PropType } from "vue";
import store from "@/store";
import { Track as SoundCloudTrack } from "@/interfaces/soundcloud/track";
import { Track as SpotifyTrack } from "@/interfaces/spotify/track";
import { mapGetters } from "vuex";

enum Type {
  soundCloudTrack = "SOUNDCLOUD_TRACK",
  spotifyPlaylist = "SPOTIFY_PLAYLIST",
  spotifyTrack = "SPOTIFY_TRACK",
}

export default Vue.extend({
  props: {
    soundCloudTrack: {
      type: Object as PropType<SoundCloudTrack>,
      default: null,
    },
    spotifyTrack: {
      type: Object as PropType<SpotifyTrack>,
      default: null,
    },
    initiator: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: Type.soundCloudTrack,
    },
    playlistSource: {
      type: String,
      default: "",
    },
    playlistName: {
      type: String,
      default: "",
    },
    playlistDescription: {
      type: String,
      default: "",
    },
  },
  methods: {
    setSoundCloudSong() {
      store.dispatch("updateSoundCloudSong", {
        track: this.soundCloudTrack,
        mediaUrl: this.soundCloudMediaUrl,
        initiator: this.initiator,
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
    isSoundCloudTrack(): boolean {
      return this.type === Type.soundCloudTrack;
    },
    isSpotifyPlaylist(): boolean {
      return this.type === Type.spotifyPlaylist;
    },
    isSpotifyTrack(): boolean {
      return this.type === Type.spotifyTrack;
    },
    soundCloudArtwork(): string {
      return this.soundCloudTrack.artwork_url;
    },
    soundCloudTitle(): string {
      return this.soundCloudTrack.title;
    },
    soundCloudArtist(): string {
      return this.soundCloudTrack.user.username;
    },
    soundCloudAvatar(): string {
      return this.soundCloudTrack.user.avatar_url;
    },
    soundCloudMediaUrl(): string {
      return this.soundCloudTrack.media.transcodings[1].url;
    },
    spotifyArtwork(): string {
      return this.spotifyTrack.album.images[0].url;
    },
    spotifyTitle(): string {
      return this.spotifyTrack.name;
    },
    spotifyArtists(): string {
      const artistsString = this.spotifyTrack.artists
        .map((artist) => artist.name)
        .join(", ");
      return artistsString;
    },
  },
});
