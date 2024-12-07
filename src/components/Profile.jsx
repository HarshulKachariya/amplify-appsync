import { getCurrentUser, signOut } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import "@aws-amplify/ui-react/styles.css";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function currentAuthenticatedUser() {
      try {
        const user = await getCurrentUser();
        if (user) {
          setUser(user);
        } else {
          navigate("/sign-in");
        }
      } catch (err) {
        console.log(err);
      }
    }

    currentAuthenticatedUser();
  }, [navigate]);

  async function handleSignOut() {
    try {
      await signOut();
    } catch (error) {
      console.log("error signing out: ", error);
    }
  }

  return (
    <div className="mx-auto ">
      <div>My Account</div>
      {user && (
        <div>
          <h2>Username: {user.username}</h2>
          <h2>UserId: {user.userId}</h2>
          <h2>SignInDetails: {JSON.stringify(user.signInDetails)}</h2>
          <button
            onClick={handleSignOut}
            className="p-2.5 bg-black rounded-lg hover:shadow-lg text-white "
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
