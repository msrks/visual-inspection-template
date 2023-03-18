import { setTimeout } from "node:timers/promises";
import { func } from "./firebase";

export const retrainAI = func.https.onCall(async (dateRange: [Date, Date]) => {
  // TODO: send pubsub trigger to vertex pipeline
  await setTimeout(3000);
  console.log(dateRange);
  // return dateRange[0].toISOString() + " " + dateRange[1].toISOString();
  return "training finished successfully!";
});
