"use client";

import { useAuth } from "react-oidc-context";
import HomePage from "../../components/HomePage";
import { useAuthCleanup } from "../../hooks/useAuthCleanup";
import LoadingScreen from "../../components/LoadingScreen";
import LandingPage from "../../components/LandingPage";

export default function Home() {
  const auth = useAuth();
  
  // 1. Cleanup authentication errors from URL
  useAuthCleanup(auth);

  // 1. Handle Loading
  if (auth.isLoading) {
    return <LoadingScreen />;
  }

  // 3. Authenticated State (Render the new Component)
  if (auth.isAuthenticated) {
    return <HomePage />;
  }

  // 4. Unauthenticated State (Default) / Error / Recoverable State
  return (
    <LandingPage onSignin={() => auth.signinRedirect()} />
  );
}
