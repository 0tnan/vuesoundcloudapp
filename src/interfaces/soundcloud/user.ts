import { Badges } from "./badges";

export interface User {
  avatar_url: string;
  first_name: string;
  followers_count: number;
  full_name: string;
  id: number;
  kind: string;
  last_modified: Date;
  last_name: string;
  permalink: string;
  permalink_url: string;
  uri: string;
  urn: string;
  username: string;
  verified: boolean;
  city: string;
  country_code: string;
  badges: Badges;
  station_urn: string;
  station_permalink: string;
}
