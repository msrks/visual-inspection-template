export const PROJECT_ID = process.env.PROJECT_ID!;
export const BUCKET = process.env.BUCKET!;
export const BUCKET_URL = `gs://${process.env.BUCKET}`;

export const REGION = "us-central1";
export const PARENT = `projects/${PROJECT_ID}/locations/${REGION}`;
