"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { crestStore, supabase } from "@/lib/data/store";
import type { AuthState } from "@/lib/types";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, name: string, password?: string) => Promise<void>;
  logout: () => void;
  completeOnboarding: (name: string) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    isOnboarded: false,
    email: "",
    name: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = crestStore.getAuth();
    setAuth(stored);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signIn(email.trim(), password);
    if (error || !data) {
      throw new Error(error?.message ?? "Invalid email or password.");
    }
    const authState = {
      isAuthenticated: true,
      isOnboarded: true,
      email: email.trim().toLowerCase(),
      name: "Kashish",
    };
    crestStore.setAuth(authState);
    setAuth(authState);
  };

  const signup = async (email: string, name: string) => {
    await supabase.auth.signUp(email, name);
    setAuth({ isAuthenticated: true, isOnboarded: false, email, name });
  };

  const logout = () => {
    crestStore.logout();
    setAuth({ isAuthenticated: false, isOnboarded: false, email: "", name: "" });
  };

  const completeOnboarding = (name: string) => {
    const updated = { ...auth, isOnboarded: true, name };
    crestStore.setAuth(updated);
    setAuth(updated);
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, signup, logout, completeOnboarding, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
