import { Timestamp } from "./firebase";

export interface Model {
  datasetId: string;
  gcsSourceUri: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lightingCondition: string;
  dateRange: [Timestamp, Timestamp];
  numImages: number;
  numDogs: number;
  numCats: number;
  modelId?: string;
  evalId?: string;
  auPrc?: number;
  state?: string;
  urlTflite?: string;
  urlSavedModel?: string;
}
