import "@/styles/globals.css";
import { Auth0Provider } from "@auth0/auth0-react";
import "@zuplo/react-api-key-manager/styles.css";
import type { AppProps } from "next/app";
import { getRequiredEnvVar } from "../env";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps & { session: any }) {
  let redirectUri;
  if (typeof window !== "undefined") {
    redirectUri = window.location.origin;
  }

  const domain = getRequiredEnvVar("NEXT_PUBLIC_AUTH0_DOMAIN");
  const clientId = getRequiredEnvVar("NEXT_PUBLIC_AUTH0_CLIENT_ID");
  const audience = getRequiredEnvVar("NEXT_PUBLIC_AUTH0_AUDIENCE");

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        audience,
        scope: "openid profile email",
      }}
    >
      <Component {...pageProps} />
    </Auth0Provider>
  );
}
