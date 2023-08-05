import { useAuth0 } from "@auth0/auth0-react";
import ApiKeyManager, {
  StandardApiKeyManagerProvider,
} from "@zuplo/react-api-key-manager";
import { useEffect, useState } from "react";
import { getRequiredEnvVar } from "../env";

export default function Home() {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [accessToken, setAccessToken] = useState<string | undefined>();

  useEffect(() => {
    const audience = getRequiredEnvVar("NEXT_PUBLIC_AUTH0_AUDIENCE");
    const getToken = async () => {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience,
        },
      });
      setAccessToken(token);
    };

    getToken();
  }, [getAccessTokenSilently]);

  if (!isAuthenticated) {
    // eslint-disable-next-line @next/next/no-html-link-for-pages
    return <a href="/auth">Login</a>;
  }

  if (!accessToken) {
    return <p>Loading...</p>;
  }

  const apiUrl = getRequiredEnvVar("NEXT_PUBLIC_API_URL");

  const provider = new StandardApiKeyManagerProvider(apiUrl, accessToken);

  return (
    <main>
      <ApiKeyManager provider={provider} />
      {/* 
      Why do we make the user create the provider, this should be the 
      easy mode to instantiate this manager...
      <ReactAPIKeyManager apiUrl={apiUrl} accessToken={accessToken} /> 
      */}
    </main>
  );
}
