import { useAuth } from "react-oidc-context";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useMemo } from "react";

// 1. Define the Type here so it's reusable
interface CognitoJwtPayload extends JwtPayload {
  "cognito:groups"?: string[];
}

export const useUserRoles = () => {
  const auth = useAuth();

  // 2. Use useMemo to calculate roles only when the token changes
  const roleData = useMemo(() => {
    // Default state if not logged in
    const defaultState = { 
      isAdmin: false, 
      groups: [] as string[] 
    };

    if (!auth.isAuthenticated || !auth.user?.access_token) {
      return defaultState;
    }

    try {
      // Decode the token
      const decoded = jwtDecode(auth.user.access_token) as CognitoJwtPayload;
      const groups = decoded["cognito:groups"] || [];

      return {
        groups: groups,
        isAdmin: groups.includes("Admins"),     // Change "Admins" to your exact group name
      };
    } catch (error) {
      console.error("Failed to decode token", error);
      return defaultState;
    }
  }, [auth.isAuthenticated, auth.user?.access_token]); // Dependency array

  return roleData;
};