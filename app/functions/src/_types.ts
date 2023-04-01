export interface Image {
  lightingCondition: string;
  predLabel?: string;
  predConfidence?: number;
  humanLabel: string;
  modelId?: string;
  createdAt: Date;
  updatedAt: Date;
  brokenImage?: boolean;
  bucket: string;
  dstPath: string;
}

export type LightingCondition = "original" | "converted";

export interface Model {
  datasetId: string;
  gcsSourceUri: string;
  createdAt: Date;
  updatedAt: Date;
  lightingCondition: string;
  dateRange: [Date, Date];
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
