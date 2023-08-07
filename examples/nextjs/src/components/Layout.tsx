import { useAuth0 } from "@auth0/auth0-react";
import { PropsWithChildren } from "react";
import Authenticating from "./Authenticating";
import Header from "./Header";
function Layout({ children }: PropsWithChildren) {
  const { isLoading } = useAuth0();

  return (
    <div className="container mx-auto p-6">
      <Header />
      <main>{isLoading ? <Authenticating /> : children}</main>
    </div>
  );
}

export default Layout;
