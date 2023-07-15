import { SavedTracksItem } from "./saved-tracks-item";

export interface SavedTracks {
  href: string;
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
  items: SavedTracksItem[];
}
