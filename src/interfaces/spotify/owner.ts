import { ExternalURLs } from "./external-urls";
import { Followers } from "./followers";

export interface Owner {
  external_urls: ExternalURLs;
  followers: Followers;
  href: string;
  id: string;
  type: string;
  uri: string;
  display_name: string;
}
