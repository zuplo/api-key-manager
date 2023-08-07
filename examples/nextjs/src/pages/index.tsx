import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Layout from "../components/Layout";

export default function Home() {
  const { isAuthenticated } = useAuth0();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/keys");
    }
  }, [router, isAuthenticated]);

  return (
    <Layout>
      <div className="flex justify-center">Login to continue ↗️</div>
    </Layout>
  );
}
