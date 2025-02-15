import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Hub } from "aws-amplify/utils";
import { getCurrentUser } from "@aws-amplify/auth";

const Layout = () => {
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
  }, [navigate]);

  const slugs = [
    { slug: "/", name: "Latest Posts" },
    { slug: "/profile", name: "Profile" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-black text-white p-4">
        <nav className="container mx-auto flex justify-between items-center">
          <div className="text-lg font-bold">My Blog</div>
          <ul className="flex gap-6">
            {slugs.map(({ slug, name }, index) => (
              <li key={index}>
                <NavLink
                  to={slug}
                  className={({ isActive }) =>
                    `hover:text-blue-400 ${
                      isActive ? "text-blue-500 font-bold" : "    "
                    }`
                  }
                >
                  {name}
                </NavLink>
              </li>
            ))}

            {!isSignedIn && (
              <li>
                <NavLink
                  to="/sign-in"
                  className={({ isActive }) =>
                    `hover:text-blue-400 ${
                      isActive ? "text-blue-500 font-bold" : ""
                    }`
                  }
                >
                  Sign In
                </NavLink>
              </li>
            )}

            {isSignedIn && (
              <>
                <li>
                  <NavLink
                    to="/create-post"
                    className={({ isActive }) =>
                      `hover:text-blue-400 ${
                        isActive ? "text-blue-500 font-bold" : ""
                      }`
                    }
                  >
                    Create Post
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/my-posts"
                    className={({ isActive }) =>
                      `hover:text-blue-400 ${
                        isActive ? "text-blue-500 font-bold" : ""
                      }`
                    }
                  >
                    My Posts
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/logout"
                    className={({ isActive }) =>
                      `hover:text-blue-400 ${
                        isActive ? "text-blue-500 font-bold" : ""
                      }`
                    }
                  >
                    Logout
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>

      <main className="flex-1 container mx-auto p-4">
        <Outlet />
      </main>

      <footer className="bg-black text-white text-center p-4">
        <p>&copy; {new Date().getFullYear()} My Blog. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
