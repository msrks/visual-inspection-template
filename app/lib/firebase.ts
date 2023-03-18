import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
};

let app: FirebaseApp;

if (getApps().length < 1) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const db = getFirestore(app);
const func = getFunctions(app, "asia-northeast1");
const storage = getStorage(app);

if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true") {
  console.log("setup to connect local firebase emulator suite");
  try {
    const _config = require("../firebase.json");
    console.log(_config.emulators);
    connectFirestoreEmulator(db, "localhost", _config.emulators.firestore.port);
    // connectStorageEmulator(storage, "localhost", _config.emulators.storage.port);
    connectFunctionsEmulator(func, "localhost", _config.emulators.functions.port);
  } catch (e) {
    console.log(e);
  }
}

export { app, db, func, storage };
