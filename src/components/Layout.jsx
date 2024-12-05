import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Hub } from "aws-amplify/utils";

const Layout = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const listener = (data) => {
      switch (data.payload.event) {
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
        default:
          console.log("Auth event:", data.payload.event);
          break;
      }
    };

    Hub.listen("auth", listener);
  }, []);

  const slugs = [
    { slug: "/", name: "Latest Posts" },
    { slug: "/create-post", name: "Create Post" },
    { slug: "/profile", name: "Profile" },
  ];

  if (isSignedIn) {
    slugs.push({ slug: "/my-posts", name: "My Posts" });
  }

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
