import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const app = initializeApp();
const db = getFirestore(app);

import * as v1 from "firebase-functions/v1";
import * as v2 from "firebase-functions/v2";
v2.setGlobalOptions({ region: "asia-northeast1" });

const func = v1.region("asia-northeast1");
const logger = v1.logger;
// const config = functions.config();

export { func, logger, db, v2 };
