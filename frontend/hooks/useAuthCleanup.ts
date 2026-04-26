import { useEffect } from "react";
import { AuthContextProps } from "react-oidc-context";

export function useAuthCleanup(auth: AuthContextProps) {
  useEffect(() => {
    if (auth.error?.message.includes("No matching state")) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [auth.error]);
}