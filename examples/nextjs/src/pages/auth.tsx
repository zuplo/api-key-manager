import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();

  if (!isAuthenticated) {
    return (
      <button
        className="rounded bg-pink-500 text-white hover:bg-pink-600 px-2 py-1"
        onClick={() => {
          loginWithRedirect();
        }}
      >
        Login
      </button>
    );
  }

  return (
    <div>
      <img src={user?.picture} alt={user?.name} />
      <h2>{user?.name}</h2>
      <p>{user?.email}</p>
    </div>
  );
};

export default Profile;
