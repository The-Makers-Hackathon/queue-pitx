"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useRef } from "react";
import { User, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from "firebase/auth";
import { getAuthInstance, initFirebase } from "@/lib/firebase";
import { fetchRoleByEmail, Role } from "@/lib/roles";

interface AuthCtx {
  user: User | null;
  role: Role | null;
  roleLoading: boolean;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx>({
  user: null,
  role: null,
  roleLoading: true,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<Role | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const lastEmail = useRef<string | null>(null);

  useEffect(() => {
    initFirebase();
    const auth = getAuthInstance();

    const unsub = auth.onAuthStateChanged((u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const email = user?.email ?? null;
    if (email === lastEmail.current) return;
    lastEmail.current = email;

    if (!email) {
      setRole(null);
      setRoleLoading(false);
      return;
    }

    setRoleLoading(true);
    fetchRoleByEmail(email).then((r) => {
      setRole(r);
      setRoleLoading(false);
    });
  }, [user]);

  const signIn = async () => {
    const auth = getAuthInstance();
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signOut = async () => {
    await firebaseSignOut(getAuthInstance());
  };

  return (
    <AuthContext.Provider value={{ user, role, roleLoading, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
