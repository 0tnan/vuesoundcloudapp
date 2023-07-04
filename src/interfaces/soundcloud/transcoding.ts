import { Format } from "./format";

export interface Transcoding {
  url: string;
  preset: string;
  duration: number;
  snipped: boolean;
  format: Format;
  quality: string;
}
