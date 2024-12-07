import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Hub } from "aws-amplify/utils";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const listener = (data) => {
      switch (data.payload.event) {
        case "signedIn":
          navigate("/");
          break;
        case "signedOut":
          navigate("/");
          break;
        case "signIn_failure":
          navigate("/sign-in");
          console.log("User sign-in failed");
          break;
        default:
          console.log("Auth event:", data.payload.event);
          break;
      }
    };

    Hub.listen("auth", listener);
  }, [navigate]);

  return <div>SignIn</div>;
};

export default withAuthenticator(SignIn);
