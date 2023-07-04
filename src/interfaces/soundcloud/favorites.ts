import { FavoriteItem } from "./favorite-item";

export interface Favorites {
  collection: FavoriteItem[];
  next_href: string;
  query_urn?: string;
}
