import { format } from "date-fns";
import { db, func, v2 } from "./firebase";
import { FieldValue } from "firebase-admin/firestore";
import { utcToZonedTime } from "date-fns-tz";
import { Image } from "./_types";

// export const createMetrics = func.pubsub
//   .schedule("0 0 * * *")
//   .timeZone("Asia/Tokyo")
//   .onRun(async () => {
//     const t = getUnixTime(startOfToday());
//     await db.doc(`metrics/${t.toString()}`).set({
//       num: 0,
//       date: format(startOfToday(), "yyyy-MM-dd"),
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     });
//   });

const getJstString = () => {
  const utcDate = new Date();
  const jstDate = utcToZonedTime(utcDate, "Asia/Tokyo");
  return format(jstDate, "yyyy-MM-dd");
};

export const createmetrics = v2.scheduler.onSchedule(
  {
    schedule: "0 15 * * *",
    // timeZone: "asia-northeast1",
  },
  async () => {
    const jstString = getJstString();
    v2.logger.info(`create: ${jstString}`);
    await db.doc(`metrics/${jstString}`).set({
      num: 0,
      numUnreviewed: 0,
      date: jstString,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
);

export const updateMetrics = func.firestore.document("/images/{imageId}").onCreate(async (snap) => {
  const img = snap.data() as Image;

  if (img.lightingCondition !== "original") return;

  const jstString = getJstString();
  await db.doc(`metrics/${jstString}`).update({
    num: FieldValue.increment(1),
    updatedAt: new Date(),
    ...(!img.humanLabel && { numUnreviewed: FieldValue.increment(1) }),
  });

  return;
});
