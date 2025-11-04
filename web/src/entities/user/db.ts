import { getDoc, setDoc, doc } from "firebase/firestore";

import { firestore } from "@/shared/firebase";
import { paths } from "@/shared/paths";

import type { DiakstraUser } from "./types";

async function fetchUserProfile(userId: string) {
  try {
    const path = paths.user.profile(userId);
    const userProfile = getDoc(doc(firestore, path));
    return userProfile;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function setUserProfile(user: DiakstraUser) {
  try {
    const path = paths.user.profile(user.userId);
    await setDoc(doc(firestore, path), user);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export { fetchUserProfile, setUserProfile };
