import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getDb, getFirebaseAuth } from "@/lib/firebase";
import type { GameAppInput } from "./types";

/** Camada de acesso a dados — nenhuma UI aqui. */

export function createApp(data: GameAppInput) {
  return addDoc(collection(getDb(), "apps"), {
    ...data,
    isFeatured: false,
    createdAt: serverTimestamp(),
  });
}

export function updateApp(id: string, data: GameAppInput) {
  return updateDoc(doc(getDb(), "apps", id), { ...data });
}

export function deleteApp(id: string) {
  return deleteDoc(doc(getDb(), "apps", id));
}

export function setFeatured(id: string, isFeatured: boolean) {
  return updateDoc(doc(getDb(), "apps", id), { isFeatured });
}

export function createGenre(name: string) {
  return addDoc(collection(getDb(), "genres"), { name });
}

export function deleteGenre(id: string) {
  return deleteDoc(doc(getDb(), "genres", id));
}

export function loginAdmin(email: string, password: string) {
  return signInWithEmailAndPassword(getFirebaseAuth(), email, password);
}

export function logoutAdmin() {
  return signOut(getFirebaseAuth());
}
