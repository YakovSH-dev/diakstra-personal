import { initializeApp } from "firebase/app";

import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const app = initializeApp({
  apiKey: "AIzaSyAvGUAIWmogLko_qldCB3t5ZaRJ_W9InVo",
  authDomain: "diakstra-prod.firebaseapp.com",
  projectId: "diakstra-prod",
  storageBucket: "diakstra-prod.firebasestorage.app",
  messagingSenderId: "754910164313",
  appId: "1:754910164313:web:db3c1c7f86f0064fc84848",
  measurementId: "G-95PTFVV6RV",
});
const storage = getStorage(app);
const firestore = getFirestore(app, "diakstra-personal");
const auth = getAuth(app);

export { firestore, auth, storage };
