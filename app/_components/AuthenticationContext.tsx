"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "next/navigation";

// Context

type AuthenticationState = "loading" | "signed-in" | "signed-out";

const AuthenticationContext = createContext<{
  status: AuthenticationState;
  signIn: (email: string, password: string) => Promise<void>;
}>({
  status: "loading",
  signIn: async () => {},
});

export function useAuthenticationContext() {
  return useContext(AuthenticationContext);
}

// Provider

/**
 * Resolves user authentication.
 * @param children
 * @constructor
 */
export function AuthenticationContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [status, setStatus] = useState<AuthenticationState>("loading");
  const router = useRouter();

  // Update status when the user signs in or out.
  useEffect(() => {
    const listenerUnsubscribe = onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        setStatus("signed-in");
      } else {
        setStatus("signed-out");
        router.push("/login");
      }
    });

    return () => {
      listenerUnsubscribe();
    };
  }, [router]);

  /**
   * Sign in the user with email and password.
   */
  const signIn = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(getAuth(), email, password);
  }, []);

  const value = useMemo(() => {
    return {
      status,
      signIn,
    };
  }, [signIn, status]);

  return (
    <AuthenticationContext.Provider value={value}>
      {children}
    </AuthenticationContext.Provider>
  );
}
