"use client"

import {AuthProvider} from 'react-oidc-context'
import { ReactNode, useMemo } from 'react'
import {WebStorageStateStore} from 'oidc-client-ts'

interface AuthWrapperInterface {
	children: ReactNode
}

export default function AuthWrapper({children}: AuthWrapperInterface) {
	const cognitoAuthConfig = useMemo(() => {
		if (typeof window == "undefined") return null
		return {
			authority: process.env.NEXT_PUBLIC_AUTHORITY,
			client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
			redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
			response_type: process.env.NEXT_PUBLIC_RESPONSE_TYPE,
			scope: process.env.NEXT_PUBLIC_SCOPE,
			userStore: new WebStorageStateStore({ store: window.localStorage }),
			automaticSilentRenew: true,
			onSigninCallback: () => {
        window.history.replaceState(
          {}, 
          document.title, 
          window.location.pathname
        );
      }
		}
	}, [])

	return <AuthProvider {...cognitoAuthConfig}>{children}</AuthProvider>
}