/* eslint-disable @next/next/no-img-element */
import { useAuth0 } from "@auth0/auth0-react";

function Header() {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  const onClick = () => {
    if (isAuthenticated) {
      logout();
    } else {
      loginWithRedirect();
    }
  };

  return (
    <header className="mb-10">
      <nav className="mx-auto flex items-center justify-between">
        <div className="flex flex-row items-center gap-x-2">
          <img
            src="https://cdn.zuplo.com/uploads/api-key-manager.svg"
            alt="api key manager logo"
            className="h-10 w-10"
          />
          <h1 className="font-bold">API Key Manager</h1>
        </div>
        <div className="flex flex-1 justify-end">
          <button
            onClick={onClick}
            className="text-sm font-semibold rounded hover:bg-pink-200 p-2"
          >
            {isAuthenticated ? "Logout" : "Login"}
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Header;
