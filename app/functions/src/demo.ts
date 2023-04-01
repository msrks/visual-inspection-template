import axios from "axios";
import { getRandomAnimal, getUrl } from "./dogs-vs-cats";
import { func, db } from "./firebase";
import * as fs from "fs";
import { BUCKET } from "./env";
import { Image } from "./_types";
import * as sharp from "sharp";

import { Storage } from "@google-cloud/storage";
const storage = new Storage();

// export const fetcheveryhour = v2.scheduler.onSchedule("0 * * * *", async () => {
//   await fetchImage();
// });

const fetchAndUploadImage = async (
  url: string,
  filenameOriginal: string,
  filenameConverted: string,
  dstPathOriginal: string,
  dstPathConverted: string
) => {
  // const url = await getRandomUrl();
  const localPath = `/tmp/${filenameOriginal}`;
  const localPathConverted = `/tmp/${filenameConverted}`;

  const res = await axios.get<fs.WriteStream>(url, { responseType: "stream" });
  const w = res.data.pipe(fs.createWriteStream(localPath));
  w.on("finish", async () => {
    // v2.logger.info(`finish downloading to ${localPath}`);
    await storage.bucket(BUCKET).upload(localPath, { destination: dstPathOriginal });
    await sharp(localPath)
      .recomb([
        [0.3588, 0.7044, 0.1368],
        [0.299, 0.587, 0.114],
        [0.2392, 0.4696, 0.0912],
      ])
      .toFile(localPathConverted);
    await storage.bucket(BUCKET).upload(localPathConverted, { destination: dstPathConverted });
  });
};

export const fetchmultipleimages = func.https.onCall(async (num: number) => {
  await Promise.all(
    [...Array(num)].map(async () => {
      const animal = getRandomAnimal();
      const url = await getUrl(animal);
      const filenameOriginal = Date.now() + "-" + url.split("/").slice(-1)[0];
      const filenameConverted = Date.now() + "-converted-" + url.split("/").slice(-1)[0];
      const dstPathOriginal = `rawdata/humanLabeling/original/${animal}/${filenameOriginal}`;
      const dstPathConverted = `rawdata/humanLabeling/converted/${animal}/${filenameConverted}`;

      // if (process.env.APP_ENV === "local") return;
      await fetchAndUploadImage(url, filenameOriginal, filenameConverted, dstPathOriginal, dstPathConverted);
      await db.collection("images").add({
        imageId: filenameOriginal,
        bucket: BUCKET,
        dstPath: dstPathOriginal,
        lightingCondition: "original",
        humanLabel: animal,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Image);
      await db.collection("images").add({
        imageId: filenameConverted,
        bucket: BUCKET,
        dstPath: dstPathConverted,
        lightingCondition: "converted",
        humanLabel: animal,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Image);
    })
  );
});
