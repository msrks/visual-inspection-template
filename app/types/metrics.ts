import { Timestamp } from "./firebase";

export type Metrics = {
  num: number;
  numUnreviewed: number;
  date: string;
  createdAt: Timestamp;
  updatedAT: Timestamp;
};
