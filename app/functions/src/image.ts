import { func } from "./firebase";
import { Storage } from "@google-cloud/storage";
import { Image } from "./_types";

const storage = new Storage();

export const cleanUpImageStorage = func.firestore.document("/images/{imageId}").onDelete(async (snap) => {
  const img = (await snap.data()) as Image;
  await storage.bucket(img.bucket).file(img.dstPath).delete();
});
