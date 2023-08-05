import { useAuth0 } from "@auth0/auth0-react";
import ApiKeyManager, {
  StandardApiKeyManagerProvider,
} from "@zuplo/react-api-key-manager";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../components/layout";
import Loading from "../components/loading";
import { getRequiredEnvVar } from "../env";

function Keys() {
  const router = useRouter();
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [accessToken, setAccessToken] = useState<string | undefined>();

  useEffect(() => {
    if (isAuthenticated) {
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
    }
  }, [getAccessTokenSilently, isAuthenticated]);

  if (!isLoading && !isAuthenticated) {
    router.push("/");
  }

  let content = <Loading />;
  if (accessToken) {
    const apiUrl = getRequiredEnvVar("NEXT_PUBLIC_API_URL");

    const provider = new StandardApiKeyManagerProvider(apiUrl, accessToken);
    // Why do we make the user create the provider, this should be the
    // easy mode to instantiate this manager...
    // <ReactAPIKeyManager apiUrl={apiUrl} accessToken={accessToken} />
    content = <ApiKeyManager provider={provider} />;
  }

  return <Layout>{content}</Layout>;
}

export default Keys;
