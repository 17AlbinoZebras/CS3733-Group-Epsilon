import axios from "axios";
import { useAuth } from "react-oidc-context";


export async function changePassword(accessToken: string, previousPassword: string, proposedPassword: string) {
    const endpoint = process.env.NEXT_PUBLIC_AUTHORITY;
    const requestBody = {
        "AccessToken": accessToken,
        "PreviousPassword": previousPassword,
        "ProposedPassword": proposedPassword
    }
    const config = {
        headers: {
            "Content-Type": "application/x-amz-json-1.1",
            "X-Amz-Target": "AWSCognitoIdentityProviderService.ChangePassword",
        }
    };
    try {
        const response = await axios.post(endpoint!, requestBody, config);
        // If successful (2xx), return 200
        return [200, "Password changed successfully."];
    } catch (error: any) {
        // If axios throws (4xx, 5xx), catch it here
        const status = error.response?.status || 500;
        const message = error.response?.data?.message || "An error occurred.";
        return [status, message];
    }
}