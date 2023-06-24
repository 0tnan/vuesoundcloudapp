import { User } from "./user";

export interface Playlist {
  artwork_url: string;
  created_at: Date;
  display_date: Date;
  duration: number;
  id: number;
  is_album: boolean;
  kind: string;
  last_modified: Date;
  likes_count: number;
  managed_by_feeds: boolean;
  permalink: string;
  permalink_url: string;
  public: boolean;
  published_at: Date;
  release_date: null;
  reposts_count: number;
  secret_token: null;
  set_type: string;
  sharing: string;
  title: string;
  track_count: number;
  uri: string;
  user: User;
  user_id: number;
}
