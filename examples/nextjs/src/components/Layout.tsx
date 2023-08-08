import { useAuth0 } from "@auth0/auth0-react";
import { PropsWithChildren } from "react";
import Authenticating from "./Authenticating";
import Header from "./Header";
import ThemeProvider from "@/contexts/ThemeContext";
function Layout({ children }: PropsWithChildren) {
  const { isLoading } = useAuth0();

  return (
    <ThemeProvider>
      <div className="w-screen h-screen bg-white dark:bg-[#1a1f36]">
        <div className="container mx-auto p-6 ">
          <Header />
          <main>{isLoading ? <Authenticating /> : children}</main>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default Layout;
