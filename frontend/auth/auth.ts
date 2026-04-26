import { UserManager, UserManagerSettings } from "oidc-client-ts";

export const cognitoAuthConfig : UserManagerSettings = {
    authority: process.env.NEXT_PUBLIC_AUTHORITY!,
    client_id: process.env.NEXT_PUBLIC_CLIENT_ID!,
    redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI!,
    response_type: process.env.NEXT_PUBLIC_RESPONSE_TYPE!,
    scope: process.env.NEXT_PUBLIC_SCOPE!,
};

export async function signOutRedirect () {
    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID!;
    const logoutUri = process.env.NEXT_PUBLIC_REDIRECT_URI!;
    const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN!;
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
};