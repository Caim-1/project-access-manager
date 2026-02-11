"use client";

import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { refreshToken } from "./refreshToken";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function bootstrapAuth() {
      try {
        const token = await refreshToken();
        setAccessToken(token);
      } catch {
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    }

    bootstrapAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
