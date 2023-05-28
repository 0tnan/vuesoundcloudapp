import { Media } from "./media";
import { PublisherMetadata } from "./publisher-metadata";
import { User } from "./user";

export interface Track {
  artwork_url: string;
  caption: null;
  commentable: boolean;
  comment_count: number;
  created_at: Date;
  description: string;
  downloadable: boolean;
  download_count: number;
  duration: number;
  full_duration: number;
  embeddable_by: string;
  genre: string;
  has_downloads_left: boolean;
  id: number;
  kind: string;
  label_name: null;
  last_modified: Date;
  license: string;
  likes_count: number;
  permalink: string;
  permalink_url: string;
  playback_count: number;
  public: boolean;
  publisher_metadata: PublisherMetadata;
  purchase_title: string;
  purchase_url: string;
  release_date: null;
  reposts_count: number;
  secret_token: null;
  sharing: string;
  state: string;
  streamable: boolean;
  tag_list: string;
  title: string;
  track_format: string;
  uri: string;
  urn: string;
  user_id: number;
  visuals: null;
  waveform_url: string;
  display_date: Date;
  media: Media;
  station_urn: string;
  station_permalink: string;
  track_authorization: string;
  monetization_model: string;
  policy: string;
  user: User;
}
