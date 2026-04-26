import { useRouter } from "next/navigation";

export const handleLogout = (auth : any) : string => {
    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID!
    const logoutUri = process.env.NEXT_PUBLIC_REDIRECT_URI!
    const cognitoDomain = process.env.NEXT_PUBLIC_AUTHORITY!
    auth.removeUser();
    return `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`
  };
