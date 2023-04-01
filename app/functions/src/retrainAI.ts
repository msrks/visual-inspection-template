import { db, func } from "./firebase";
import { Image, LightingCondition, Model } from "./_types";
import * as fs from "fs";

import { Storage } from "@google-cloud/storage";
import { BUCKET } from "./env";
import { createDatasetImage, importDataImage } from "./vertexai/dataset";

const storage = new Storage();

export const retrainAI = func.https.onCall(
  async ({
    lightingCondition,
    dateRange,
  }: {
    lightingCondition: LightingCondition;
    dateRange: [Date, Date];
  }): Promise<string> => {
    console.log(lightingCondition);
    console.log(dateRange);
    const snap = await db
      .collection("images")
      .where("lightingCondition", "==", lightingCondition)
      .where("createdAt", ">=", new Date(dateRange[0]))
      .where("createdAt", "<=", new Date(dateRange[1]))
      .get();
    const urls = snap.docs.map((doc) => {
      const img = doc.data() as Image;
      return `gs://${BUCKET}/${img.dstPath},${img.humanLabel}`;
    });
    const timestamp = Date.now();
    const fileName = `${timestamp}.csv`;
    const stream = fs.createWriteStream(`/tmp/${fileName}`);
    stream.write(urls.join("\n"), "utf8");
    stream.end("\n");
    const destination = `job/${lightingCondition}/${fileName}`;
    await storage.bucket(BUCKET).upload(`/tmp/${fileName}`, { destination });

    const gcsSourceUri = `gs://${BUCKET}/${destination}`;
    const datasetId = await createDatasetImage({ displayName: `${timestamp}-${lightingCondition}` });
    await importDataImage({ datasetId, gcsSourceUri });

    await db.collection("models").add({
      datasetId,
      gcsSourceUri,
      createdAt: new Date(),
      updatedAt: new Date(),
      lightingCondition,
      dateRange,
      numImages: urls.length,
      numDogs: urls.filter((url) => url.split(",").slice(-1)[0] === "dog").length,
      numCats: urls.filter((url) => url.split(",").slice(-1)[0] === "cat").length,
      state: "prepairing",
    } as Model);
    return "";
  }
);
