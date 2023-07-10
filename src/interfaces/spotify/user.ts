import { ExplicitContent } from "./explicit-content";
import { ExternalURLs } from "./external-urls";
import { Followers } from "./followers";
import { ImageObject } from "./image-object";

export interface User {
  country: string;
  display_name: string;
  email: string;
  explicit_content: ExplicitContent;
  external_urls: ExternalURLs;
  followers: Followers;
  href: string;
  id: string;
  images: ImageObject[];
  product: string;
  type: string;
  uri: string;
}
