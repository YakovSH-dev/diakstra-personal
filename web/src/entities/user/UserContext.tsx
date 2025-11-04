import { type User, onAuthStateChanged } from "firebase/auth";

import { auth } from "../../shared/firebase";

import { fetchUserProfile, setUserProfile } from "./db";
import { type DiakstraUser } from "./types";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useCallback,
} from "react";
import { createUser } from "./object";

type UserContextType = {
  loading: boolean; // overall loading (auth + profile bootstrap)
  user: User | null; // Firebase Auth user
  profile: DiakstraUser | undefined; // Firestore user profile
  updateProfile: (patch: Partial<DiakstraUser>) => Promise<void>;
};

const UserContext = createContext<UserContextType | null>(null);

const useUserContext = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("Error: User context used outside provider");
  return ctx;
};

function UserProvider({ children }: { children: ReactNode; mock?: boolean }) {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [profile, setProfile] = useState<DiakstraUser | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const updateProfile = useCallback(
    async (patch: Partial<DiakstraUser>) => {
      if (!user) return;
      const next: DiakstraUser = {
        ...(profile ?? createUser(user.uid, "technion")),
        ...patch,
        userId: user.uid, // guard against accidental change
      };
      await setUserProfile(next);
      setProfile(next);
    },
    [user, profile],
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setLoading(true);
      setUser(fbUser);

      if (!fbUser) {
        setProfile(undefined);
        setLoading(false);
        return;
      }

      try {
        const snap = await fetchUserProfile(fbUser.uid);
        if (!snap.exists()) {
          const newProfile = createUser(fbUser.uid, "technion");
          await setUserProfile(newProfile);
          setProfile(newProfile);
        } else {
          setProfile(snap.data() as DiakstraUser);
        }
      } catch (e) {
        console.error("Failed to bootstrap user profile", e);
        setProfile(undefined);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <UserContext.Provider value={{ loading, user, profile, updateProfile }}>
      {loading ? "...loading" : children}
    </UserContext.Provider>
  );
}

// eslint-disable-next-line
export { UserProvider, useUserContext };
