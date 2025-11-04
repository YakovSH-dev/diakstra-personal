import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { auth } from "@/shared/firebase";

import type { DiakstraUser } from "@/entities/user/types";

async function signIn() {
  const google = new GoogleAuthProvider();
  await signInWithPopup(auth, google);
}

function createUser(userId: string, university: string): DiakstraUser {
  return {
    userId: userId,
    university: university,
  };
}

export { signIn, createUser };
