// ..backend/functions/src/config/firebase.js

import admin from "firebase-admin";
import { createRequire } from "module"; 
const require = createRequire(import.meta.url);

if (!admin.apps.length) { admin.initializeApp({}); }

// Export Firestore to use on services (DAO)
export const db = admin.firestore();