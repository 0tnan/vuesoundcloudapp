import { Playlist } from "./playlist";
import { Track } from "./track";

export interface FavoriteItem {
  created_at: string;
  kind: string;
  track?: Track;
  playlist?: Playlist;
}
