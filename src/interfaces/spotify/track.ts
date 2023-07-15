import { Album } from "./album";
import { ExternalIDS } from "./external-ids";
import { ExternalURLs } from "./external-urls";
import { LinkedFrom } from "./linked-from";
import { Restrictions } from "./restrictions";
import { TrackArtist } from "./track-artist";

export interface Track {
  album: Album;
  artists: TrackArtist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: ExternalIDS;
  external_urls: ExternalURLs;
  href: string;
  id: string;
  is_playable: boolean;
  linked_from: LinkedFrom;
  restrictions: Restrictions;
  name: string;
  popularity: number;
  preview_url: string;
  track_number: number;
  type: string;
  uri: string;
  is_local: boolean;
}
