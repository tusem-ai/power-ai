import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAfqC93dyxcvzofC8sT8_cyA807IEmsHJw",
  authDomain: "power-ai-21d0e.firebaseapp.com",
  projectId: "power-ai-21d0e",
  storageBucket: "power-ai-21d0e.firebasestorage.app",
  messagingSenderId: "554471557641",
  appId: "1:554471557641:web:4bf3995a0d9e45c115c6d8",
  measurementId: "G-NZL63SVQ4L"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    // KVKK UYUMU: Veritabanına isim, soyisim veya e-posta KAYDEDİLMEZ.
    // Sadece anonim UID tutulur.
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        userId: user.uid,
        createdAt: new Date(),
        role: "user"
      });
    }

    return {
      success: true,
      user: {
        uid: user.uid,
        displayName: user.displayName || "Kullanıcı"
      }
    };
  } catch (error) {
    console.error("Google giriş hatası:", error);
    return { success: false, error: error.message };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error("Çıkış hatası:", error);
    return { success: false, error: error.message };
  }
};