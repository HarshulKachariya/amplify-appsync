import { getCurrentUser, signIn } from "@aws-amplify/auth";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Hub } from "aws-amplify/utils";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    Hub.listen("auth", ({ payload }) => {
      switch (payload.event) {
        case "signedIn":
          setIsSignedIn(true);
          break;
        case "signedOut":
          setIsSignedIn(false);
          break;
        case "signIn_failure":
          setIsSignedIn(false);
          console.log("User sign-in failed");
          break;
      }
    });
  });

  const checkUserSignedInorNot2 = async () => {
    try {
      await getCurrentUser();
      setIsSignedIn(true);
    } catch (err) {
      console.error("Unauthorized....", err.message);
      setIsSignedIn(false);
    }
  };

  useEffect(() => {
    checkUserSignedInorNot2();
    if (signIn) {
      navigate("/");
    }
  }, [navigate]);

  return <div>SignIn</div>;
};

export default withAuthenticator(SignIn);
