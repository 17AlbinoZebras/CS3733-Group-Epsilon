"use client";

import { AuthContextProps, useAuth } from "react-oidc-context";
import { useUserRoles } from "../hooks/useRoles";

interface NavbarInterface {
  auth: AuthContextProps;
}

export default function Navbar() {
  const auth = useAuth();

  const { isAdmin, groups } = useUserRoles();

  if (auth.isAuthenticated) {
    if (!isAdmin) {
      return (
        <div>
          <pre> Hello: {auth.user?.profile.email} </pre>
          <pre> ID Token: {auth.user?.id_token} </pre>
          <pre> Access Token: {auth.user?.access_token} </pre>
          <pre> Refresh Token: {auth.user?.refresh_token} </pre>
          <pre> User Groups: {groups.join(", ")} </pre>
        </div>
      );
    }
    else {
      return (
        <div>
          <pre> Hello Admin: {auth.user?.profile.email} </pre>
          <pre> ID Token: {auth.user?.id_token} </pre>
          <pre> Access Token: {auth.user?.access_token} </pre>
          <pre> Refresh Token: {auth.user?.refresh_token} </pre>
          <pre> User Groups: {groups.join(", ")} </pre>
        </div>
      )
    }
  }
}
