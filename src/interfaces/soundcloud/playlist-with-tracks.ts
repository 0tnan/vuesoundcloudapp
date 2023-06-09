import { Track } from "./track";
import { User } from "./user";

export interface PlaylistWithTracks {
  artwork_url: string;
  created_at: Date;
  description: string;
  duration: number;
  embeddable_by: string;
  genre: string;
  id: number;
  kind: string;
  label_name: string;
  last_modified: Date;
  license: string;
  likes_count: number;
  managed_by_feeds: boolean;
  permalink: string;
  permalink_url: string;
  public: boolean;
  purchase_title: null;
  purchase_url: null;
  release_date: Date;
  reposts_count: number;
  secret_token: null;
  sharing: string;
  tag_list: string;
  title: string;
  uri: string;
  user_id: number;
  set_type: string;
  is_album: boolean;
  published_at: Date;
  display_date: Date;
  user: User;
  tracks: Track[];
  track_count: number;
}
