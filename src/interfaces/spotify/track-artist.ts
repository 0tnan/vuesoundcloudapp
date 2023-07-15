import { ExternalURLs } from "./external-urls";
import { Followers } from "./followers";
import { ImageObject } from "./image-object";

export interface TrackArtist {
  external_urls: ExternalURLs;
  followers: Followers;
  genres: string[];
  href: string;
  id: string;
  images: ImageObject[];
  name: string;
  popularity: number;
  type: string;
  uri: string;
}
