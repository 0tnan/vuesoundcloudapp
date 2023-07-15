import { AlbumArtist } from "./album-artist";
import { Copyright } from "./copyright";
import { ExternalIDS } from "./external-ids";
import { ExternalURLs } from "./external-urls";
import { ImageObject } from "./image-object";
import { Restrictions } from "./restrictions";

export interface Album {
  album_type: string;
  total_tracks: number;
  available_markets: string[];
  external_urls: ExternalURLs;
  href: string;
  id: string;
  images: ImageObject[];
  name: string;
  release_date: string;
  release_date_precision: string;
  restrictions: Restrictions;
  type: string;
  uri: string;
  copyrights: Copyright[];
  external_ids: ExternalIDS;
  genres: string[];
  label: string;
  popularity: number;
  album_group: string;
  artists: AlbumArtist[];
}
