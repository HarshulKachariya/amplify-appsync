import { generateClient } from "aws-amplify/api";
import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import { getCurrentUser } from "@aws-amplify/auth";
import { Navigate, useNavigate } from "react-router-dom";
import { postsByUsername } from "../graphql/queries";

const client = generateClient();

const MyPostsPage = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    async function currentAuthenticatedUser() {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        } else {
          navigate("/sign-in");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    }

    currentAuthenticatedUser();

    if (user) {
      fetchPosts();
    }
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await client.graphql({
        query: postsByUsername,
        variables: {
          username: user.username,
        },
      });
      setPosts(res.data.postsByUsername.items);
    } catch (error) {
      console.log("Error fetchig posts..", error.message);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">My Posts</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {posts.length !== 0 ? (
          posts.map((post, index) => <PostCard post={post} key={index} />)
        ) : (
          <div>No data Found</div>
        )}
      </div>
    </div>
  );
};

export default MyPostsPage;
