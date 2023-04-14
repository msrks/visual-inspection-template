export interface ImageCaptures {
  images: Image[];
}

export interface Image {
  imageId: string;
  imagePath: string;
  lightingCondition: string;
}

export type Label = "ok" | "ng" | "invalid";
