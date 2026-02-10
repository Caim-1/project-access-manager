/**
 * Initial Session Rehydration
 *
 * A startup check to restore authentication state when the app loads
 */
import { useEffect } from "react";
import { refreshToken } from "./refreshToken";
import { useAuth } from "./useAuth";

export function useSessionBootstrap() {
  const { setAccessToken } = useAuth();

  useEffect(() => {
    refreshToken().then((token) => {
      if (token) {
        setAccessToken(token);
      }
    });
  }, []);
}
