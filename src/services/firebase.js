import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBasnHTiqMU0QwhAV-30ot5KeI7_ZBD_MA",
  authDomain: "document-vault-c334f.firebaseapp.com",
  projectId: "document-vault-c334f",
  storageBucket: "document-vault-c334f.firebasestorage.app",
  messagingSenderId: "691727246079",
  appId: "1:691727246079:web:b6d579930bfc524e5762ca",
  measurementId: "G-X936QD4PEL",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

// Auto-detect long polling: avoids the Firestore WebChannel stream getting
// blocked by ad blockers / VPNs / networks, which makes writes hang even
// though the data is saved (visible only after a refresh).
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
});
