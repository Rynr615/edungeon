// mobile/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../services/firebase";

interface UserProfile {
  id_user: string;
  nama: string;
  username: string;
  email: string;
  kelas: string;
  total_exp: number;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isNewUser: boolean;
  idToken: string | null;
  loginEmail: (email: string, pass: string) => Promise<void>;
  registerEmail: (email: string, pass: string) => Promise<void>;
  submitOnboardingData: (nama: string, username: string, kelas: string) => Promise<void>;
  logoutUser: () => Promise<void>;
  fetchProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:5000";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const [idToken, setIdToken] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!auth.currentUser) return;
    try {
      const token = await auth.currentUser.getIdToken(true);
      setIdToken(token);

      const res = await fetch(`${API_BASE_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();

      if (result.status === "success") {
        if (result.is_new_user) {
          setIsNewUser(true);
          setUserProfile(null);
        } else {
          setIsNewUser(false);
          setUserProfile(result.data);
        }
      }
    } catch (err: any) {
      
      console.error("[AuthContext] Error fetchProfile:", err);
      console.log("=== DEBUG FIREBASE AUTH ERROR ===");
      console.log("Error Code:", err?.code);
      console.log("Error Message:", err?.message);
      console.log("Error CustomData:", err?.customData);
      console.log("Full Error:", JSON.stringify(err, null, 2));
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser: User | null) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile();
      } else {
        setUserProfile(null);
        setIdToken(null);
        setIsNewUser(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginEmail = async (email: string, pass: string) => {
    setLoading(true);
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const registerEmail = async (email: string, pass: string) => {
    setLoading(true);
    await createUserWithEmailAndPassword(auth, email, pass);
  };

  const submitOnboardingData = async (nama: string, username: string, kelas: string) => {
    if (!user) return;
    const token = await user.getIdToken();
    const res = await fetch(`${API_BASE_URL}/api/user/onboarding`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nama, username, kelas }),
    });

    const result = await res.json();
    if (result.status === "success") {
      setIsNewUser(false);
      setUserProfile(result.data);
    } else {
      throw new Error(result.message || "Gagal menyimpan onboarding");
    }
  };

  const logoutUser = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        isNewUser,
        idToken,
        loginEmail,
        registerEmail,
        submitOnboardingData,
        logoutUser,
        fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);