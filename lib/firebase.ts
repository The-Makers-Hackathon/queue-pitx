import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getDatabase, Database, ref, onValue, set, off, remove } from "firebase/database";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp;
let db: Database;
let auth: Auth;

export function initFirebase() {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  db = getDatabase(app);
  auth = getAuth(app);
  return { app, db, auth };
}

export function getDb() {
  if (!db) {
    const { db: initializedDb } = initFirebase();
    return initializedDb;
  }
  return db;
}

export function getAuthInstance() {
  if (!auth) {
    const { auth: initializedAuth } = initFirebase();
    return initializedAuth;
  }
  return auth;
}

export { ref, onValue, set, off, remove };
