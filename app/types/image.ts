import { Timestamp } from "./firebase";

export interface Image {
  lightingCondition: string;
  predLabel: string;
  predConfidence: number;
  humanLabel: string;
  modelId: string;
  imagePath: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  brokenImage?: boolean;
}
