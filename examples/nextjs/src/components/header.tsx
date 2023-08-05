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
        <div>
          <h1 className="font-bold">API Key Manager</h1>
        </div>
        <div className="flex flex-1 justify-end">
          <button onClick={onClick} className="text-sm font-semibold">
            {isAuthenticated ? "Log out" : "Log in"}
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Header;
