import axios from "axios";
import { getRandomAnimal, getUrl } from "./dogs-vs-cats";
import { func, db, v2 } from "./firebase";
import * as fs from "fs";
import { BUCKET } from "./env";
import { Animal, Image, LabelingMethod, LightingCondition, PredResponse } from "./_types";
import * as sharp from "sharp";
import { Storage } from "@google-cloud/storage";

const storage = new Storage();

const MODEL_TYPE = "tflite";
const URL = `https://visual-inspection-template.web.app/predict?modelType=${MODEL_TYPE}`;
const MATRIX: sharp.Matrix3x3 = [
  [0.3588, 0.7044, 0.1368],
  [0.299, 0.587, 0.114],
  [0.2392, 0.4696, 0.0912],
];

const getPrediction = async (filePath: string) => {
  const img = fs.readFileSync(filePath);
  const b64img = Buffer.from(img).toString("base64");
  const res = await axios.post<PredResponse>(URL, JSON.stringify({ image: b64img }), {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

const fetchImage = async (url: string, dstLocalPath: string) => {
  const res = await axios.get<fs.WriteStream>(url, { responseType: "stream" });
  const w = res.data.pipe(fs.createWriteStream(dstLocalPath));
  await new Promise((resolve) => w.on("finish", resolve));
  // v2.logger.info(`finish downloading to ${localPath}`);
};

const uploadImage = async (srcLocalPath: string, dstGcsPath: string) => {
  await storage.bucket(BUCKET).upload(srcLocalPath, { destination: dstGcsPath });
};

const saveToDB = async (
  imageId: string,
  dstPath: string,
  lightingCondition: LightingCondition,
  labelingMethod: LabelingMethod,
  label?: Animal,
  predConfidence?: number
) => {
  await db.collection("images").add({
    imageId,
    bucket: BUCKET,
    dstPath,
    lightingCondition,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...(labelingMethod === "humanLabeling" && { humanLabel: label }),
    ...(labelingMethod === "aiLabeling" && { predLabel: label }),
    ...(labelingMethod === "aiLabeling" && { predConfidence }),
    // ...(labelingMethod === "aiLabeling" && { modelId }),
  } as Image);
};

const getFilenameAndPath = (url: string) => {
  const fnameOriginal = Date.now() + "-" + url.split("/").slice(-1)[0];
  const fnameConverted = Date.now() + "-converted-" + url.split("/").slice(-1)[0];
  const localPath = `/tmp/${fnameOriginal}`;
  const localPathConverted = `/tmp/${fnameConverted}`;
  return { fnameOriginal, fnameConverted, localPath, localPathConverted };
};

const doDemoJob = async (labelingMethod: LabelingMethod) => {
  let confidence;
  let animal = getRandomAnimal();
  const url = await getUrl(animal);
  const { fnameOriginal, fnameConverted, localPath, localPathConverted } = getFilenameAndPath(url);

  await fetchImage(url, localPath);

  // original image
  if (labelingMethod === "aiLabeling") {
    const pred = await getPrediction(localPath);
    animal = pred.result;
    confidence = pred.confidences[animal];
  }
  const dstPathOriginal = `rawdata/${labelingMethod}/original/${animal}/${fnameOriginal}`;
  await uploadImage(localPath, dstPathOriginal);
  await saveToDB(fnameOriginal, dstPathOriginal, "original", labelingMethod, animal, confidence);

  // converted image
  await sharp(localPath).recomb(MATRIX).toFile(localPathConverted);
  if (labelingMethod === "aiLabeling") {
    const pred = await getPrediction(localPathConverted);
    animal = pred.result;
    confidence = pred.confidences[animal];
  }
  const dstPathConverted = `rawdata/${labelingMethod}/converted/${animal}/${fnameConverted}`;
  await uploadImage(localPathConverted, dstPathConverted);
  await saveToDB(fnameConverted, dstPathConverted, "converted", labelingMethod, animal, confidence);
};

export const fetchmultipleimages = func.https.onCall(async (num: number) => {
  await Promise.all(
    [...Array(num)].map(async () => {
      await doDemoJob("humanLabeling");
    })
  );
});

export const fetcheveryhour = v2.scheduler.onSchedule({ schedule: "30 0 * * *" }, async () => {
  await doDemoJob("aiLabeling");
});
