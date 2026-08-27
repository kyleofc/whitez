import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  type Auth,
} from "firebase/auth";
import {
  initializeAppCheck,
  ReCaptchaV3Provider,
  type AppCheck,
} from "firebase/app-check";

/**
 * Configuração pública do Firebase (mesma do projeto WhiteZ).
 * Inicialização preguiçosa: nada roda em escopo de módulo, o que mantém o
 * SSR seguro — os getters só são chamados a partir de efeitos/handlers.
 */
export const firebaseConfig = {
  apiKey: "AIzaSyA62dZjhaqqNK1hZ2WIpxa0mmImJoUkIrc",
  authDomain: "whitez.firebaseapp.com",
  projectId: "whitez",
  storageBucket: "whitez.firebasestorage.app",
  messagingSenderId: "573414239535",
  appId: "1:573414239535:web:018dc88826e5afd25c05da",
  measurementId: "G-2FF8VSFEPH",
};

let appRef: FirebaseApp | null = null;
let dbRef: Firestore | null = null;
let authRef: Auth | null = null;
let appCheckRef: AppCheck | null = null;

/**
 * Chave do site reCAPTCHA v3 (pública, criada em App Check no console Firebase).
 * Sem isso configurado no console, o App Check bloqueia TODAS as escritas —
 * então só faça o deploy depois de registrar o provider no Firebase.
 */
const RECAPTCHA_V3_SITE_KEY = "6LcqzHstAAAAAFEsHPdHAFyWpLt1foD3tbeIyRZ3";

export function getFirebaseApp(): FirebaseApp {
  if (!appRef) {
    appRef = getApps()[0] ?? initializeApp(firebaseConfig);
  }
  if (!appCheckRef && typeof window !== "undefined") {
    appCheckRef = initializeAppCheck(appRef, {
      provider: new ReCaptchaV3Provider(RECAPTCHA_V3_SITE_KEY),
      isTokenAutoRefreshEnabled: true,
    });
  }
  return appRef;
}

export function getDb(): Firestore {
  if (!dbRef) dbRef = getFirestore(getFirebaseApp());
  return dbRef;
}

export function getFirebaseAuth(): Auth {
  if (!authRef) {
    authRef = getAuth(getFirebaseApp());
    void setPersistence(authRef, browserLocalPersistence).catch(() => {});
  }
  return authRef;
}
