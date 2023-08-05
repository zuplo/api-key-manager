import { useAuth0 } from "@auth0/auth0-react";
import ApiKeyManager from "@zuplo/react-api-key-manager";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../components/layout";
import Loading from "../components/loading";
import { getRequiredEnvVar } from "../env";

function Keys() {
  const router = useRouter();
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [accessToken, setAccessToken] = useState<string | undefined>();
  const apiUrl = getRequiredEnvVar("NEXT_PUBLIC_API_URL");

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

  // If the user is not authenticated, redirect to the index page
  if (!isLoading && !isAuthenticated) {
    router.push("/");
  }

  return (
    <Layout>
      {accessToken ? (
        <ApiKeyManager apiUrl={apiUrl} accessToken={accessToken} />
      ) : (
        <Loading />
      )}
    </Layout>
  );
}

export default Keys;
