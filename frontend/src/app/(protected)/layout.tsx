"use client";

import { useAuth } from "react-oidc-context";
import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Use Next.js router for internal redirects

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If finished loading and NOT authenticated...
    if (!auth.isLoading && !auth.isAuthenticated) {
      // Option A: Redirect to Home Page to show the "Sign In" button
      router.push("/");

      // Option B: Immediately redirect to Cognito (Uncomment if you prefer this)
      // auth.signinRedirect();
    }
  }, [auth.isLoading, auth.isAuthenticated, router, auth]);

  // 1. Loading Spinner
  if (auth.isLoading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}
      >
        Loading application...
      </div>
    );
  }

  // 2. Authenticated? Show the page content (children)
  if (auth.isAuthenticated) {
    return <>{children}</>;
  }

  // 3. Not Authenticated? Render nothing (we are redirecting in useEffect)
  return null;
}
