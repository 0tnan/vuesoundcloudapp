import { ExternalURLs } from "./external-urls";
import { ImageObject } from "./image-object";
import { Owner } from "./owner";
import { Tracks } from "./tracks";

export interface PlaylistsItem {
  collaborative: boolean;
  description: string;
  external_urls: ExternalURLs;
  href: string;
  id: string;
  images: ImageObject[];
  name: string;
  owner: Owner;
  public: boolean;
  snapshot_id: string;
  tracks: Tracks;
  type: string;
  uri: string;
}
