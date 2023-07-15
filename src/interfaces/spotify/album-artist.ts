import { ExternalURLs } from "./external-urls";

export interface AlbumArtist {
  external_urls: ExternalURLs;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}
